import {
    userRegistionSchemaValidation,
    userLoginSchemaValidation
} from "../Validation/user.validation.js";

import {
    findUserWithEmail,
    registerNewUserInDB,
    findUserById,
    findUserByRefreshToken,
    updateUserRefreshToken
} from "../Services/user.services.js";

import { asyncHandler } from "../Utils/async.handler.utils.js";
import { ApiError } from "../Utils/api.error.utils.js";
import { ApiResponse } from "../Utils/api.responses.utils.js";

import { generateHashedPassword } from "../Utils/hashPassword.utils.js";
import { createToken, createRefreshToken, validateToken } from "../Utils/token.utils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// register new user controller
const registerUser = asyncHandler(async (req, res) => {

    const validationResult = await userRegistionSchemaValidation.safeParseAsync(req.body);

    if (validationResult.error) {

        throw new ApiError(400, "Validation Failed", validationResult.error.flatten().fieldErrors);
    }

    // all validated data safe to process  
    const { username, email, password } = validationResult.data;

    // check if the user already exist or not 
    const existingUser = await findUserWithEmail(email);

    if (existingUser) {
        throw new ApiError(409, "User already exists", { email: "Account with this email already in use" });
    }



    // then create a new user in db
    // get the hased password before saving into the db
    // 1. Hash the password
    const hashedPassword = await generateHashedPassword(password);

    // 2. store in db
    const newUser = await registerNewUserInDB({
        username,
        email,
        hashedPassword
    });

    // 3. respond
    if (newUser) {
        return res
            .status(201)
            .json(new ApiResponse(201, null, "User registered successfully"));
    }

    if (!newUser) {
        throw new ApiError(500, "User creation failed in database");
    }

});

// login user controller 
const loginUser = asyncHandler(async (req, res) => {
    const validationResult = await userLoginSchemaValidation.safeParseAsync(req.body);

    if (validationResult.error) {
        throw new ApiError(400, "Validation Failed", validationResult.error.flatten().fieldErrors);
    }

    // validated results 
    const { email, password } = validationResult.data;

    // the user info from db if exists
    const existingUser = await findUserWithEmail(email);

    // verify the given password 
    // even the user does not exists we perform the password compare to aviod the timing attack
    const isPasswordCorrect = existingUser ? await bcrypt.compare(password, existingUser.password) : false;


    if (!existingUser || !isPasswordCorrect) {
        throw new ApiError(401, "Email or password incorrect");
    }

    // if user exists and password is correct then create the access token using jwt and assign to user 
    const accessToken = createToken({
        id: existingUser.id,
        username: existingUser.username
    });

    const refreshToken = createRefreshToken({
        id: existingUser.id
    });

    // Save refresh token to database
    await updateUserRefreshToken(existingUser.id, refreshToken);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    // send response to to user the generated access token 
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { username: existingUser.username, accessToken },
            "User logged in successfully."
        ));
});

// Refresh Token Controller
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        
        const user = await findUserById(decodedToken.id);
        
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        const newAccessToken = createToken({ id: user.id, username: user.username });
        const newRefreshToken = createRefreshToken({ id: user.id });

        await updateUserRefreshToken(user.id, newRefreshToken);

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200, 
                { accessToken: newAccessToken }, 
                "Access token refreshed"
            ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Logout User Controller
const logoutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (incomingRefreshToken) {
        try {
            const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            await updateUserRefreshToken(decodedToken.id, null);
        } catch (error) {
            // Ignore token verification errors on logout, just clear cookie
        }
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
}