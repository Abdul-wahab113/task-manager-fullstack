import "dotenv/config";
import express from "express";
import userRoutes from "./Routes/users.routes.js";
import { connectDB } from "./DB/db.connection.js";
const app = express();
const PORT = process.env.PORT || 8000;


app.use("/api/v1/users", userRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server live on : http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        console.error("DB connection Failed!");
        process.exit(1);
    });
