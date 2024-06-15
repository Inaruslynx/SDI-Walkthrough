import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';
import { AreaSchema } from 'src/schemas/areas.schema';
import { DataPointSchema } from 'src/schemas/DataPoints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Area', schema: AreaSchema }]),
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
    MongooseModule.forFeature([{ name: 'DataPoint', schema: DataPointSchema }]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
