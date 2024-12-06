import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClerkUserSchema } from '../schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ClerkUser', schema: ClerkUserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
