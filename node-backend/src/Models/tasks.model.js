import { pgTable, varchar, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./index.js";
import { TaskStatusEnum, PriorityEnum, availablePriorityStatusEnum, availableTaskStatusEnum } from "../Utils/constants.utils.js";


export const priorityEnum = pgEnum("priority_type", availablePriorityStatusEnum);
export const statusEnum = pgEnum("status_type", availableTaskStatusEnum);

export const tasksTable = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    priority: priorityEnum("priority").default(PriorityEnum.MEDIUM),
    status: statusEnum("status").default(TaskStatusEnum.TODO),

    user_id: uuid("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});
