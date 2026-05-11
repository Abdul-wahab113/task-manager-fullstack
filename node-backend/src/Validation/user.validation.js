import { z } from "zod";

const userRegistionSchemaValidation = z.object({
    username: z.string()
        .trim()
        .min(3, "Username must be 3 character long")
        .max(20, "Too long username"),

    email: z.string()
        .trim()
        .lowercase()
        .email({ message: "Please enter a valid email" })
        .min(5, "Email is too short")
        .max(100, "Email is too long"),

    password: z.string()
        .min(8, "Password must be 8 characters long")
        .max(100, "Too long password")
        .regex(/[A-Z]/, "Must contain one upper-case letter")
        .regex(/[a-z]/, "Must contain one lower-case letter")
        .regex(/[0-9]/, "Must contain a digit")

});

const userLoginSchemaValidation = z.object({
    email: z.string()
        .trim()
        .lowercase()
        .email("Invalid email format"),
    password: z.string()
        .min(1, "Password is required")
});



export {
    userRegistionSchemaValidation,
    userLoginSchemaValidation
}