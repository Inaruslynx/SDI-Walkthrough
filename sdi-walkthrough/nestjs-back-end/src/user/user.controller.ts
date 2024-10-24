import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // Need a guard that checks if the user is an admin or changing their own account
  // @UseGuards(ClerkAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @UseGuards(ClerkAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  // @UseGuards(ClerkAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(ClerkAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.remove(id);
  }
}
