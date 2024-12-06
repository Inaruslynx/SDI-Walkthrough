import { PartialType } from '@nestjs/mapped-types';
import { CreateDatapointDto } from './create-datapoint.dto';

export class UpdateDatapointDto extends PartialType(CreateDatapointDto) {}
