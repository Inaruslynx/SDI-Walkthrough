import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClerkUserSchema } from '../schemas/users.schema';
import { DepartmentSchema } from 'src/schemas/departments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ClerkUser', schema: ClerkUserSchema }]),
    MongooseModule.forFeature([{ name: 'Department', schema: DepartmentSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
