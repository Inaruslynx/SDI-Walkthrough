import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from 'src/schemas/departments.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return 'This action adds a new department';
  }

  async findAll() {
    const departments = await this.departmentModel
      .find()
      .select('name walkthroughs')
      .populate('walkthroughs', 'name')
      .exec();
    return departments;
  }

  async findById(id: string) {
    return await this.departmentModel
      .findById(id)
      .populate('walkthroughs', 'name');
  }

  async findByName(name: string) {
    return await this.departmentModel
      .findOne({ name })
      .populate('walkthroughs', 'name');
  }

  async findOne(id?: string, name?: string) {
    if (!id && !name) throw new BadRequestException('No id or name provided');
    let department: DepartmentDocument;
    if (id)
      department = await this.departmentModel
        .findById(id)
        .populate('walkthroughs', 'name');
    if (name)
      department = await this.departmentModel
        .findOne({ name })
        .populate('walkthroughs', 'name');
    if (department.errors)
      throw new InternalServerErrorException(
        `Errors while trying to find department: ${department.errors.message}`,
      );
    return department;
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: string) {
    return `This action removes a #${id} department`;
  }
}
