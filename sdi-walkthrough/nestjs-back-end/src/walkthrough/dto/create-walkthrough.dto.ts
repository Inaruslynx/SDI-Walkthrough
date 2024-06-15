import { Area } from 'src/schemas/areas.schema';

export class CreateWalkthroughDto {
  _id: string;
  name: string;
  department: string;
  data?: Area[];
}
