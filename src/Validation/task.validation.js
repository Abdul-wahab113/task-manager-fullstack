import { z } from "zod";
import { priorityEnum, statusEnum } from "../Models/index.js";


const taskSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is Required")
        .max(255, "Title is too long"),

    description: z.string()
        .trim()
        .max(1000, "Description is too long")
        .optional(),

    priority: z.enum(priorityEnum.enumValues).
        default("medium"),

    status: z.enum(statusEnum.enumValues).
        default("todo"),
});

const taskDeletionSchema = z.object({
    taskId: z.string().
        uuid("Invalid Task ID format")
});

const taskIdUpdateSchema = z.object({
    taskId: z.string().
        uuid("Invalid Task ID format")
});

const updateTaskSchema = z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "You must provide at least one field to update",
});


export {
    taskSchema,
    taskDeletionSchema,
    taskIdUpdateSchema,
    updateTaskSchema
};