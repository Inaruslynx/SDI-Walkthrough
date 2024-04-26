import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from 'src/schemas/logs.schema';
import { DepartmentSchema } from 'src/schemas/departments.schema';
import { WalkthroughSchema } from 'src/schemas/walkthroughs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Walkthrough', schema: WalkthroughSchema },
    ]),
  ],
  controllers: [GraphController],
  providers: [GraphService],
  exports: [GraphService, MongooseModule],
})
export class GraphModule {}
