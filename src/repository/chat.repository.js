import pool from "../db.js";

export async function getChats() {
    const query = `
        SELECT id, name, description, created_at, owner_id
        FROM chats
    `

    const {rows} = await pool.query(query, values);
    return rows;
}

export async function createChat(name, description=null, password=null, ownerId) {
    const query = `
        INSERT INTO chats (name, description, password, owner_id)
        VALUES($1, $2, $3, $4)
        RETURNING id, name, description, created_at, owner_id
    `;

    const values = [name, description, password, ownerId];

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function getChatById(id) {
    const query = `
        SELECT id, name, description, created_at, owner_id
        FROM chats
        WHERE id = $1
    `

    const values = [id];

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function updateChat(name = null, description = null, password = null, id) {
    const query = `
        UPDATE chats
        SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            password = COALESCE($3, password)
        WHERE id = $4
        RETURNING id, name, description, created_at, owner_id
    `;

    const values = [name, description, password, id]

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function deleteChat(id) {
    const query = `
        DELETE FROM chats
        WHERE id = $1
        RETURNING id
    `;

    const values = [id]

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function joinChat(userId, chatId) {
    const query = `
        INSERT INTO users_chats (user_id, chat_id)
        VALUES($1, $2)
        RETURNING user_id, chat_id
    `;

    const values = [userId, chatId]

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function leaveChat(userId, chatId) {
    const query = `
        DELETE FROM users_chats 
        WHERE user_id = $1 
        AND chat_id = $2
    `;

    const values = [userId, chatId]

    const {rows} = await pool.query(query, values);
    return rows[0];
}

export async function userBelongsToChat(userId, chatId) {
    const query = `
        SELECT 1
        FROM users_chats
        WHERE user_id = $1 AND chat_id = $2
    `;

    const values = [userId, chatId];

    const { rowCount } = await pool.query(query, values);

    return rowCount > 0
}

export async function userIsChatOwner(userId, chatId) {
  const query = `
    SELECT 1
    FROM chats
    WHERE id = $1 AND owner_id = $2
  `;

  const { rowCount } = await pool.query(query, [chatId, userId]);
  return rowCount > 0;
}
