import pool from "../db.js";

export async function getChatMessages(chatId) {
    const query = `
        SELECT id, content, sent_at, chat_id, user_id
        FROM messages
        WHERE chat_id = $1
    `
    
    const values = [chatId];

    const {rows} = await pool.query(query, values);
    return rows;
}

export async function sendMessage({content, chatId, userId}) {
    const query = `
        INSERT INTO messages (content, chat_id, user_id)
        VALUES($1, $2, $3)
        RETURNING id, content, sent_at, chat_id, user_id
    `;

    const values = [content, chatId, userId];

    const {rows} = await pool.query(query, values);
    return rows[0];
}