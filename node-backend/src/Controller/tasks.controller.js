import {
    taskSchema,
    taskDeletionSchema,
    taskIdUpdateSchema,
    updateTaskSchema
} from "../Validation/task.validation.js";
import {
    createNewTask,
    getTasksByUserId,
    deleteTaskById,
    updateTaskById
} from "../Services/task.services.js";

import { ApiError } from "../Utils/api.error.utils.js";
import { ApiResponse } from "../Utils/api.responses.utils.js";
import { asyncHandler } from "../Utils/async.handler.utils.js";


const createTask = asyncHandler(async (req, res) => {

    const { id: user_Id } = req.validatedUser;
    const validationResult = await taskSchema.safeParseAsync(req.body);

    if (validationResult.error) {
        throw new ApiError(400, "Validation Failed", validationResult.error.flatten().fieldErrors);
    }

    const newlyCreatedTask = await createNewTask(validationResult.data, user_Id);

    return res.
        status(201).
        json(new ApiResponse(201, newlyCreatedTask, "New Task created Successfully."));

});

const getMyTasks = asyncHandler(async (req, res) => {

    const { id: user_Id } = req.validatedUser;

    // fetch all tasks of the current user that is requesting for it.
    const tasks = await getTasksByUserId(user_Id);

    return res.status(200).json(new ApiResponse(200, tasks, "User's tasks are fetched successfully."));

});

const deleteTask = asyncHandler(async (req, res) => {

    const validationResult = await taskDeletionSchema.safeParseAsync({ taskId: req.params.id });

    if (validationResult.error) {
        throw new ApiError(400, "Invalid Task Id", validationResult.error.flatten().fieldErrors);
    }

    const { taskId } = validationResult.data;
    const { id: userId } = req.validatedUser;


    const deletionResult = await deleteTaskById(taskId, userId);

    if (!deletionResult || deletionResult.length === 0) {
        throw new ApiError(404, "Task not found or access denied");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Task deleted successfully"));
});


const updateTask = asyncHandler(async (req, res) => {

    const { id: userId } = req.validatedUser;
    const { id: taskId } = req.params;

    const validatedTaskId = await taskIdUpdateSchema.safeParseAsync({ taskId });

    if (validatedTaskId.error) {
        throw new ApiError(400, "Invalid Task Id", validatedTaskId.error.flatten().fieldErrors);
    };

    const validatedUpdateData = await updateTaskSchema.safeParseAsync(req.body);

    if (validatedUpdateData.error) {
        throw new ApiError(400, "Validation Failed", validatedUpdateData.error.flatten().fieldErrors);
    };


    // db operation for task updation
    const updatedTask = await updateTaskById(taskId, userId, validatedUpdateData.data);

    if (!updatedTask) {
        throw new ApiError(404, "Task Not found or Access Denied");
    };

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task Updated Successfully"));
});


export {
    createTask,
    getMyTasks,
    deleteTask,
    updateTask
};