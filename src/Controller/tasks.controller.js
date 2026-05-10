import { taskSchema, taskDeletionSchema } from "../Validation/task.validation.js";
import { createNewTask, getTasksByUserId, deleteTaskById } from "../Services/task.services.js";

const createTask = async (req, res) => {

    const { id: user_Id } = req.validatedUser;
    const validationResult = await taskSchema.safeParseAsync(req.body);

    if (validationResult.error) {

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            error: validationResult.error.flatten().fieldErrors
        });
    }

    try {

        const newlyCreatedTask = await createNewTask(validationResult.data, user_Id);

        return res.status(201).json({
            success: true,
            message: "New Task created Successfully.",
            data: {
                id: newlyCreatedTask.task_id,
                title: newlyCreatedTask.title
            }
        });


    } catch (error) {
        console.error("Task Creation Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Interval Server Error"
        });
    }

}

const getMyTasks = async (req, res) => {

    const { id: user_Id } = req.validatedUser;

    try {
        // fetch all tasks of the current user that is requesting for it.
        const tasks = await getTasksByUserId(user_Id);

        res.status(200).json({
            success: true,
            message: "User's tasks are fetched successfully.",
            count: tasks.length,
            tasks: tasks
        })


    } catch (error) {
        console.error("Error in fetching the user's tasks");
        res.status(500).json({
            success: false,
            message: "Internal Sever Error"
        });
    }

};

const deleteTask = async (req, res) => {

    const validationResult = await taskDeletionSchema.safeParseAsync({ taskId: req.params.id });

    if (validationResult.error) {
        return res.status(400).json({
            success: false,
            message: "Invalid Task Id",
            error: validationResult.error.flatten().fieldErrors
        });
    }

    const { taskId } = validationResult.data;
    const { id: userId } = req.validatedUser;

    try {
        const deletionResult = await deleteTaskById(taskId, userId);

        if (deletionResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });


    } catch (error) {
        console.error("Error in Task Deletion", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }





};

export {
    createTask,
    getMyTasks,
    deleteTask
}