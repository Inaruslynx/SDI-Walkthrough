import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { clerkClient, createClerkClient, getAuth } from '@clerk/express';
import { Request } from 'express';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { ClerkUser } from '../schemas/users.schema';
import { Log } from 'src/schemas/logs.schema';
import { isAfter } from 'date-fns';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(ClerkUser.name) private userModel: Model<ClerkUser>,
    @InjectModel(Log.name) private logModel: Model<Log>,
  ) {}

  async create(createLogDto: CreateLogDto, req: Request) {
    // console.log(createLogDto);
    const { userId } = getAuth(req);
    // this.logger.log('this is userId:', userId);
    // this.logger.log('this is the url:', request.url);
    const user = await this.userModel.findOne({ clerkId: userId });
    const walkthroughDoc = await this.walkthroughModel.findById(
      createLogDto.data.walkthrough,
    );
    if (!walkthroughDoc) {
      throw new NotFoundException('Walkthrough not found', {
        cause: new Error(),
        description: 'Walkthrough not found',
      });
    }
    // console.log('Here in the create log service');

    // Parse start time from environment variable (e.g., "14:00")
    const startTimeEnv = process.env.DAY_START_TIME || '14:00';
    const [startHour, startMinute] = startTimeEnv.split(':').map(Number);

    // Get current UTC time
    const now = new Date();
    const currentUTCDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
      ),
    );

    // Calculate today's start time in UTC
    const todayStartTime = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        startHour,
        startMinute,
      ),
    );

    // Adjust to the previous day's start time if before today's start time
    let logDate = new Date(todayStartTime);
    if (currentUTCDate < todayStartTime) {
      logDate.setUTCDate(todayStartTime.getUTCDate() - 1);
    }

    // Add 1 minute to ensure it is after the start time
    logDate.setUTCMinutes(logDate.getUTCMinutes() + 1);

    const logData = {
      ...createLogDto.data,
      user,
      date: logDate,
      walkthrough: walkthroughDoc,
    };

    // console.log(logData);
    const newLog = new this.logModel(logData);
    // console.log('newLog', newLog);
    const logResult = await newLog.save();
    // console.log('logResult', logResult);
    if (!logResult || logResult['acknowledged'] === false) {
      throw new InternalServerErrorException('Failed to create log', {
        cause: new Error(),
        description: 'Failed to create log',
      });
    } else {
      return logResult;
    }
  }

  findAll(walkthroughId: string) {
    const logs = this.logModel.find({ walkthrough: walkthroughId });
    return logs;
  }

  async findOne(walkthroughId: string, date: string) {
    const log = await this.logModel.find({ walkthrough: walkthroughId, date });
    return log;
  }

  async findPrev(id?: string, walkthroughId?: string) {
    console.log('id:', id);
    console.log('walkthroughId:', walkthroughId);
    if (!id && !walkthroughId) {
      throw new BadRequestException('id or walkthroughId is required', {
        cause: new Error(),
        description: 'id or walkthroughId is required',
      });
    }
    if (walkthroughId) {
      const log = (
        await this.logModel.find({ walkthrough: walkthroughId })
      ).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      return log;
    }
    if (id) {
      const log = await this.logModel.findById(id);
      const result = await this.logModel.findOne({
        walkthrough: log.walkthrough,
        createdAt: { $lt: log.createdAt },
      });
      return result;
    }
    throw new InternalServerErrorException('Failed to find log', {
      cause: new Error(),
      description: 'Failed to find log',
    });
  }

  async findNext(id?: string, walkthroughId?: string) {
    console.log('id:', id);
    console.log('walkthroughId:', walkthroughId);
    if (!id && !walkthroughId) {
      throw new BadRequestException('id or walkthroughId is required', {
        cause: new Error(),
        description: 'id or walkthroughId is required',
      });
    }
    if (walkthroughId) {
      const log = (
        await this.logModel.find({ walkthrough: walkthroughId })
      ).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )[0];
      return log;
    }
    if (id) {
      const log = await this.logModel.findById(id);
      const result = await this.logModel.findOne({
        walkthrough: log.walkthrough,
        createdAt: { $gt: log.createdAt },
      });
      return result;
    }

    throw new InternalServerErrorException('Failed to find log', {
      cause: new Error(),
      description: 'Failed to find log',
    });
  }

  // async findRange(walkthroughId: string, fromDate: string, toDate: string) {
  //   const logs = await this.logModel.find({ walkthrough: walkthroughId, date: { $gte: fromDate, $lte: toDate } }).lean().exec();
  //   return logs;
  // }

  async update(id: string, updateLogDto: UpdateLogDto) {
    const updatedLog = await this.logModel.findByIdAndUpdate(
      id,
      { $set: updateLogDto },
      { new: true },
    );
    if (!updatedLog) {
      throw new InternalServerErrorException('Failed to update log', {
        cause: new Error(),
        description: 'Failed to update log',
      });
    }
    return updatedLog;
  }

  async remove(id: string) {
    const result = await this.logModel.findByIdAndDelete(id);
    if (!result) {
      throw new InternalServerErrorException('Failed to remove log', {
        cause: new Error(),
        description: 'Failed to remove log',
      });
    }
    return result;
  }
}
