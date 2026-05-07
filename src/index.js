import app from "./app.js";
import { connectDB } from "./DB/db.connection.js";
import "dotenv/config";
const PORT = process.env.PORT || 8000;


// db connection then starting server
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
