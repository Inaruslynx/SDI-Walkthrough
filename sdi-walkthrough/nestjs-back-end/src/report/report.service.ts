import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';
import { std, mean, min, max, round } from 'mathjs';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async find(walkthrough: string) {
    /* const results = {};
    const resultsOfRecentLogs = {};
    const itemsOfConcern = {};
    // console.log(walkthrough);
    // get all logs which will be an array of objects
    const logs = await this.logModel
      .find({ name: walkthrough })
      .select('data -_id')
      .exec();
    const refinedLogs = logs.map((log) => {
      return log.data;
    });
    const newRefinedLogs = refinedLogs.map((data) => {
      const result = Object.fromEntries(
        Object.entries(data).filter(
          ([_key, value]) =>
            typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value)),
        ),
      );
      return result;
    });
    const lastLog = newRefinedLogs.pop();
    const beforeLastLog = newRefinedLogs[newRefinedLogs.length - 1];

    // Iterate over each key in lastLog
    Object.keys(lastLog).forEach((key) => {
      // Check if the key exists in beforeLastLog
      if (beforeLastLog.hasOwnProperty(key)) {
        // Calculate the difference and store it in the results object
        resultsOfRecentLogs[key] = round(
          Number(lastLog[key]) - Number(beforeLastLog[key]),
          2,
        );
      }
    });
    // console.log(resultsOfRecentLogs);

    // console.log(refinedLogs);
    Object.keys(newRefinedLogs[0]).forEach((key) => {
      // TODO add code to create items of concern
      let values = newRefinedLogs.map((data) => parseFloat(data[key]));
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
    return { lastLog, beforeLastLog, results, resultsOfRecentLogs }; */
    return 'Still in development';
  }
}
