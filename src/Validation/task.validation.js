import { z } from "zod";
import {
    availablePriorityStatusEnum,
    availableTaskStatusEnum,
    PriorityEnum,
    TaskStatusEnum
} from "../Utils/constants.utils.js";


const taskSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is Required")
        .max(255, "Title is too long"),

    description: z.string()
        .trim()
        .max(1000, "Description is too long")
        .optional(),

    priority: z.enum(availablePriorityStatusEnum).
        default(PriorityEnum.MEDIUM),

    status: z.enum(statusEnum.enumValues).
        default(TaskStatusEnum.TODO),
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
    priority: z.enum(availablePriorityStatusEnum).optional(),
    status: z.enum(availableTaskStatusEnum).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "You must provide at least one field to update",
});


export {
    taskSchema,
    taskDeletionSchema,
    taskIdUpdateSchema,
    updateTaskSchema
};