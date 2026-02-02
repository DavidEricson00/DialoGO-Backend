import bcrypt from "bcrypt"
import { BYCRYPT_SALT_ROUNDS } from "../config/env.js";
import { createUser as createUserRepo } from "../repository/user.repository.js"

export async function createUser({username, password}) {
    if(!username || !password) {
        throw new Error("Dados inválidos");
    }

    const saltRounds = parseInt(BYCRYPT_SALT_ROUNDS);

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