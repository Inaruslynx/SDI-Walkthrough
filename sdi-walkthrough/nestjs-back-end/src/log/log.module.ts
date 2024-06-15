import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
  ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
