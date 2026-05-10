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


export {
    taskSchema
}