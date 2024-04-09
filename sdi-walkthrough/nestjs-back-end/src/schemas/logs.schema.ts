import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
