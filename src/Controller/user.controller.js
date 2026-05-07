import { userRegistionSchemaValidation } from "../Validation/user.validation.js";
import { findUserWithEmail, registerNewUserInDB } from "../Services/user.services.js";
import { generateHashedPassword } from "../Utils/hashPassword.js";

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


export{
    registerUser
}