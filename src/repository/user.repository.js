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
    return rows[0]
}