import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { clerkClient, createClerkClient, getAuth } from '@clerk/express';
import { Request } from 'express';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Expression, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { ClerkUser } from '../schemas/users.schema';
import { Log } from 'src/schemas/logs.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(ClerkUser.name) private userModel: Model<ClerkUser>,
    @InjectModel(Log.name) private logModel: Model<Log>,
  ) {}

  async create(createLogDto: CreateLogDto, req: Request) {
    console.log(createLogDto);
    // const clerkClient = createClerkClient({
    //   secretKey: process.env.CLERK_SECRET_KEY,
    //   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    // });
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
    console.log('Here in the create log service');

    // Get user from clerk
    // const result = await clerkClient.authenticateRequest(req.cookies.__session);
    // no results then not logged in
    // if (!result) {
    //   throw new BadRequestException('Not logged in', {
    //     cause: new Error(),
    //     description: 'Not logged in',
    //   });
    // }

    const logData = { ...createLogDto.data, user, walkthrough: walkthroughDoc };

    console.log(logData);

    // const LogModel = getLogModel(walkthroughDoc.name);
    // console.log('logModel', LogModel);
    const newLog = new this.logModel(logData);
    console.log('newLog', newLog);
    const logResult = await newLog.save();
    console.log('logResult', logResult);
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
