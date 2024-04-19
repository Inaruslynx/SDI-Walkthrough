import { PartialType } from '@nestjs/mapped-types';
import { CreateWalkthroughDto } from './create-walkthrough.dto';

export class UpdateWalkthroughDto extends PartialType(CreateWalkthroughDto) {}
