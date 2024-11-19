import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AdminOrgAuthGuard } from 'src/auth/admin-org-auth-guard.service';

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @UseGuards(AdminOrgAuthGuard)
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @Get()
  findAll(@Query('walkthrough') walkthrough: string) {
    return this.areaService.findAll(walkthrough);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminOrgAuthGuard)
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @UseGuards(AdminOrgAuthGuard)
  remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
