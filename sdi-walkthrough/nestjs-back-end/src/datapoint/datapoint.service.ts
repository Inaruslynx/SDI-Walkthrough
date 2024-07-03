import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDatapointDto } from './dto/create-datapoint.dto';
import { UpdateDatapointDto } from './dto/update-datapoint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from 'src/schemas/areas.schema';
// import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { DataPoint, DataPointDocument } from 'src/schemas/DataPoints.schema';

@Injectable()
export class DatapointService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    // @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(DataPoint.name) private dataPointModel: Model<DataPoint>,
  ) {}
  async create(createDatapointDto: CreateDatapointDto) {
    if (
      !createDatapointDto.text ||
      !createDatapointDto.type ||
      !createDatapointDto.parentArea ||
      !createDatapointDto.parentWalkthrough
    ) {
      throw new BadRequestException('Missing data');
    }

    const areaDoc = await this.areaModel.findById(
      createDatapointDto.parentArea,
    );
    if (areaDoc.errors) {
      throw new NotFoundException('Area not found', {
        cause: new Error(),
        description: 'Area not found',
      });
    }

    const dataPointDoc = new this.dataPointModel({
      text: createDatapointDto.text,
      type: createDatapointDto.type,
      parentArea: areaDoc,
      parentWalkthrough: createDatapointDto.parentWalkthrough,
    });
    if (createDatapointDto.type === 'number') {
      dataPointDoc.min = createDatapointDto.min || 0;
      dataPointDoc.max = createDatapointDto.max || 100;
      dataPointDoc.unit = createDatapointDto.unit || '%';
    }
    if (createDatapointDto.choices && createDatapointDto.choices.length > 0)
      dataPointDoc.choices = createDatapointDto.choices;

    const result = await dataPointDoc.save();
    if (result.errors) {
      throw new InternalServerErrorException(
        'Failed to create data point: ' + result.errors,
      );
    }
    // console.log('before push');
    areaDoc.dataPoints.push(result);
    // console.log('after push');
    await areaDoc.save();
    // console.log('after save');
    return result._id;
  }

  async findAll(walkthrough: string) {
    if (!walkthrough) {
      throw new BadRequestException('Missing walkthrough');
    }
    const dataPointsDoc = await this.dataPointModel.find({
      parentWalkthrough: walkthrough,
    });
    if (!dataPointsDoc || dataPointsDoc.length === 0) {
      throw new InternalServerErrorException('Failed to find data points');
    }
    return dataPointsDoc;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Missing id');
    }
    const dataPointDoc = await this.dataPointModel.findById(id);
    if (dataPointDoc.errors || !dataPointDoc._id) {
      throw new InternalServerErrorException('Failed to find data point');
    }
    return dataPointDoc;
  }

  async update(id: string, updateDatapointDto: UpdateDatapointDto) {
    if (!id) {
      throw new BadRequestException('Missing id');
    }
    const dataPointDoc = await this.dataPointModel.findById(id);
    if (dataPointDoc.errors) {
      throw new InternalServerErrorException('Failed to find data point');
    }
    dataPointDoc.text = updateDatapointDto.text || dataPointDoc.text;
    dataPointDoc.type = updateDatapointDto.type || dataPointDoc.type;
    dataPointDoc.choices = updateDatapointDto.choices;
    if (dataPointDoc.type === 'number') {
      dataPointDoc.min = updateDatapointDto.min || dataPointDoc.min;
      dataPointDoc.max = updateDatapointDto.max || dataPointDoc.max;
      dataPointDoc.unit = updateDatapointDto.unit || dataPointDoc.unit;
    } else {
      dataPointDoc.min = undefined;
      dataPointDoc.max = undefined;
      dataPointDoc.unit = undefined;
    }
    const result = await dataPointDoc.save();
    if (result.errors) {
      throw new InternalServerErrorException(
        'Failed to update data point: ' + result.errors,
      );
    }
    return result;
  }

  async remove(id: string) {
    // if no id provided then error
    if (!id) {
      throw new BadRequestException('Missing id');
    }

    // find the data point to be deleted
    const targetDataPointDoc = await this.dataPointModel.findById(id);
    if (targetDataPointDoc.errors) {
      throw new InternalServerErrorException(
        `Failed to find data point: ${id}`,
      );
    }

    // find parent area so we can remove data point from it
    const parentAreaDoc = await await this.areaModel
      .findById(targetDataPointDoc.parentArea)
      .populate('dataPoints');
    if (parentAreaDoc.errors) {
      throw new InternalServerErrorException(
        `Failed to find area: ${targetDataPointDoc.parentArea}`,
      );
    }

    // Filter data point from parent area
    parentAreaDoc.dataPoints = parentAreaDoc.dataPoints.filter(
      (dataPoint: DataPointDocument) =>
        dataPoint._id.toString() != targetDataPointDoc._id.toString(),
    );

    // Save parent area with filtered data points and throw error if fault
    const areaSave = await parentAreaDoc.save();
    if (areaSave.errors) {
      throw new InternalServerErrorException(
        `Failed to save changes to parent area: ${areaSave.errors}`,
      );
    }

    // DELETE data point
    const result = await this.dataPointModel.findByIdAndDelete(id);
    if (result.errors) {
      throw new InternalServerErrorException(`Failed to delete ${id}`);
    }
    return result;
  }
}
