import { userRegistionSchemaValidation, userLoginSchemaValidation } from "../Validation/user.validation.js";
import { findUserWithEmail, registerNewUserInDB } from "../Services/user.services.js";
import { generateHashedPassword } from "../Utils/hashPassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// register new user controller
const registerUser = async (req, res) => {

    const validatedResult = await userRegistionSchemaValidation.safeParseAsync(req.body);

    if (validatedResult.error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validatedResult.error.flatten().fieldErrors
        });
    }

    // all validated data safe to process  
    const { username, email, password } = validatedResult.data;

    // check if the user already exist or not 
    const existingUser = await findUserWithEmail(email);

    if (existingUser) {
        return res.status(409)
            .json({
                success: "false",
                message: "User already exists!",
                error: {
                    email: "Account with this email already in use"
                }
            });
    }


    try {
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
            return res.status(201)
                .json({
                    success: true,
                    message: "User registered successfully",
                });
        }

        if (!newUser) {
            throw new Error("User creation failed in database");
        }
    } catch (error) {
        console.error("Registration error: ", error);
        return res.status(500).json({
            success: false,
            message: "Interval server error during registration"
        });
    }

}

// login user controller 
const loginUser = async (req, res) => {
    const validatedResult = await userLoginSchemaValidation.safeParseAsync(req.body);

    if (validatedResult.error) {

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: validatedResult.error.flatten().fieldErrors
        });

    }

    // validated results 
    const { email, password } = validatedResult.data;



    try {
        // the user info from db if exists
        const existingUser = await findUserWithEmail(email);

        // verify the given password 
        // even the user does not exists we perform the password compare to aviod the timing attack
        const isPasswordCorrect = existingUser ? await bcrypt.compare(password, existingUser.password) : false;


        if (!existingUser || !isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Eamil or passowrd incorrect"
            });
        }

        // if user exists and password is correct then create the access token using jwt and assign to user 
        const accessToken = jwt.sign({
            id: existingUser.id,
            username: existingUser.username
        },

            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
            }
        );



        // send response to to user the generated access token 
        return res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            data: {
                username: existingUser.username,
                accessToken: accessToken
            }
        });


    } catch (error) {

        console.error("Error during login: ", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error during user login",
        });
    }

};



export {
    registerUser,
    loginUser
}