import { pgTable, varchar, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./index.js";


export const priorityEnum = pgEnum("priority_type", ["low", "medium", "high"]);
export const statusEnum = pgEnum("status_type", ["todo", "in_progress", "done"]);

export const tasksTable = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    priority: priorityEnum("priority").default("medium"),
    status: statusEnum("status").default("todo"),

    user_id: uuid("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});
