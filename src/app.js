import express from "express";
import userRoutes from "./Routes/users.routes.js";


const app = express();

// middleware
app.use(express.json({ limit: "16kb" }));


//routes
app.use("/api/v1/users", userRoutes);


export default app;




