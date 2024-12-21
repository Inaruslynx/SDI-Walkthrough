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
  Query,
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
  findOne(
    @Query('walkthroughId') walkthroughId: string,
    @Query('date') date: string,
  ) {
    return this.logService.findOne(walkthroughId, date);
  }

  @Get('prev/')
  findPrevByWalkthrough(
    @Query('id') id: string,
    @Query('walkthroughId') walkthroughId: string,
  ) {
    return this.logService.findPrev(id, walkthroughId);
  }

  @Get('next/')
  findNextByWalkthrough(
    @Query('id') id: string,
    @Query('walkthroughId') walkthroughId: string,
  ) {
    return this.logService.findNext(id, walkthroughId);
  }

  @Get(':walkthroughId')
  findAll(@Param('walkthroughId') walkthroughId: string) {
    return this.logService.findAll(walkthroughId);
  }

  @Patch(':id')
  @UseGuards(LoggedInAuthGuard)
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logService.update(id, updateLogDto);
  }

  @Delete(':id')
  @UseGuards(LoggedInAuthGuard)
  remove(@Param('id') id: string) {
    return this.logService.remove(id);
  }
}
