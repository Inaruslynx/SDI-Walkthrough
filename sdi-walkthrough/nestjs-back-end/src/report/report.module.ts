import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from 'src/schemas/logs.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema}])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
