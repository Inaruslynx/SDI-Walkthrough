import mongoose, { Schema, Document } from 'mongoose';
import { User } from './users.schema';
import { Walkthrough } from './walkthroughs.schema';
import { Department } from './departments.schema';
import { DataPoint } from './DataPoints.schema';

export interface LogData {
  dataPoint: mongoose.Schema.Types.ObjectId | DataPoint;
  value: string | number | boolean;
}

export interface Log extends Document {
  user: User;
  department: Department;
  walkthrough: Walkthrough;
  data: LogData[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema = new Schema<Log>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    walkthrough: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Walkthrough',
      required: true,
    },
    data: [
      {
        dataPoint: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DataPoint',
          required: true,
        },
        value: { type: Schema.Types.Mixed, required: true },
      },
    ],
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default LogSchema;
