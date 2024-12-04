import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ClerkUser } from './users.schema';
import { Walkthrough } from './walkthroughs.schema';
import { DataPoint } from './DataPoints.schema';

export type LogDocument = HydratedDocument<Log>;

export interface LogData {
  dataPoint: DataPoint;
  value: string;
}

@Schema({ timestamps: true })
export class Log {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClerkUser',
  })
  user: ClerkUser;

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
        value: { type: mongoose.Schema.Types.String },
        _id: false,
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
