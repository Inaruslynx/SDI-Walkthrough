import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEnum } from 'class-validator';
import { Area } from './areas.schema';
import { Walkthrough } from './walkthroughs.schema';
import mongoose from 'mongoose';

export type DataPointDocument = HydratedDocument<DataPoint>;

@Schema()
export class DataPoint {
  @Prop({ required: true, index: true, unique: true })
  text: string;

  @Prop({ required: true, enum: ['string', 'number', 'boolean'] })
  @IsEnum(['string', 'number', 'boolean'])
  type: string;

  @Prop()
  min: number;

  @Prop()
  max: number;

  @Prop()
  unit: string;

  @Prop()
  choices: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
  })
  parentArea: Area;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Walkthrough',
  })
  parentWalkthrough: Walkthrough;
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
