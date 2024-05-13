import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from 'src/schemas/departments.schema';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalkthroughService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
  ) {}

  async create(createWalkthroughDto: CreateWalkthroughDto) {
    if (!createWalkthroughDto.name || !createWalkthroughDto.department) {
      throw new BadRequestException('Missing name.');
    } else {
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
          department: DepartmentDocument,
        });
        DepartmentDocument.walkthroughs.push(newWalkthrough);
        await DepartmentDocument.save();
        const result = await newWalkthrough.save();
        if (result.errors) {
          throw new InternalServerErrorException(
            'Failed to create walkthrough',
          );
        }
        return { name: result.name };
      }
    }
  }

  async findAll(department) {
    if (!department) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const deptDoc = await this.departmentModel
      .findOne({ name: department })
      .select('walkthroughs -_id')
      .populate('walkthroughs', 'name -_id')
      .exec();
    // console.log(department, deptDoc);
    if (!deptDoc) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }
    const result = deptDoc.walkthroughs.map((walkthrough) => {
      return walkthrough.name;
    });
    return { walkthroughs: result };
  }

  async findOne(name: string) {
    if (!name) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel
      .findOne({ name: name })
      .select('-data');
    return { data: walkthroughDoc };
  }

  update(name: string, updateWalkthroughDto: UpdateWalkthroughDto) {
    return `This action updates a #${name} walkthrough`;
  }

  async remove(name: string) {
    if (!name) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel.findOne({ name: name });
    const deptDoc = await this.departmentModel.findById(
      walkthroughDoc.department,
    );
    const filteredWalkthroughs = deptDoc.walkthroughs.filter(
      (walkthrough) => walkthrough.toString() !== walkthroughDoc._id.toString(),
    );
    deptDoc.walkthroughs = filteredWalkthroughs;
    const resultDept = await deptDoc.save();
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
