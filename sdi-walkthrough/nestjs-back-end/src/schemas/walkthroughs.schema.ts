import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Area } from './areas.schema';
import { Department } from './departments.schema';

export type WalkthroughDocument = HydratedDocument<Walkthrough>;

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

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }])
  data: Area[];
}

export const WalkthroughSchema = SchemaFactory.createForClass(Walkthrough);
