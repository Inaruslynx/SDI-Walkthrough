import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEnum } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  admin: boolean;

  @Prop({ default: 'dark', enum: Theme })
  @IsEnum(Theme)
  type: Theme;
}

export const UserSchema = SchemaFactory.createForClass(User);
