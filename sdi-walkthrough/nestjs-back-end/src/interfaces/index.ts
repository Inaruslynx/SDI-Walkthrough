import { Document, Types } from 'mongoose';
import { Area } from 'src/schemas/areas.schema';
import { Department } from 'src/schemas/departments.schema';

export interface IWalkthrough extends Document {
  _id: Types.ObjectId;
  name: string;
  department: Department;
  data: Area[];
}
