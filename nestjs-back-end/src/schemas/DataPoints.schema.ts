import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { IsEnum } from 'class-validator';
import { Area } from './areas.schema';
import { Walkthrough } from './walkthroughs.schema';
import mongoose from 'mongoose';

export type DataPointDocument = HydratedDocument<DataPoint>;

@Schema()
export class DataPoint extends Document {
  @Prop({ required: true, index: true })
  text: string;

  // I think I added this for easier reporting so they can be grouped
  @Prop()
  name: string;

  @Prop({ required: true, enum: ['string', 'number', 'boolean', 'choice'] })
  @IsEnum(['string', 'number', 'boolean', 'choice'])
  type: string;

  @Prop()
  min: number;

  @Prop()
  max: number;

  @Prop()
  unit: string;

  @Prop({ default: undefined })
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
