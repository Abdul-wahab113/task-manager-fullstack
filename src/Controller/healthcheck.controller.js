import { ApiResponse } from "../Utils/api.responses.utils.js";
import { asyncHandler } from "../Utils/async.handler.utils.js";


const healthCheck = asyncHandler(async (req, res) => {
    const response = new ApiResponse(200, { message: "Server is healty and running fine!" });

    return res.status(200)
        .json(response);
});

export {
    healthCheck
};

