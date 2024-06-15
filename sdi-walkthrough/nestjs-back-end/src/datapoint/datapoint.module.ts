import { Module } from '@nestjs/common';
import { DatapointService } from './datapoint.service';
import { DatapointController } from './datapoint.controller';

@Module({
  controllers: [DatapointController],
  providers: [DatapointService],
})
export class DatapointModule {}
