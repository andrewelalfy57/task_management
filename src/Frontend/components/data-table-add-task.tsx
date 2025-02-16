"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "./ui/use-toast";
import dynamic from "next/dynamic";

const Loader2 = dynamic(() =>
  import("lucide-react").then((mod) => mod.Loader2)
);

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isCompleted: z.boolean().default(false),
  description: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      isCompleted: false,
      description: "",
    },
  });

  async function onSubmit(data: TaskFormValues) {
    setIsLoading(true);
    try {
      // Fetch existing tasks
      const response = await fetch("http://localhost:8000/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const tasks = await response.json();
      const taskExists = tasks.some(
        (task: { title: string }) => task.title === data.title
      );

      if (taskExists) {
        form.setError("title", {
          type: "manual",
          message: "A task with this title already exists. Please choose another title.",
        });
        setIsLoading(false);
        return;
      }

      // Proceed with task creation
      const { isCompleted, ...rest } = data;
      const formattedData = { ...rest, completed: isCompleted };

      const createResponse = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!createResponse.ok) throw new Error("Failed to create task");

      toast({
        title: "Task created",
        description: "Your new task has been successfully created.",
      });

      window.location.reload();
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your task.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="md">
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormDescription>The title of your new task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Task Completed</FormLabel>
                    <FormDescription>
                      Mark if the task is already completed.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description of the task (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
