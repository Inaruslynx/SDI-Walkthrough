import { PartialType } from '@nestjs/mapped-types';
import { CreateWalkthroughDto } from './create-walkthrough.dto';

// The data to update a walkthrough needs to be id of walkthrough and new name
export class UpdateWalkthroughDto extends PartialType(CreateWalkthroughDto) {
    createNewDueDate?: boolean;
}
