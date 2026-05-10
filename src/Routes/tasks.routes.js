import { Router } from "express";
import { createTask, getMyTasks } from "../Controller/tasks.controller.js";
import { ensureAuthentication, userAuthenticationMiddleware } from "../Middlewares/auth.middleware.js";
const router = Router();

router.post("/", userAuthenticationMiddleware, createTask);
router.get("/", userAuthenticationMiddleware, getMyTasks)


export default router;
