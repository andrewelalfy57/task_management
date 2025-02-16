import { Request, Response } from "express";
import TaskModel from "../Models/Task";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await TaskModel.find();
    res.status(201).json(tasks);
  } catch (error) {
    res.status(404).json({ message: "Error fetching tasks" });
  }
};

export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = new TaskModel(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);
    res.status(201).json(task);
  } catch (error) {
    res.status(404).json({ message: "Error deleting task" });
  }
};
