import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DataPoint } from './DataPoints.schema';
import { Walkthrough } from './walkthroughs.schema';
import { IsEnum } from 'class-validator';

export type AreaDocument = HydratedDocument<Area>;

@Schema()
export class Area {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['area', 'walkthrough'] })
  @IsEnum(['area', 'walkthrough'])
  parentType: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Walkthrough',
  })
  parentWalkthrough: Walkthrough;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
  })
  parentArea: Area;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DataPoint' }],
  })
  dataPoints: DataPoint[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }] })
  areas: Area[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
