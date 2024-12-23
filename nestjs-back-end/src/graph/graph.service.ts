import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from 'src/schemas/logs.schema';
import { format, subDays, set, isToday, isBefore } from 'date-fns';

@Injectable()
export class GraphService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async getGraphData(
    walkthrough: string,
    selectedDataPoint: string,
    toDate: string,
    fromDate: string,
  ) {
    let logs;
    const fromDateObject = new Date(fromDate);
    const toDateObject = new Date(toDate);
    fromDateObject.setUTCHours(14, 0, 0, 0);
    if (!isToday(toDateObject)) {
      toDateObject.setUTCHours(14, 0, 0, 0);
    } else {
      toDateObject.setTime(new Date().getTime());
    }
    // console.log('walkthrough:', walkthrough);
    // console.log('selectedData', selectedDataPoint);
    if (!toDate && !fromDate) {
      logs = await this.logModel
        .find({ walkthrough })
        .select('data date -_id')
        .populate({ path: 'data', populate: { path: 'dataPoint' } })
        .lean()
        .exec();
    } else if (!toDate) {
      // console.log('fromDate only:', fromDateObject);
      logs = await this.logModel
        .find({ walkthrough, date: { $gte: fromDateObject } })
        .select('data date -_id')
        .populate({ path: 'data', populate: { path: 'dataPoint' } })
        .lean()
        .exec();
    } else if (!fromDate) {
      // console.log('toDate only:', toDateObject);
      logs = await this.logModel
        .find({ walkthrough, date: { $lte: toDateObject } })
        .select('data date -_id')
        .populate({ path: 'data', populate: { path: 'dataPoint' } })
        .lean()
        .exec();
    } else {
      // console.log('toDate:', toDateObject);
      // console.log('fromDate:', fromDateObject);
      logs = await this.logModel
        .find({
          walkthrough,
          date: { $gte: fromDateObject, $lte: toDateObject },
        })
        .select('data date -_id')
        .populate({ path: 'data', populate: { path: 'dataPoint' } })
        .lean()
        .exec();
    }

    // console.log('logs:', logs);

    const sendPackage: {
      labels: string[];
      datasets: [
        {
          data: number[];
        },
      ];
    } = { labels: [], datasets: [{ data: [] }] };

    logs.forEach((log) => {
      log.data.forEach((data) => {
        // console.log("data:", data);
        // console.log('dataPoint id:', data.dataPoint._id);
        if (!data.dataPoint || !data.dataPoint._id) {
          return;
        }
        if (data.dataPoint._id.toString() === selectedDataPoint) {
          // console.log('data:', data);
          let itemDate = new Date(log.date);
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
              set(itemDate, {
                hours: 7,
                minutes: 1,
                seconds: 0,
                milliseconds: 0,
              }),
              1,
            );
            // console.log("New time:", itemDate)
          }
          // console.log('itemDate:', itemDate);
          // console.log('value:', data.value);
          sendPackage.labels.push(format(itemDate, 'PPP'));
          sendPackage.datasets[0].data.push(
            data.value === 'true'
              ? 1
              : data.value === 'false'
                ? 0
                : Number(data.value),
          );
        }
      });
    });

    return sendPackage;
  }
}
