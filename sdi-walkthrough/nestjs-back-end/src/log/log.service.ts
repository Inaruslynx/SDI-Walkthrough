import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Model } from 'mongoose';
// import { Log } from '../schemas/DynamicLog.schema';
import { getLogModel } from '../utils/log-utils';
import { InjectModel } from '@nestjs/mongoose';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
  ) {}

  async create(walkthroughId: string, createLogDto: CreateLogDto) {
    const walkthroughDoc = await this.walkthroughModel.findById(walkthroughId);
    if (!walkthroughDoc) {
      throw new NotFoundException('Walkthrough not found', {
        cause: new Error(),
        description: 'Walkthrough not found',
      });
    }

    const LogModel = getLogModel(walkthroughDoc.name);
    const newLog = new LogModel(createLogDto);
    const result = await newLog.save();
    if (!result || result['acknowledged'] === false) {
      throw new InternalServerErrorException('Failed to create log', {
        cause: new Error(),
        description: 'Failed to create log',
      });
    } else {
      return { statusCode: HttpStatus.OK, message: 'Log created' };
    }
  }

  findAll() {
    return `This action returns all log`;
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
