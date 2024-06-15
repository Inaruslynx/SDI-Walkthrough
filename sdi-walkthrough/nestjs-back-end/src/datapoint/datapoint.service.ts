import { Injectable } from '@nestjs/common';
import { CreateDatapointDto } from './dto/create-datapoint.dto';
import { UpdateDatapointDto } from './dto/update-datapoint.dto';

@Injectable()
export class DatapointService {
  create(createDatapointDto: CreateDatapointDto) {
    return 'This action adds a new datapoint';
  }

  findAll() {
    return `This action returns all datapoint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datapoint`;
  }

  update(id: number, updateDatapointDto: UpdateDatapointDto) {
    return `This action updates a #${id} datapoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} datapoint`;
  }
}
