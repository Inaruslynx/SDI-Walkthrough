import { Module } from '@nestjs/common';
import { WalkthroughService } from './walkthrough.service';
import { WalkthroughController } from './walkthrough.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';
import { DepartmentSchema } from 'src/schemas/departments.schema';
import { AreaSchema } from 'src/schemas/areas.schema';
import { DataPointSchema } from 'src/schemas/DataPoints.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Area', schema: AreaSchema }]),
    MongooseModule.forFeature([{ name: 'DataPoint', schema: DataPointSchema }]),
  ],
  controllers: [WalkthroughController],
  providers: [WalkthroughService],
})
export class WalkthroughModule {}
