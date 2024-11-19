import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DatapointService } from './datapoint.service';
import { CreateDatapointDto } from './dto/create-datapoint.dto';
import { UpdateDatapointDto } from './dto/update-datapoint.dto';
import { AdminOrgAuthGuard } from 'src/auth/admin-org-auth-guard.service';

@Controller('datapoint')
export class DatapointController {
  constructor(private readonly datapointService: DatapointService) {}

  @Post()
  @UseGuards(AdminOrgAuthGuard)
  create(@Body() createDatapointDto: CreateDatapointDto) {
    return this.datapointService.create(createDatapointDto);
  }

  @Get()
  findAll(@Query('walkthrough') walkthrough: string) {
    return this.datapointService.findAll(walkthrough);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datapointService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminOrgAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDatapointDto: UpdateDatapointDto,
  ) {
    return this.datapointService.update(id, updateDatapointDto);
  }

  @Delete(':id')
  @UseGuards(AdminOrgAuthGuard)
  remove(@Param('id') id: string, @Query('orgId') orgId: string) {
    return this.datapointService.remove(id);
  }
}
