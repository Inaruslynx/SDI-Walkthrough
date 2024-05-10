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
  BadRequestException,
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
  find(@Query('department') department?: string, @Query('name') name?: string) {
    if (department) {
      return this.walkthroughService.findAll(department);
    }
    if (name) {
      return this.walkthroughService.findOne(name);
    }
    throw new BadRequestException('Request is empty');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalkthroughDto: UpdateWalkthroughDto,
  ) {
    return this.walkthroughService.update(+id, updateWalkthroughDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walkthroughService.remove(+id);
  }
}
