import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Area } from './areas.schema';
import { Department } from './departments.schema';

export type WalkthroughDocument = HydratedDocument<Walkthrough>;

export enum PeriodicityOptions {
  PerShift = 'Per Shift',
  Daily = 'Daily',
  PerSwing = 'Per Swing',
  Weekly = 'Weekly',
  BiWeekly = 'Bi-Weekly',
  Monthly = 'Monthly',
}

export enum WeeklyOptions {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
}

export enum PerSwingOptions {
  First = 'First Day',
  Second = 'Second Day',
  Third = 'Third Day',
  Fourth = 'Fourth Day',
}

@Schema()
export class Walkthrough extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(PeriodicityOptions),
    default: PeriodicityOptions.Daily,
  })
  periodicity: PeriodicityOptions;

  @Prop({ type: String, enum: Object.values(WeeklyOptions) })
  weekly: WeeklyOptions;

  @Prop({ type: String, enum: Object.values(PerSwingOptions) })
  perSwing: PerSwingOptions;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  })
  department: Department;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }])
  data: Area[];
}

export const WalkthroughSchema = SchemaFactory.createForClass(Walkthrough);
