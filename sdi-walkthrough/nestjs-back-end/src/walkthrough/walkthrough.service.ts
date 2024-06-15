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
  Walkthrough,
  WalkthroughDocument,
} from 'src/schemas/walkthroughs.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalkthroughService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
  ) {}
  private readonly logger = new Logger(WalkthroughService.name);

  async create(createWalkthroughDto: CreateWalkthroughDto) {
    if (!createWalkthroughDto.name || !createWalkthroughDto.department) {
      throw new BadRequestException('Missing name.');
    } else {
      this.logger.debug('creating walkthrough from:', createWalkthroughDto);
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
          data: [],
        });
        this.logger.debug(newWalkthrough);
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

  async findAll(department) {
    if (!department) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const deptDoc = await this.departmentModel
      .findOne({ name: department })
      .select('walkthroughs _id')
      .populate('walkthroughs _id')
      .exec();
    // this.logger.log(department, deptDoc);
    if (!deptDoc) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }
    // console.log(deptDoc);
    const result = deptDoc.walkthroughs.map(
      (walkthrough: WalkthroughDocument) => {
        // console.log(walkthrough);
        const data = { name: walkthrough.name, id: walkthrough._id };
        return data;
      },
    );
    return { walkthroughs: result };
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

  async update(id: string, updateWalkthroughDto: UpdateWalkthroughDto) {
    // This only needs to rename walkthroughs. The areas will now be handled by area route service
    // this.logger.log('updateWalkthroughDto:', updateWalkthroughDto);
    if (!id) {
      throw new BadRequestException('Request did not include id', {
        cause: new Error(),
        description: 'Request did not include id',
      });
    }

    // if neither area or data point exist then throw error
    if (!updateWalkthroughDto.newName) {
      throw new InternalServerErrorException(
        'Failed to update walkthrough due to missing new name',
      );
    }

    // First we find the walkthrough
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    // Does it exist?
    if (!walkthroughDoc) {
      throw new InternalServerErrorException(
        `Failed to update walkthrough because database did not find ${id}`,
      );
    }

    // Have walkthrough, just need to change name
    walkthroughDoc.name = updateWalkthroughDto.newName;
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
    const walkthroughDoc = await this.walkthroughModel.findById(id);
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
