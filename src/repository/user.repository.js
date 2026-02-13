import pool from "../db.js";

export async function createUser({username, password}) {
    const query = `
        INSERT INTO users (username, password)
        VALUES($1, $2)
        RETURNING id, username, avatar, created_at
    `;

    const values = [username, password];

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function findUserByUsername(username) {
    const query = `
        SELECT id, username, password, avatar, created_at
        FROM users
        WHERE username = $1
    `
    
    const values = [username];

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function findUserById(id) {
    const query = `
        SELECT id, username, avatar, created_at
        FROM users
        WHERE id = $1
    `

    const values = [id];

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function updateUser(id, {username = null, avatar = null, password = null}) {
    const query = `
        UPDATE users
        SET
            username = COALESCE($1, username),
            avatar = COALESCE($2, avatar),
            password = COALESCE($3, password)
        WHERE id = $4
        RETURNING id, username, avatar, created_at
    `;

    const values = [username, avatar, password, id];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function getUserChats(userId) {
    const query = `
        SELECT c.id, c.name, c.description, c.created_at
        FROM chats c
        INNER JOIN users_chats uc ON uc.chat_id = c,id
        WHERE uc.user_id = $1
    `

    const values = [userId];

    const {rows} = await pool.query(query, values);
    return rows[0];
}