const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Walkthrough = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            require: true
        },
        areas: {
            type: [Schema.Types.ObjectId],
            ref: "Area",
        },
    }
)

module.exports = mongoose.model("Walkthrough", Walkthrough)