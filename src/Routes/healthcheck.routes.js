import { healthCheck } from "../Controller/healthcheck.controller.js";

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    healthCheck(req, res);
});

export default router;

