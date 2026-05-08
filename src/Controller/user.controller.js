import { userRegistionSchemaValidation, userLogInSchemaValidation } from "../Validation/user.validation.js";
import { findUserWithEmail, registerNewUserInDB } from "../Services/user.services.js";
import { generateHashedPassword } from "../Utils/hashPassword.js";


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

    const validatedResult = await userLogInSchemaValidation.safeParseAsync(req.body);

    if (validatedResult.error) {

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: validatedResult.error.flatten().fieldErrors
        });

        // validated results 
        const { email, password } = validatedResult.data;

        // the user info from db if exists
        const existingUser = await findUserWithEmail(email);

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User Must have to register first to login"
            });
        }




    }

};



export {
    registerUser,
    loginUser
}