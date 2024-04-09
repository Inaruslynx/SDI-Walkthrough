import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from 'src/schemas/logs.schema';
import { Department } from 'src/schemas/departments.schema';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { format, subDays, set } from 'date-fns';

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
    const walkthroughResults = await (
      await this.walkthroughModel.findOne(
        { name: walkthrough },
        'datapoints -_id',
      )
    ).populate('datapoints');
    const result = walkthroughResults;

    return { result, toDate, fromDate };
  }

  async processGraphFetch(
    dataSelection: string,
    fromDate: string,
    toDate: string,
  ) {
    // TODO use Log schema and find data in range of fromDate and toDate possibly walkthrough
  }
}
