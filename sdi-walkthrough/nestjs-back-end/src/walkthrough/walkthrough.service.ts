import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) {}

  create(createWalkthroughDto: CreateWalkthroughDto) {
    
    return 'This action adds a new walkthrough';
  }

  async findAll(department) {
    const deptDoc = await this.departmentModel
      .findOne({ name: department })
      .select('walkthroughs -_id')
      .exec();
    if (!deptDoc) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    const result = deptDoc.walkthroughs.map((walkthrough) => {
      return walkthrough.name;
    });
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} walkthrough`;
  }

  update(id: number, updateWalkthroughDto: UpdateWalkthroughDto) {
    return `This action updates a #${id} walkthrough`;
  }

  remove(id: number) {
    return `This action removes a #${id} walkthrough`;
  }
}
