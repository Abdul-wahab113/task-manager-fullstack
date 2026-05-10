import { taskSchema } from "../Validation/task.validation.js";
import { createNewTask } from "../Services/task.services.js";

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


export {
    createTask
}