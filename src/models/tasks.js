const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length == 0) {
          throw new Error("You Have To Add Your Descrpition");
        }
      }
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;
