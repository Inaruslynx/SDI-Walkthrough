import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Walkthrough } from './walkthroughs.schema';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Walkthrough' }],
  })
  walkthroughs: Walkthrough[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
