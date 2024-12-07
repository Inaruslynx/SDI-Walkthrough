import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';
import { std, mean, min, max, round } from 'mathjs';
import { DataPointDocument } from 'src/schemas/DataPoints.schema';
// import { isToday } from 'date-fns';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async getReport(walkthrough: string): Promise<{
    lastLog;
    beforeLastLog;
    results;
    differenceOfRecentLogs;
    itemsOfConcern;
  }> {
    // console.log(walkthrough);
    // get all logs which will be an array of objects
    if (!walkthrough) {
      throw new BadRequestException(
        'No walkthrough selection in request to server',
      );
    }

    type Difference = {dataPoint: DataPointDocument, value: number};
    const differenceOfRecentLogs: Record<string, Difference> = {};
    const itemsOfConcern: Record<
      string,
      {
        dataPoint: DataPointDocument;
        issues: {
          type: string;
          value: number;
          range?: { Min: number; Max: number };
          threshold?: number;
        }[];
      }
    > = {};
    // let logs: LogDocument[] = [];
    // console.log('walkthrough:', walkthrough);

    const logs = await this.logModel
      .find({ walkthrough })
      .select('data date -_id')
      // .populate('data')
      .populate({ path: 'data', populate: { path: 'dataPoint' } })
      .lean()
      .exec();
    // console.log('logs:', logs);
    const rawData = logs.map((log) => {
      return log.data;
    });
    // console.log('rawData:', rawData);
    // TODO Need to fix this. Data will be an array of {dataPoint, value}
    const onlyNumberData = rawData.map((data) => {
      return data
        .filter((logData) => !isNaN(parseFloat(logData.value)))
        .map((logData) => ({
          dataPoint: logData.dataPoint,
          value: parseFloat(logData.value),
        }));
    });

    let lastLog: any;
    let beforeLastLog: any;
    // console.log('onlyNumberData:', onlyNumberData);
    lastLog = onlyNumberData.pop();
    // console.log('lastLog:', lastLog);
    if (onlyNumberData.length > 1) {
      beforeLastLog = onlyNumberData[onlyNumberData.length - 1];

      lastLog.forEach((logData: any) => {
        // Find the matching dataPoint in beforeLastLog
        // console.log('logData:', logData);
        // console.log('dataPoint:', logData.dataPoint);
        const matchingBeforeLog = beforeLastLog.find(
          (beforeLogData: any) =>
            beforeLogData.dataPoint._id === logData.dataPoint._id,
        );

        // If a match is found, calculate the difference
        if (matchingBeforeLog) {
          differenceOfRecentLogs[logData.dataPoint._id] = {
            dataPoint: logData.dataPoint,
            value: logData.value - matchingBeforeLog.value,
          };
        }
      });
    }

    let results: Record<
      string,
      {
        name: string;
        values: { mean: number; stdDev: number; min: number; max: number };
      }
    > = {};
    if (onlyNumberData.length > 0) {
      onlyNumberData.forEach((data) => {
        // TODO add code to create items of concern
        let valuesByDataPoint: Record<
          string,
          { text: string; values: number[] }
        > = {};
        data.forEach((logData) => {
          // console.log('logData:', logData);
          const dataText = logData.dataPoint.text as string;
          const dataPointId = logData.dataPoint.id as string;
          if (!valuesByDataPoint[dataPointId]) {
            valuesByDataPoint[dataPointId] = { text: dataText, values: [] };
          }
          valuesByDataPoint[dataPointId].values.push(logData.value);
        });
        // console.log('valuesByDataPoint:', valuesByDataPoint);
        Object.entries(valuesByDataPoint).forEach(
          ([dataPointId, { text: dataText, values }]) => {
            // console.log('dataPointId:', dataPointId);
            // console.log('dataText:', dataText);
            // console.log('values:', values);

            const Mean = round(mean(values), 2);
            // console.log('Mean:', Mean);
            const stdDev = round(Number(std(values, 'unbiased')), 2);
            // console.log('stdDev:', stdDev);
            const Min = min(values);
            // console.log('Min:', Min);
            const Max = max(values);
            // console.log('Max:', Max);
            results[dataPointId] = {
              name: dataText,
              values: { mean: Mean, stdDev, min: Min, max: Max },
            };
          },
        );
      });
    }

    if (lastLog && Object.keys(results).length > 0) {
      lastLog.forEach((logData: any) => {
        // console.log('logData:', logData);
        const dataPointId = logData.dataPoint._id as string;
        const result = results[dataPointId];
        if (!result) return; // Skip if results for this dataPoint do not exist

        const { min: Min, max: Max } = result.values;

        // Initialize the itemsOfConcern entry if it doesn't exist
        if (!itemsOfConcern[dataPointId]) {
          itemsOfConcern[dataPointId] = {
            dataPoint: logData.dataPoint,
            issues: [],
          };
        }

        // Check if the value is outside the allowed range
        if (logData.value < Min || logData.value > Max) {
          itemsOfConcern[dataPointId].issues.push({
            type: 'Out of range',
            value: logData.value,
            range: { Min, Max },
          });
        }
      });
    }

    if (Object.keys(differenceOfRecentLogs).length > 0 && Object.keys(results).length > 0) {
      for (const dataPointId in differenceOfRecentLogs) {
        const result = results[dataPointId];
        if (!result) return; // Skip if results for this dataPoint do not exist

        const { stdDev } = result.values;
        const absDifference = Math.abs(differenceOfRecentLogs[dataPointId].value);

        // Initialize the itemsOfConcern entry if it doesn't exist
        if (!itemsOfConcern[dataPointId]) {
          itemsOfConcern[dataPointId] = {
            dataPoint: differenceOfRecentLogs[dataPointId].dataPoint,
            issues: [],
          };
        }

        // Check if the absolute difference exceeds the standard deviation
        if (absDifference > stdDev) {
          itemsOfConcern[dataPointId].issues.push({
            type: 'Exceeds standard deviation',
            value: absDifference,
            threshold: stdDev,
          });
        }
      }
    }

    // console.log(lastLog);
    // This will send the report
    return {
      lastLog: lastLog ? lastLog : undefined,
      beforeLastLog: beforeLastLog ? beforeLastLog : undefined,
      results: Object.keys(results).length > 1 ? results : undefined,
      differenceOfRecentLogs:
        onlyNumberData.length > 1 ? differenceOfRecentLogs : undefined,
      itemsOfConcern: Object.keys(itemsOfConcern).length > 0 ? itemsOfConcern : undefined,
    };
  }
}
