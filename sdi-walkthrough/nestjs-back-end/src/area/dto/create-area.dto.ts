import { DataPoint } from 'src/schemas/DataPoints.schema';
import { Area } from 'src/schemas/areas.schema';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';

export class CreateAreaDto {
  id?: string;
  name: string;
  parentType: 'area' | 'walkthrough';
  parentWalkthrough?: Walkthrough;
  parentArea?: Area;
  dataPoints?: DataPoint[];
  areas?: Area[];
}
