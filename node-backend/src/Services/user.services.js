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
        .where(eq(userTable.email, email))
        .limit(1);

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



const findUserById = async function (id) {
    const existingUser = await db.select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);
    return existingUser[0];
};

const findUserByRefreshToken = async function (token) {
    const existingUser = await db.select()
        .from(userTable)
        .where(eq(userTable.refreshToken, token))
        .limit(1);
    return existingUser[0];
};

const updateUserRefreshToken = async function (userId, refreshToken) {
    await db.update(userTable)
        .set({ refreshToken })
        .where(eq(userTable.id, userId));
};

export {
    findUserWithEmail,
    registerNewUserInDB,
    findUserById,
    findUserByRefreshToken,
    updateUserRefreshToken
}