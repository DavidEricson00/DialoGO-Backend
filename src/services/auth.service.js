import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { BYCRYPT_SALT_ROUNDS } from "../config/env.js";
import { 
    createUser as createUserRepo,
    findUserByUsername as findUserByUsernameRepo,
}  from "../repository/user.repository.js"

export async function createUser({username, password}) {
    if(!username || !password) {
        throw new Error("Dados inválidos");
    }

    const saltRounds = Number(BYCRYPT_SALT_ROUNDS);

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await createUserRepo({
        username,
        password: passwordHash,
    })

    return {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        created_at: user.created_at
    }
}

export async function loginUser({username, password}) {
    if(!username || !password) {
        throw new Error("Dados inválidos");
    }

    const saltRounds = Number(BYCRYPT_SALT_ROUNDS);

    const user = await findUserByUsernameRepo(username);

    if(!user) {
        throw new Error("Usuário ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if(!passwordMatch) {
        throw new Error("Usuário ou senha inválidos");
    }

    const token = jwt.sign(
        {
            sub: user.id,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar
        },
    };
}