import { and, eq } from "drizzle-orm";
import { db } from "../DB/db.connection.js";
import { tasksTable } from "../Models/index.js";

const createNewTask = async function ({
    title,
    description,
    priority,
    status
}, userId
) {

    const [task] = await db.insert(tasksTable).values({
        title,
        description,
        priority,
        status,
        user_id: userId
    })
        .returning({
            task_id: tasksTable.id,
            title: tasksTable.title
        });


    return task;
};

const getTasksByUserId = async function (userId) {

    return await db.select().
        from(tasksTable).
        where(eq(tasksTable.user_id, userId));
};

const deleteTaskById = async function (taskId, userId) {

    const [deletionresult] = await db.delete(tasksTable).
        where(
            and(
                eq(tasksTable.id, taskId),
                eq(tasksTable.user_id, userId)
            )).
        returning({ id: tasksTable.id });

    return deletionresult;
};

const updateTaskById = async function (taskId, userId, updateData) {

    const [updatedTask] = await db.update(tasksTable).set({
        ...updateData,
        updatedAt: new Date()
    }).where(
        and(
            eq(tasksTable.id, taskId),
            eq(tasksTable.user_id, userId)
        )
    ).returning();

    return updatedTask;
};


export {
    createNewTask,
    getTasksByUserId,
    deleteTaskById,
    updateTaskById
};

