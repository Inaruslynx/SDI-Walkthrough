import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Area } from './areas.schema';

export type DataPointDocument = HydratedDocument<DataPoint>;

@Schema()
export class DataPoint {
  @Prop({ required: true, index: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['Text', 'Number', 'Boolean'] })
  type: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Area' })
  area: Area;
}

export const DataPointSchema = SchemaFactory.createForClass(DataPoint);
