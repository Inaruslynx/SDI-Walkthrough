import { Module } from '@nestjs/common';
import { DatapointService } from './datapoint.service';
import { DatapointController } from './datapoint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';
import { AreaSchema } from 'src/schemas/areas.schema';
import { DataPointSchema } from 'src/schemas/DataPoints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'DataPoint', schema: DataPointSchema }]),
    MongooseModule.forFeature([{ name: 'Area', schema: AreaSchema }]),
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
  ],
  controllers: [DatapointController],
  providers: [DatapointService],
})
export class DatapointModule {}
