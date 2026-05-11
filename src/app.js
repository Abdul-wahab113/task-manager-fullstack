import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./Routes/users.routes.js";
import taskRoutes from "./Routes/tasks.routes.js";
import { ApiError } from "./Utils/api.error.utils.js";


const app = express();

// middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
// CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to 
// restrict web pages from making requests to a different domain than the one that served the web page.
app.use(cors({
    // allow the frontend to access the backend resources from this origin
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",

    credential: true,
    // allow the frontend to send cookies and auth headers with the request
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],

    // allow the frontend to send these headers in the request
    headers: ["Content-Type", "Authorization"]
}));

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




