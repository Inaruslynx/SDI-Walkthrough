import { Injectable } from '@nestjs/common';
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
    let logs: LogDocument[] = [];
    const fromDateObject = new Date(fromDate);
    const toDateObject = new Date(toDate);
    fromDateObject.setUTCHours(14, 0, 0, 0);
    if (!isToday(toDateObject)) {
      toDateObject.setUTCHours(14, 0, 0, 0);
    } else {
      toDateObject.setTime(new Date().getTime());
    }
    if (!toDate && !fromDate) {
      logs = await this.logModel
        .find({ _id: walkthrough })
        .select('data -_id')
        .exec();
    } else if (!toDate) {
      logs = await this.logModel
        .find({ _id: walkthrough, date: { $gte: fromDateObject } })
        .select('data date -_id')
        .exec();
    } else if (!fromDate) {
      logs = await this.logModel
        .find({ _id: walkthrough, date: { $lte: toDateObject } })
        .select('data date -_id')
        .exec();
    } else {
      logs = await this.logModel
        .find({
          _id: walkthrough,
          date: { $gte: fromDateObject, $lte: toDateObject },
        })
        .select('data date -_id')
        .exec();
    }

    const data = logs.flatMap((log) => {
      return log.data.map((data) => {
        if (data.dataPoint._id === selectedDataPoint) {
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
          // console.log(format(itemDate, "PPP"));
          return {
            value:
              data.value === 'true'
                ? 1
                : data.value === 'false'
                  ? 0
                  : data.value,
            date: format(itemDate, 'PPP'),
          };
          // return { date: log.date.toDateString(), value: data.value };
        }
      });
    });

    return data;
  }
}
