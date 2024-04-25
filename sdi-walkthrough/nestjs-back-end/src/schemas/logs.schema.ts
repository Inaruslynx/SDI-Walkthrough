import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';
import { Walkthrough } from './walkthroughs.schema';
import { Department } from './departments.schema';

export type LogDocument = HydratedDocument<Log>;

export interface LogData {
  [key: string]: string;
}

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  })
  department: Department;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Walkthrough',
  })
  walkthrough: Walkthrough;

  @Prop({ required: true, type: Object })
  data: LogData;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
