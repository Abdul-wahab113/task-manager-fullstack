import { validateToken } from "../Utils/token.utils.js";


/**
 * @param {import('express').Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

const userAuthenticationMiddleware = (req, res, next) => {

    const authHeader = req.get("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header REQUIRED! Please Login first"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
            success: false,
            message: "Invalid Token Format (Correct => Bearer <Token>)"
        });
    }

    // extract the incoming valid formated token in a variable
    const recivedToken = authHeader.split(" ")[1];

    const payload = validateToken(recivedToken);

    if (!payload) {
        return res.status(401).json({
            success: false,
            message: "Invalid Or Expired Token!"
        });
    }

    req.validatedUser = payload;
    next();
};


export {
    userAuthenticationMiddleware
}