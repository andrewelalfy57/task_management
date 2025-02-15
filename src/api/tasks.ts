import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoURI: string | undefined = process.env.MONGO_URL;
const app: Application = express();
app.use(cors());
app.use(express.json());

import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../Controllers/TaskController";

mongoose.set("strictQuery", false);

// Check if MongoDB URI is available
if (!MongoURI) {
  console.error("MongoDB URL is missing in environment variables.");
  process.exit(1);
}

// Connect to MongoDB (only once per deployment)
mongoose
  .connect(MongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define API routes
app.get("/api/tasks", getTasks);
app.post("/api/tasks", addTask);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

export default app;
