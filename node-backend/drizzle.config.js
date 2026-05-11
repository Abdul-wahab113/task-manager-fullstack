import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/Models/index.js",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_Connection_String
    }
}); 