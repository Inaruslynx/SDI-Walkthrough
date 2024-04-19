import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalkthroughService } from './walkthrough.service';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';

@Controller('walkthrough')
export class WalkthroughController {
  constructor(private readonly walkthroughService: WalkthroughService) {}

  @Post()
  create(@Body() createWalkthroughDto: CreateWalkthroughDto) {
    return this.walkthroughService.create(createWalkthroughDto);
  }

  @Get()
  findAll() {
    return this.walkthroughService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walkthroughService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalkthroughDto: UpdateWalkthroughDto) {
    return this.walkthroughService.update(+id, updateWalkthroughDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walkthroughService.remove(+id);
  }
}
