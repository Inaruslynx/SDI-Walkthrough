// imports modules
const { v4: uuid } = require("uuid");
const { std, mean, min, max, round } = require("mathjs");
const path = require("path");
const {
  format,
  isToday,
  isBefore,
  endOfTomorrow,
  formatISO,
  addDays,
  subDays,
  set,
} = require("date-fns");

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

  // toDate will be YYYY-MM-DD
  const toDate = new Date();

  // FromDate will be YYYY-MM-DD
  const fromDate = subDays(new Date(), 30);

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
  let toDateObject = new Date(toDate);
  // console.log(toDateObject);

  // Set UTC hours for the new objects
  fromDateObject.setUTCHours(14, 0, 0, 0);
  if (!isToday(toDateObject)) {
    // console.log("Not today.");
    toDateObject.setUTCHours(14, 0, 0, 0);
  } else {
    // console.log("Submitted day is today.");
    toDateObject = new Date();
  }
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
    let itemDate = new Date(item.date);
    const sameDateAtFourteen = set(itemDate, {
      hours: 7,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    // console.log("before if statement");
    // console.log(itemDate, " : ", sameDateAtFourteen);
    if (isBefore(itemDate, sameDateAtFourteen)) {
      // console.log("adjusting time");
      // If before UTC 14:00, set the time to 14:01 the day before
      itemDate = subDays(
        set(itemDate, { hours: 7, minutes: 1, seconds: 0, milliseconds: 0 }),
        1
      );
      // console.log("New time:", itemDate)
    }
    // console.log(format(itemDate, "PPP"));
    return {
      value:
        item.data[dataSelection] === "true"
          ? 1
          : item.data[dataSelection] === "false"
          ? 0
          : item.data[dataSelection],
      date: format(itemDate, "PPP"),
    };
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
  // TODO: use derpartment
  const { department } = req.body
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
