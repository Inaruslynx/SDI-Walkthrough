import { Area } from 'src/schemas/areas.schema';
import {
  PeriodicityOptions,
  PerSwingOptions,
  WeeklyOptions,
} from 'src/schemas/walkthroughs.schema';

export class CreateWalkthroughDto {
  _id: string;
  name: string;
  periodicity?: PeriodicityOptions;
  weekly?: WeeklyOptions;
  perSwing?: PerSwingOptions;
  department: string;
  data?: Area[];
}
