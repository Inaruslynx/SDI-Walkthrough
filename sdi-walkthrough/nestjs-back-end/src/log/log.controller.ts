import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { LogService } from './log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { LoggedInAuthGuard } from '../auth/logged-in-auth-guard.service';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @UseGuards(LoggedInAuthGuard)
  create(@Body() createLogDto: CreateLogDto, @Req() req: Request) {
    return this.logService.create(createLogDto, req);
  }

  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(LoggedInAuthGuard)
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logService.update(+id, updateLogDto);
  }

  @Delete(':id')
  @UseGuards(LoggedInAuthGuard)
  remove(@Param('id') id: string) {
    return this.logService.remove(+id);
  }
}
