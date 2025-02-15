import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().default(""), 
  title: z.string(),
  description: z.string().default(""), 
  completed: z.string().default("notcompleted"), 
  createdAt: z.string().default(""), 
  __v: z.number().default(0),
});
