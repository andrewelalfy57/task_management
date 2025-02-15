import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask> (
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, strict: false }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
