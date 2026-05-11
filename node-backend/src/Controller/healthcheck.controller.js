import { ApiResponse } from "../Utils/api.responses.utils.js";
import { asyncHandler } from "../Utils/async.handler.utils.js";

const healthCheck = asyncHandler(async (req, res) => {
    // Pass null or empty object for data, and the descriptive string as the message
    return res.status(200)
        .json(new ApiResponse(200, {}, "Server is healthy and running fine!"));
});


export  {
    healthCheck
};

