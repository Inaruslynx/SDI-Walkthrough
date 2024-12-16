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
import { AdminOrgAuthGuard } from '../auth/admin-org-auth-guard.service';
import { LoggedInAuthGuard } from '../auth/logged-in-auth-guard.service';
import { GeneralAdminAuthGuard } from '../auth/general-admin-auth-guard.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // Need a guard that checks if the user is an admin or changing their own account
  @UseGuards(LoggedInAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(GeneralAdminAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(LoggedInAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(LoggedInAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AdminOrgAuthGuard)
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.remove(id);
  }
}
