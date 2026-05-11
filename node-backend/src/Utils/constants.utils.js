// Task status enum to be used in the task model and for validation in the task routes
export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
};

// values of the TaskStatusEnum as an array to be used in the frontend for dropdown options or for validation
export const availableTaskStatusEnum = Object.values(TaskStatusEnum);

export const PriorityEnum = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
};

export const availablePriorityStatusEnum = Object.values(PriorityEnum);


// these constant will make the system more robust and scalable
// for example if we want to add more user roles in the future we can simply add them in the UserRolesEnum and the availableUserRoles will be automatically updated and we don't have to change the code in multiple places where we are using the availableUserRoles array for validation or for dropdown options in the frontend
// these are recommended to be used in the codebase instead of hardcoding the values of user roles and task status in multiple places in the codebase which will make the code more maintainable and less error prone.

