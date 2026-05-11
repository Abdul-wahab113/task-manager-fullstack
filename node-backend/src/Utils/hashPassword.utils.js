import "dotenv/config";
import bcrypt from "bcrypt";

const generateHashedPassword = async function (password) {

    const hashedPassword = await bcrypt.hash(password, Number(process.env.HASHING_ROUNDS));

    return hashedPassword;
}

export {
    generateHashedPassword
}