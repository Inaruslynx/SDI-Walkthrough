import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClerkUser } from '../schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(ClerkUser.name) private userModel: Model<ClerkUser>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // console.log('createUserDto:', createUserDto);
    if (!createUserDto.clerkId) {
      throw new BadRequestException('Missing ClerkId.');
    }
    const newUser = new this.userModel(createUserDto);
    console.log('newUser:', newUser);
    const result = await newUser.save();
    console.log('result:', result);
    if (result.errors) {
      throw new InternalServerErrorException(
        'Failed to create user: ' + result.errors,
      );
    }
    return result;
  }

  async findAll() {
    const result = await this.userModel.find();
    return result;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Missing id.');
    }
    const result = await this.userModel.findOne({ clerkId: id });
    if (!result) {
      throw new InternalServerErrorException('Failed to find user');
    }
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    if (!id) {
      throw new BadRequestException('Missing id.');
    }
    const userDoc = await this.userModel.findOne({ clerkId: id });
    console.log(userDoc);
    if (userDoc) {
      console.log('updating an existing user');
      const userDoc = {
        ...updateUserDto,
      };
      const result = await this.userModel.updateOne({ clerkId: id }, userDoc);
      return result;
    } else {
      console.log('creating a new user');
      const userData = {
        ...updateUserDto,
        admin: false,
        assignedWalkthroughs: [],
      };
      const newUser = new this.userModel(userData);
      const result = await newUser.save();
      console.log(result);
      return result;
    }
  }

  async remove(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException('Missing id.');
    }
    const getUserDoc = this.userModel.find({ clerkId: id });
    if (!getUserDoc) {
      throw new InternalServerErrorException('Failed to find user');
    }
    const result = await this.userModel.deleteOne({ clerkId: id });
    return result;
  }
}
