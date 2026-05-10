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

export {
    createNewTask
}

