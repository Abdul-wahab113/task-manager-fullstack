import { Router } from "express";
import rateLimit from "express-rate-limit";
import { registerUser, loginUser, refreshAccessToken, logoutUser, forgotPassword, resetPassword } from "../Controller/user.controller.js";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per window for auth routes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again after 5 minutes"
    }
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;