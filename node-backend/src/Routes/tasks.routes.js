import { Router } from "express";
import { createTask, getMyTasks, deleteTask,updateTask } from "../Controller/tasks.controller.js";
import { userAuthenticationMiddleware } from "../Middlewares/auth.middleware.js";
const router = Router();

router.post("/", userAuthenticationMiddleware, createTask);
router.get("/", userAuthenticationMiddleware, getMyTasks);
router.delete("/:id", userAuthenticationMiddleware, deleteTask);
router.patch("/:id",userAuthenticationMiddleware, updateTask)

export default router;
