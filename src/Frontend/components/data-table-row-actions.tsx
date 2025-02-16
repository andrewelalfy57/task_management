"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import type { Row } from "@tanstack/react-table";
import dynamic from "next/dynamic";

const MoreHorizontal = dynamic(() =>
  import("lucide-react").then((mod) => mod.MoreHorizontal)
);

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { taskSchema } from "./schema";

interface DataTableRowActionsProps {
  row: Row<any>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const task = taskSchema.parse(row.original);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState({
    ...task,
    isCompleted: Boolean(task.completed), // Ensure isCompleted is always a boolean
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation

  const deleteTask = async () => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${task.id}`);
      setIsDeleteDialogOpen(false); // Close the delete dialog after deletion
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const openDialog = (editMode: boolean) => {
    setIsEditMode(editMode);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditedTask({ ...task, isCompleted: Boolean(task.completed) });
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setEditedTask((prev) => ({
      ...prev,
      completed: checked ? "completed" : "pending",
    }));
  };

  const handleSave = async () => {
    try {
      const updatedTask = {
        ...editedTask,
        completed: editedTask.completed === "completed",
      };
      console.log("Updated task:", updatedTask);
      await axios.put(`http://localhost:8000/tasks/${task.id}`, updatedTask);
      closeDialog();
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => openDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog(false)}>
            Show Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openDeleteDialog}>
            Delete
          </DropdownMenuItem>{" "}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit/Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="space-y-4 max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? "Edit Task" : "Task Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Label htmlFor="title" className="w-32 text-right text-lg">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="flex-1"
                disabled={!isEditMode}
                placeholder="Enter task title"
              />
            </div>
            <div className="flex gap-4">
              <Label htmlFor="description" className="w-32 text-right text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                className="flex-1"
                disabled={!isEditMode}
                placeholder="Enter task description"
                rows={5}
              />
            </div>
            <div className="flex gap-4 items-center">
              <Label htmlFor="isCompleted" className="w-32 text-right text-lg">
                Completed
              </Label>
              <Checkbox
                id="completed"
                checked={editedTask.completed === "completed"}
                onCheckedChange={handleCheckboxChange}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            {isEditMode && (
              <Button
                variant="outline"
                type="button"
                onClick={handleSave}
                className="w-full md:w-auto"
              >
                Save changes
              </Button>
            )}
            <Button
              variant="outline"
              type="button"
              onClick={closeDialog}
              className="w-full md:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="space-y-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Are you sure you want to delete this task?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={deleteTask}
              className="w-full md:w-auto bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Delete
            </Button>
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
