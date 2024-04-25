import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from 'src/schemas/logs.schema';
import { Department } from 'src/schemas/departments.schema';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { format, subDays, set, isToday, isBefore } from 'date-fns';

@Injectable()
export class GraphService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<Log>,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
  ) {}

  async getGraphData(walkthrough: string) {
    const toDate = new Date();
    const fromDate = subDays(new Date(), 30);
    const walkthroughResults = await await this.walkthroughModel.findOne(
      { name: walkthrough },
      'areas -_id',
    );
    const result = walkthroughResults;

    return { result, toDate, fromDate };
  }

  async processGraphFetch(
    walkthrough: string,
    fromDate: string,
    toDate: string,
    dataSelection: string,
  ) {
    // TODO use Log schema and find data in range of fromDate and toDate possibly walkthrough
    const fromDateObject = new Date(fromDate);
    const toDateObject = new Date(toDate);
    fromDateObject.setUTCHours(14, 0, 0, 0);
    if (!isToday(toDateObject)) {
      toDateObject.setUTCHours(14, 0, 0, 0);
    } else {
      toDateObject.setTime(new Date().getTime());
    }

    const result = await this.logModel.find(
      {
        name: walkthrough,
        date: { $gte: fromDateObject, $lte: toDateObject },
        [`data.${dataSelection}`]: { $exists: true },
      },
      'data date -_id',
    );

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
          1,
        );
        // console.log("New time:", itemDate)
      }
      // console.log(format(itemDate, "PPP"));
      return {
        value:
          item.data[dataSelection] === 'true'
            ? 1
            : item.data[dataSelection] === 'false'
              ? 0
              : item.data[dataSelection],
        date: format(itemDate, 'PPP'),
      };
    });
    return justSelectedData;
  }
}
