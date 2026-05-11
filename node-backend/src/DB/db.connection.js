import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../Models/index.js";


const pool = new pg.Pool({
    connectionString: process.env.DB_Connection_String,
    max: 10,
    connectionTimeoutMillis: 2000, // Wait 2 seconds max
    idleTimeoutMillis: 30000,
});


export const db = drizzle(pool, { schema });


export async function connectDB() {
    try {
        const client = await pool.connect();
        console.log(" ✅ Database Connected.");
        client.release();
    } catch (error) {
        console.error(" ❌ Database Connection Error:", error.message);
        process.exit(1);
    }
};