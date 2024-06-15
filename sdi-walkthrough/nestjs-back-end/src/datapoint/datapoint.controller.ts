import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatapointService } from './datapoint.service';
import { CreateDatapointDto } from './dto/create-datapoint.dto';
import { UpdateDatapointDto } from './dto/update-datapoint.dto';

@Controller('datapoint')
export class DatapointController {
  constructor(private readonly datapointService: DatapointService) {}

  @Post()
  create(@Body() createDatapointDto: CreateDatapointDto) {
    return this.datapointService.create(createDatapointDto);
  }

  @Get()
  findAll() {
    return this.datapointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datapointService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatapointDto: UpdateDatapointDto) {
    return this.datapointService.update(+id, updateDatapointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datapointService.remove(+id);
  }
}
