import { Module } from '@nestjs/common';
import { WalkthroughService } from './walkthrough.service';
import { WalkthroughController } from './walkthrough.controller';

@Module({
  controllers: [WalkthroughController],
  providers: [WalkthroughService],
})
export class WalkthroughModule {}
