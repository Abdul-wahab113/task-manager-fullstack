class ApiError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        this.data = null;
        this.message = message;


        /*
        bcz the stack trace is only available in development environment and in production we don't want to expose the 
        stack trace to the client so we can pass the stack trace as an argument to the constructor and if it's not provided 
        then we can capture the stack trace using Error.captureStackTrace() method which is available in V8 engine (Node.js) 
        and it will capture the stack trace of the error and assign it to the stack property of the error object.
        */

        if (stack) {
            this.stack = stack
        }

        else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
};

export {
    ApiError
};
