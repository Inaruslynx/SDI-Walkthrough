import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';
import { ClerkUserSchema } from '../schemas/users.schema';
import { LogSchema } from '../schemas/logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
    MongooseModule.forFeature([{ name: 'ClerkUser', schema: ClerkUserSchema }]),
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
