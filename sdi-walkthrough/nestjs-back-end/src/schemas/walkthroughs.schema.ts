import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { DataPoint } from './DataPoints.schema';
// import { Area } from './areas.schema';
import { Department } from './departments.schema';

export type WalkthroughDocument = HydratedDocument<Walkthrough>;

type DataPoint = {
  text: string;
  type: 'number' | 'string' | 'boolean';
  value?: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  choices?: string[];
};

type Area = {
  name: string;
  areas: Area[];
  dataPoints: DataPoint[];
};

@Schema()
export class Walkthrough {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  })
  department: Department;

  @Prop()
  data: Area[];
}

export const WalkthroughSchema = SchemaFactory.createForClass(Walkthrough);
