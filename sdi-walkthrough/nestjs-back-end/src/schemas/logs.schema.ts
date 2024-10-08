import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ClerkUser } from './users.schema';
import { Walkthrough } from './walkthroughs.schema';
import { DataPoint } from './DataPoints.schema';

export type LogDocument = HydratedDocument<Log>;

export interface LogData {
  dataPoint: DataPoint;
  value?: string | number | boolean;
}

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: ClerkUser;

  /* @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  })
  department: Department; */

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Walkthrough',
  })
  walkthrough: Walkthrough;

  @Prop({
    required: true,
    type: [
      {
        dataPoint: { type: mongoose.Schema.Types.ObjectId, ref: 'DataPoint' },
        value: { type: mongoose.Schema.Types.Mixed },
      },
    ],
  })
  data: LogData[];

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
