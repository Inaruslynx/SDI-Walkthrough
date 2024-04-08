const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Department = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        walkthroughs: {
            type: [Schema.Types.ObjectId],
            ref: "Walkthrough",
        }
    }
)

module.exports = mongoose.model("Department", Department)