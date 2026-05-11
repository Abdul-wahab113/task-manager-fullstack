import express from "express";
import userRoutes from "./Routes/users.routes.js";
import taskRoutes from "./Routes/tasks.routes.js";
import { ApiError } from "./Utils/api.error.utils.js";


const app = express();

// middleware
app.use(express.json({ limit: "16kb" }));


//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);



// global error handler
app.use((err, req, res, next) => {
    // If it's our custom error
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }

    // If it's a generic Error (like a DB crash)
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong on our end"
    });
});

export default app;




