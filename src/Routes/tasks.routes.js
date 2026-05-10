import { Router } from "express";
import { createTask } from "../Controller/tasks.controller.js";
import { ensureAuthentication, userAuthenticationMiddleware } from "../Middlewares/auth.middleware.js";
const router = Router();

router.post("/", userAuthenticationMiddleware, createTask);

export default router;
