import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DataPoint } from './DataPoints.schema';
import { Area } from './areas.schema';

export type WalkthroughDocument = HydratedDocument<Walkthrough>;

@Schema()
export class Walkthrough {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataPoint' }] })
  datapoints: DataPoint[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }] })
  areas: Area[];
}

export const WalkthroughSchema = SchemaFactory.createForClass(Walkthrough);
