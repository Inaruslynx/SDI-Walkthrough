import mongoose from "mongoose";
const Schema = mongoose.Schema

export interface Departments extends mongoose.Document {
    name: string
}

const DepartmentSchema = new Schema<Departments>(
    {
        name: {
            type: String,
            require: [true, "Department name is required"],
        }
    },
)

export default mongoose.models.Deparment || mongoose.model<Departments("Department", DepartmentSchema)