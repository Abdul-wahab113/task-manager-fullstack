import jwt from "jsonwebtoken";
import "dotenv/config";

const validateToken = function (recivedToken) {

    try {
        const payload = jwt.verify(recivedToken, process.env.JWT_ACCESS_TOKEN_SECRET);

        return payload;
    } catch (error) {
        console.error("JWT Verification Error: ", error);
        return null;
    }
};


export {
    validateToken
}