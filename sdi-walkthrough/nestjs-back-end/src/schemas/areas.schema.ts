import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DataPoint } from './DataPoints.schema';

export type AreaDocument = HydratedDocument<Area>;

@Schema()
export class Area {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataPoint' }] })
  datapoints: DataPoint[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }] })
  areas: Area[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
