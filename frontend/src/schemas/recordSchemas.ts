import { z } from "zod"

export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Item text cannot be empty"),
  completed: z.boolean().default(false),
})

export const recordFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title is too long"),
  description: z.string().max(2000, "Description cannot exceed 2000 characters").default(""),
  category: z.string().min(1, "Please select or enter a category"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["Draft", "Open", "In Progress", "Completed", "Archived"]),
  tags: z.array(z.string()).default([]),
  due_date: z.string().nullable().optional(),
  checklist: z.array(checklistItemSchema).default([]),
})

export type RecordFormData = z.infer<typeof recordFormSchema>
