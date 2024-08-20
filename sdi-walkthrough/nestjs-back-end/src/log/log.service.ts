import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Request } from 'express';
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

  async create(createLogDto: CreateLogDto, req: Request) {
    const walkthroughDoc = await this.walkthroughModel.findById(
      createLogDto.walkthrough,
    );
    if (!walkthroughDoc) {
      throw new NotFoundException('Walkthrough not found', {
        cause: new Error(),
        description: 'Walkthrough not found',
      });
    }

    // Get user from clerk
    const result = await clerkClient.verifyToken(req.cookies.__session);
    // no results then not logged in
    if (!result) {
      throw new InternalServerErrorException('Not logged in', {
        cause: new Error(),
        description: 'Not logged in',
      });
    }

    // Get session
    const sessionId = result.sid;
    const session = await clerkClient.sessions.getSession(sessionId);

    // Get user id
    const userId = session.userId;
    const logData = { ...createLogDto, user: userId };

    console.log(logData);

    const LogModel = getLogModel(walkthroughDoc.name);
    const newLog = new LogModel(logData);
    const logResult = await newLog.save();
    if (!logResult || logResult['acknowledged'] === false) {
      throw new InternalServerErrorException('Failed to create log', {
        cause: new Error(),
        description: 'Failed to create log',
      });
    } else {
      return logResult;
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
