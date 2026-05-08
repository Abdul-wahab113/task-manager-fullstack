import { eq } from "drizzle-orm";
import { db } from "../DB/db.connection.js";
import { userTable } from "../Models/index.js";

const findUserWithEmail = async function (email) {

    const existingUser = await db.select({
        id: userTable.id,
        username: userTable.username,
        email: userTable.email,
        password: userTable.password
    })
        .from(userTable)
        .where(eq(userTable.email, email));

    return existingUser[0];
};


const registerNewUserInDB = async function ({
    username,
    email,
    hashedPassword
}) {

    const [newUser] = await db.insert(userTable).values({
        username: username,
        email: email,
        password: hashedPassword
    }).returning({
        user_Id: userTable.id
    });

    return newUser;
}



export {
    findUserWithEmail,
    registerNewUserInDB
}