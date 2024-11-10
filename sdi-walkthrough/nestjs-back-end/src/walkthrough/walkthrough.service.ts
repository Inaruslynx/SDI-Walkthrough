import {
  BadRequestException,
  HttpStatus,
  Logger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from 'src/schemas/departments.schema';
import {
  PeriodicityOptions,
  Walkthrough,
  WalkthroughDocument,
} from 'src/schemas/walkthroughs.schema';
import { Model } from 'mongoose';
import { Area } from 'src/schemas/areas.schema';
import { DataPoint } from 'src/schemas/DataPoints.schema';

@Injectable()
export class WalkthroughService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(DataPoint.name) private dataPointModel: Model<DataPoint>,
  ) {}
  private readonly logger = new Logger(WalkthroughService.name);

  async create(createWalkthroughDto: CreateWalkthroughDto) {
    if (!createWalkthroughDto.name || !createWalkthroughDto.department) {
      throw new BadRequestException('Missing name.');
    } else {
      // this.logger.debug('creating walkthrough from:', createWalkthroughDto);
      const DepartmentDocument = await this.departmentModel
        .findOne({
          name: createWalkthroughDto.department,
        })
        .populate('walkthroughs')
        .exec();
      if (!DepartmentDocument) {
        throw new NotFoundException('Department not found', {
          cause: new Error(),
          description: 'Department not found',
        });
      } else {
        const newWalkthrough = new this.walkthroughModel({
          name: createWalkthroughDto.name,
          periodicity:
            createWalkthroughDto?.periodicity || PeriodicityOptions.Daily,
          department: DepartmentDocument,
          data: [],
          ...(createWalkthroughDto.weekly && {
            weekly: createWalkthroughDto.weekly,
          }),
        });
        // this.logger.debug(newWalkthrough);
        DepartmentDocument.walkthroughs.push(newWalkthrough);
        await DepartmentDocument.save();
        const result = await newWalkthrough.save();
        if (result.errors) {
          throw new InternalServerErrorException(
            'Failed to create walkthrough',
          );
        }
        return { name: result._id };
      }
    }
  }

  async findAll() {
    const deptDoc = await this.departmentModel.find();
    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findAllById(id: string) {
    const deptDoc = await this.departmentModel.find({ _id: id });
    if (!deptDoc || deptDoc.length === 0) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }

    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findAllByName(department: string) {
    const deptDoc = await this.departmentModel.find({ name: department });
    // this.logger.log(department, deptDoc);
    if (!deptDoc || deptDoc.length === 0) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }
    // console.log('deptDoc:', deptDoc);

    // console.log(deptDoc);
    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    await walkthroughDoc.populate('data');
    // console.log(walkthroughDoc);
    return walkthroughDoc;
  }

  async findByName(name: string) {
    if (!name) {
      throw new BadRequestException('Request has no name', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel
      .findOne({ name })
      .populate('data');
    return walkthroughDoc;
  }

  async update(id: string, updateWalkthroughDto: UpdateWalkthroughDto) {
    // This only needs to rename walkthroughs. The areas will now be handled by area route service
    // this.logger.log('updateWalkthroughDto:', updateWalkthroughDto);
    if (!id) {
      throw new BadRequestException('Request did not include id', {
        cause: new Error(),
        description: 'Request did not include id',
      });
    }

    if (
      updateWalkthroughDto.periodicity === 'Weekly' &&
      !updateWalkthroughDto.weekly
    ) {
      throw new BadRequestException('Request did not include weekly', {
        cause: new Error(),
        description: 'Request did not include weekly',
      });
    }

    if (
      updateWalkthroughDto.periodicity === 'Per Swing' &&
      !updateWalkthroughDto.perSwing
    ) {
      throw new BadRequestException('Request did not include perSwing', {
        cause: new Error(),
        description: 'Request did not include perSwing',
      });
    }

    // First we find the walkthrough
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    // Does it exist?
    if (!walkthroughDoc) {
      throw new InternalServerErrorException(
        `Failed to update walkthrough because database did not find ${id}`,
      );
    }

    // Update document
    Object.keys(updateWalkthroughDto).forEach((key) => {
      if (updateWalkthroughDto[key] !== undefined) {
        walkthroughDoc[key] = updateWalkthroughDto[key];
      }
    });
    console.log(updateWalkthroughDto.periodicity);
    if (updateWalkthroughDto.periodicity !== PeriodicityOptions.PerSwing) {
      walkthroughDoc.perSwing = undefined;
    }

    if (updateWalkthroughDto.periodicity !== PeriodicityOptions.Weekly) {
      walkthroughDoc.weekly = undefined;
    }

    // Save updated walkthrough
    const result = await walkthroughDoc.save();
    if (!result) {
      throw new InternalServerErrorException('Failed to update walkthrough');
    } else {
      return { name: result._id };
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    // Find walkthrough
    const walkthroughDoc = await this.walkthroughModel.findById(id);

    // Find Department that walkthrough belongs to and delete walkthrough
    const deptDoc = await this.departmentModel.findById(
      walkthroughDoc.department,
    );
    const filteredWalkthroughs = deptDoc.walkthroughs.filter(
      (walkthrough) => walkthrough.toString() !== walkthroughDoc._id.toString(),
    );
    deptDoc.walkthroughs = filteredWalkthroughs;
    const resultDept = await deptDoc.save();

    // Find all areas belonging to Walkthrough
    const areaDocs = await this.areaModel.find({ parentWalkthrough: id });

    // Delete all areas
    for (const areaDoc of areaDocs) {
      await this.areaModel.findByIdAndDelete(areaDoc._id);
    }

    // Find all data points belonging to Walkthrough
    const dataPointDocs = await this.dataPointModel.find({
      parentWalkthrough: id,
    });
    // Delete all data points
    for (const dataPointDoc of dataPointDocs) {
      await this.dataPointModel.findByIdAndDelete(dataPointDoc._id);
    }

    const resultWalkthrough = await this.walkthroughModel.findByIdAndDelete(
      walkthroughDoc._id,
    );
    if (!resultDept || !resultWalkthrough) {
      throw new InternalServerErrorException('Failed to remove walkthrough');
    } else {
      return { statusCode: HttpStatus.OK, message: 'Walkthrough removed' };
    }
  }
}
