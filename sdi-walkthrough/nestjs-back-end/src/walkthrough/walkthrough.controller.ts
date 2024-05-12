import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WalkthroughService } from './walkthrough.service';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';

@Controller('walkthrough')
export class WalkthroughController {
  constructor(private readonly walkthroughService: WalkthroughService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWalkthroughDto: CreateWalkthroughDto) {
    return this.walkthroughService.create(createWalkthroughDto);
  }

  @Get()
  find(@Query('department') department?: string) {
    return this.walkthroughService.findAll(department);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.walkthroughService.findOne(name);
  }

  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateWalkthroughDto: UpdateWalkthroughDto,
  ) {
    return this.walkthroughService.update(name, updateWalkthroughDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.walkthroughService.remove(name);
  }
}
