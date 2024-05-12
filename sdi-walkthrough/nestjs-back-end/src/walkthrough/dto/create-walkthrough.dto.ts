import { Area } from 'src/schemas/walkthroughs.schema';

export class CreateWalkthroughDto {
  name: string;
  department: string;
  areas?: Area[];
}
