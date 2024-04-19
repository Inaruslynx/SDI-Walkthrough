import { Injectable } from '@nestjs/common';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';

@Injectable()
export class WalkthroughService {
  create(createWalkthroughDto: CreateWalkthroughDto) {
    return 'This action adds a new walkthrough';
  }

  findAll() {
    return `This action returns all walkthrough`;
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
