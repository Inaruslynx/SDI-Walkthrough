import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEnum } from 'class-validator';

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
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
