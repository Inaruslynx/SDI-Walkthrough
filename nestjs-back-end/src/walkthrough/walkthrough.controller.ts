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
  UseGuards,
} from '@nestjs/common';
import { WalkthroughService } from './walkthrough.service';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { AdminOrgAuthGuard } from 'src/auth/admin-org-auth-guard.service';

@Controller('walkthrough')
export class WalkthroughController {
  constructor(private readonly walkthroughService: WalkthroughService) {}

  @Post()
  @UseGuards(AdminOrgAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWalkthroughDto: CreateWalkthroughDto) {
    return this.walkthroughService.create(createWalkthroughDto);
  }

  @Get()
  find(@Query('department') department?: string) {
    if (!department) {
      return this.walkthroughService.findAll();
    }
    const isId = /^[0-9a-fA-F-]+$/.test(department);
    if (isId) {
      return this.walkthroughService.findAllById(department);
    } else {
      return this.walkthroughService.findAllByName(department);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walkthroughService.findOne(id);
  }

  @Get(':id/status')
  getWalkthroughStatus(@Param('id') id: string) {
    return this.walkthroughService.getWalkthroughStatus(id);
  }

  @Patch(':id')
  @UseGuards(AdminOrgAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateWalkthroughDto: UpdateWalkthroughDto,
  ) {
    return this.walkthroughService.update(id, updateWalkthroughDto);
  }

  @Delete(':id')
  @UseGuards(AdminOrgAuthGuard)
  remove(@Param('id') id: string) {
    return this.walkthroughService.remove(id);
  }
}
