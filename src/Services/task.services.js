import { eq } from "drizzle-orm";
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

    const userTasks = await db.select().
        from(tasksTable).
        where(eq(tasksTable.user_id, userId));

    return userTasks;
};


export {
    createNewTask,
    getTasksByUserId
}

