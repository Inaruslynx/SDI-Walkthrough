import mongoose from 'mongoose';
import LogSchema, { Log } from '../schemas/DynamicLog.schema';

export function getLogModel(walkthroughName: string): mongoose.Model<Log> {
  const modelName = `Log_${walkthroughName}`;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as mongoose.Model<Log>;
  }
  return mongoose.model<Log>(modelName, LogSchema);
}
