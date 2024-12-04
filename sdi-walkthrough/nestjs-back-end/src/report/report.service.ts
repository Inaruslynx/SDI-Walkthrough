import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from 'src/schemas/logs.schema';
import { std, mean, min, max, round } from 'mathjs';
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

    const differenceOfRecentLogs = [{}];
    const itemsOfConcern = [{}];
    // let logs: LogDocument[] = [];
    console.log('walkthrough:', walkthrough);

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
    console.log('rawData:', rawData);
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
    console.log('onlyNumberData:', onlyNumberData);
    if (onlyNumberData.length > 1) {
      lastLog = onlyNumberData.pop();
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
          differenceOfRecentLogs.push({
            dataPoint: logData.dataPoint,
            value: logData.value - matchingBeforeLog.value,
          });
        }
      });
    }

    let results: {
      id: string;
      name: string;
      values: { mean: number; stdDev: number; min: number; max: number };
    }[] = [];
    onlyNumberData.forEach((data) => {
      // TODO add code to create items of concern
      let valuesByDataPoint: Record<
        string,
        { text: string; values: number[] }
      > = {};
      data.forEach((logData) => {
        console.log('logData:', logData);
        const dataText = logData.dataPoint.text as string;
        const dataPointId = logData.dataPoint.id as string;
        if (!valuesByDataPoint[dataPointId]) {
          valuesByDataPoint[dataPointId] = { text: dataText, values: [] };
        }
        valuesByDataPoint[dataPointId].values.push(logData.value);
      });
      console.log('valuesByDataPoint:', valuesByDataPoint);
      Object.entries(valuesByDataPoint).forEach(
        ([dataPointId, { text: dataText, values }]) => {
          console.log('dataPointId:', dataPointId);
          console.log('dataText:', dataText);
          console.log('values:', values);

          const Mean = round(mean(values), 2);
          console.log('Mean:', Mean);
          const stdDev = round(Number(std(values, 'unbiased')), 2);
          console.log('stdDev:', stdDev);
          const Min = min(values);
          console.log('Min:', Min);
          const Max = max(values);
          console.log('Max:', Max);
          results.push({
            id: dataPointId,
            name: dataText,
            values: { mean: Mean, stdDev, min: Min, max: Max },
          });
        },
      );
    });

    if (lastLog) {
      lastLog.forEach((logData: any) => {
        // console.log('logData:', logData);
        const dataPointId = logData.dataPoint._id as string;
        const result = results[dataPointId];
        if (!result) return; // Skip if results for this dataPoint do not exist

        const { Min, Max } = result;

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

    if (differenceOfRecentLogs.length > 0) {
      differenceOfRecentLogs.forEach((diffLog: any) => {
        if (Object.keys(diffLog).length === 0) {
          return;
        }
        // console.log('diffLog:', diffLog);
        const dataPointId = diffLog.dataPoint._id as string;
        const result = results[dataPointId];
        if (!result) return; // Skip if results for this dataPoint do not exist

        const { stdDev } = result;
        const absDifference = Math.abs(diffLog.value);

        // Initialize the itemsOfConcern entry if it doesn't exist
        if (!itemsOfConcern[dataPointId]) {
          itemsOfConcern[dataPointId] = {
            dataPoint: diffLog.dataPoint,
            issues: [],
          };
        }

        // Check if the absolute difference exceeds the standard deviation
        if (absDifference > stdDev) {
          itemsOfConcern[dataPointId].issues.push({
            type: 'Exceeds standard deviation',
            difference: diffLog.value,
            threshold: stdDev,
          });
        }
      });
    }

    // console.log(lastLog);
    // This will render the page
    return {
      lastLog: lastLog ? lastLog : undefined,
      beforeLastLog: beforeLastLog ? beforeLastLog : undefined,
      results,
      differenceOfRecentLogs:
        onlyNumberData.length > 1 ? differenceOfRecentLogs : undefined,
      itemsOfConcern: itemsOfConcern.length > 1 ? itemsOfConcern : undefined,
    };
    // return `${walkthrough} ${toDate} ${fromDate}`;
  }
}
