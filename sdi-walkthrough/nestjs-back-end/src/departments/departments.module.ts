import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentSchema } from 'src/schemas/departments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
