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

import { db } from "../DB/db.connection.js";
import { userTable } from "../Models/users.model.js";
import { eq, and, gt } from "drizzle-orm";
import { asyncHandler } from "../Utils/async.handler.utils.js";
import { ApiError } from "../Utils/api.error.utils.js";
import { ApiResponse } from "../Utils/api.responses.utils.js";

import { generateHashedPassword } from "../Utils/hashPassword.utils.js";
import { createToken, createRefreshToken } from "../Utils/token.utils.js";
import { sendPasswordResetEmail } from "../Utils/email.utils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";


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

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await db.select().from(userTable).where(eq(userTable.email, email));

    if (!user || user.length === 0) {
        // Return 200 anyway to prevent email enumeration attacks
        return res.status(200).json(new ApiResponse(200, null, "If an account with that email exists, a reset link has been sent."));
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expiry to 15 minutes from now
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save hashed token and expiry to DB
    await db.update(userTable)
        .set({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: resetExpires
        })
        .where(eq(userTable.id, user[0].id));

    // Send email (we use the unhashed token in the email!)
    try {
        await sendPasswordResetEmail(user[0].email, resetToken);
        return res.status(200).json(new ApiResponse(200, null, "If an account with that email exists, a reset link has been sent."));
    } catch (error) {
        // If email fails, clear the token from DB
        await db.update(userTable)
            .set({
                resetPasswordToken: null,
                resetPasswordExpires: null
            })
            .where(eq(userTable.id, user[0].id));

        console.error("Failed to send email:", error);
        throw new ApiError(500, "Failed to send reset email. Please try again later.");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        throw new ApiError(400, "Token and new password are required");
    }

    // Hash the token from the URL to compare with the one in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this token and ensure it hasn't expired
    const user = await db.select().from(userTable)
        .where(
            and(
                eq(userTable.resetPasswordToken, hashedToken),
                gt(userTable.resetPasswordExpires, new Date())
            )
        );

    if (!user || user.length === 0) {
        throw new ApiError(400, "Invalid or expired password reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user and clear reset token fields
    await db.update(userTable)
        .set({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        })
        .where(eq(userTable.id, user[0].id));

    return res.status(200).json(new ApiResponse(200, null, "Password has been reset successfully. You can now login."));
});


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    resetPassword
}