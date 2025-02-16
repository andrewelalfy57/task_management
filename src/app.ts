import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MongoURI: string | undefined = process.env.MONGO_URL;
const app: Application = express();
app.use(cors());
app.use(express.json());
const port: string | number = process.env.PORT || 8000;

import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./Controllers/TaskController";

mongoose.set("strictQuery", false);

if (!MongoURI) {
  console.error("MongoDB URL is missing in environment variables.");
  process.exit(1); // Exit if MongoURI is not defined
}

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());

app.get("/tasks", getTasks);
app.post("/tasks", addTask);
app.put("/tasks/:id", updateTask);
app.delete("/tasks/:id", deleteTask);

export default app;
