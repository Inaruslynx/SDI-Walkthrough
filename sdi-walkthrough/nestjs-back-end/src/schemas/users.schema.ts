import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IsEnum } from 'class-validator';
import { Walkthrough } from './walkthroughs.schema';

export type UserDocument = HydratedDocument<User>;

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  CUPCAKE = 'cupcake',
  BUMBLEBEE = 'bumblebee',
  EMERALD = 'emerald',
  CORPORATE = 'corporate',
  SYNTHWAVE = 'synthwave',
  RETRO = 'retro',
  CYBERPUNK = 'cyberpunk',
  VALENTINE = 'valentine',
  HALLOWEEN = 'halloween',
  GARDEN = 'garden',
  FOREST = 'forest',
  AQUA = 'aqua',
  LOFI = 'lofi',
  PASTEL = 'pastel',
  FANTASY = 'fantasy',
  WIREFRAME = 'wireframe',
  BLACK = 'black',
  LUXURY = 'luxury',
  DRACULA = 'dracula',
  CMYK = 'cmyk',
  AUTUMN = 'autumn',
  BUSINESS = 'business',
  ACID = 'acid',
  LEMONADE = 'lemonade',
  NIGHT = 'night',
  COFFEE = 'coffee',
  WINTER = 'winter',
  DIM = 'dim',
  NORD = 'nord',
  SUNSET = 'sunset',
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  clerkId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Walkthrough' }],
  })
  assignedWalkthroughs: Walkthrough[];

  @Prop({ default: false })
  admin: boolean;

  @Prop({ default: 'dark', enum: Theme })
  @IsEnum(Theme)
  type: Theme;
}

export const UserSchema = SchemaFactory.createForClass(User);
