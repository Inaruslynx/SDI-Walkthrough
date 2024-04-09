import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { Department, DepartmentSchema } from 'src/schemas/departments.schema';
import {
  Walkthrough,
  WalkthroughSchema,
} from 'src/schemas/walkthroughs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Walkthrough.name, schema: WalkthroughSchema },
    ]),
  ],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
