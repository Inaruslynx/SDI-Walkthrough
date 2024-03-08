// imports modules
const { v4: uuid } = require("uuid");
const { std, mean, min, max, round } = require("mathjs");
const path = require("path");

// import utils
const { sendEmail } = require("../utils/sendEmail");
const isDst = require("../utils/isDst");

//import models
const User = require("../models/users");
const Log = require("../models/logs");
const PasswordReset = require("../models/PasswordReset");
const Department = require("../models/departments");

/**
 * Retrieves the latest log data and processes dates to retrieve the date range.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} JSON object containing data points, toDate, and fromDate
 */

module.exports.getGraphData = async (req, res) => {
  const dataSelection = req.query.dataSelection;
  const result = await Log.findOne({}, "data").sort({ createdAt: -1 });
  let data = [];

  const nowDate = new Date();
  // console.log("This is nowDate before locale:", nowDate);
  let intermToDate = nowDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Chicago",
  });
  // console.log("After:", intermToDate);
  intermToDate = intermToDate.split("/");
  intermToDate = [
    intermToDate[2],
    intermToDate[0].padStart(2, "0"),
    intermToDate[1].padStart(2, "0"),
  ];
  // toDate will be YYYY-MM-DD
  const toDate = intermToDate.join("-");

  let intermFromDate = new Date(nowDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  // console.log("This is intermFromDate before locale", intermFromDate);
  intermFromDate = intermFromDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Chicago",
  });
  // console.log("After:", intermFromDate);
  intermFromDate = intermFromDate.split("/");
  intermFromDate = [
    intermFromDate[2],
    intermFromDate[0].padStart(2, "0"),
    intermFromDate[1].padStart(2, "0"),
  ];
  // FromDate will be YYYY-MM-DD
  const fromDate = intermFromDate.join("-");

  // console.log(result.data)
  if (result.data && typeof result.data === "object") {
    for (const key in result.data) {
      if (!key.includes("Note")) {
        data.push(key);
      }
    }
    // console.log(data)
  }
  res.json({ dataPoints: data, toDate, fromDate });
};

/**
 * Process the graph based on the provided data selection and date range.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} a promise that resolves with the selected data in JSON format
 */

module.exports.processGraphFetch = async (req, res) => {
  const { dataSelection, fromDate, toDate } = req.body;
  // console.log(dataSelection, fromDate, toDate);
  // Create new Date objects based on extracted values
  const fromDateObject = new Date(fromDate);
  const toDateObject = new Date(toDate);

  // Set UTC hours for the new objects
  fromDateObject.setUTCHours(14, 0, 0, 0);
  toDateObject.setUTCHours(14, 0, 0, 0);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  // console.log(dataSelection, fromDateObject, toDateObject);
  const result = await Log.find(
    { date: { $gte: fromDateObject, $lte: toDateObject } },
    ["data", "date"]
  ).exec();
  // console.log(result);
  /*
   * justSelectedData should send [{date: Date, value: number}]
   */
  const justSelectedData = result.map((item) => {
    const itemDate = item.date;
    const itemTimeUTC = itemDate.getUTCHours() * 60 + itemDate.getUTCMinutes(); // Convert time to minutes

    // Check if the time is before UTC 14:00
    if (itemTimeUTC < 14 * 60) {
      // If before UTC 14:00, set the time to 14:01 the day before
      const adjustedDate = new Date(itemDate);
      adjustedDate.setUTCDate(itemDate.getUTCDate() - 1);
      adjustedDate.setUTCHours(14, 1, 0, 0); // Set time to 14:01:00.000 UTC
      return {
        value:
          item.data[dataSelection] === "true"
            ? 1
            : item.data[dataSelection] === "false"
            ? 0
            : item.data[dataSelection],
        date: adjustedDate.toLocaleDateString("en-US", options),
      };
    } else {
      // If after or at UTC 14:00, keep the original date
      return {
        value:
          item.data[dataSelection] === "true"
            ? 1
            : item.data[dataSelection] === "false"
            ? 0
            : item.data[dataSelection],
        date: itemDate.toLocaleDateString("en-US", options),
      };
    }
  });

  // console.log(justSelectedData);
  res.json(justSelectedData);
};

/**
 * Asynchronous function to get report based on logs and send the result as JSON response.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Object} the JSON response containing lastLog, beforeLastLog, results, and resultsOfRecentLogs
 */

module.exports.getReport = async (req, res) => {
  const results = {};
  const resultsOfRecentLogs = {};
  // get all logs which will be an array of objects
  const logs = await Log.find().select("data -_id").exec();
  let refinedLogs = logs.map((log) => {
    //console.log(Object.entries(log.data));
    return log.data;
  });
  refinedLogs = refinedLogs.map((data) => {
    //console.log(data)
    let result = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) =>
          typeof parseFloat(value) === "number" && !isNaN(parseFloat(value))
      )
    );
    return result;
  });
  const lastLog = refinedLogs.pop();
  const beforeLastLog = refinedLogs[refinedLogs.length - 1];

  // Iterate over each key in lastLog
  Object.keys(lastLog).forEach((key) => {
    // Check if the key exists in beforeLastLog
    if (beforeLastLog.hasOwnProperty(key)) {
      // Calculate the difference and store it in the results object
      resultsOfRecentLogs[key] = round(lastLog[key] - beforeLastLog[key], 2);
    }
  });
  // console.log(resultsOfRecentLogs);

  // console.log(refinedLogs);
  Object.keys(refinedLogs[0]).forEach((key) => {
    let values = refinedLogs.map((data) => parseFloat(data[key]));
    values = values.filter((value) => !isNaN(value));
    const Mean = round(mean(values), 2);
    const stdDev = round(std(values), 2);
    const Min = min(values);
    const Max = max(values);
    results[key] = {
      Mean,
      stdDev,
      Min,
      Max,
    };
  });
  // console.log(lastLog);
  // This will render the page
  res.json({ lastLog, beforeLastLog, results, resultsOfRecentLogs });
};

module.exports.getDepartments = async (req, res) => {
  const departments = await Department.find().select("-_id").exec();
  res.json(departments);
};
