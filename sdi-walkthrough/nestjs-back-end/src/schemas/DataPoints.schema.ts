import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { Area } from './areas.schema';
import { Walkthrough } from './walkthroughs.schema';
import { IsEnum } from 'class-validator';

export type DataPointDocument = HydratedDocument<DataPoint>;

@Schema()
export class DataPoint {
  @Prop({ required: true, index: true, unique: true })
  text: string;

  @Prop({ required: true, enum: ['Text', 'Number', 'Boolean'] })
  @IsEnum(['Text', 'Number', 'Boolean'])
  type: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Walkthrough',
  })
  walkthrough: Walkthrough;

  @Prop()
  min: number;

  @Prop()
  max: number;

  @Prop()
  unit: string;

  @Prop()
  choices: string[];
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
