import pool from "../db.js";

export async function getChats({ search, orderBy, orderDirection, hasPassword }) {
  let query = `
    SELECT 
      c.id,
      c.name,
      c.description,
      c.owner_id,
      c.created_at,
      COUNT(uc.user_id)::int AS users_count,
      (c.password IS NOT NULL) AS has_password
    FROM chats c
    LEFT JOIN users_chats uc ON uc.chat_id = c.id
  `;

  const values = [];
  const conditions = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`c.name ILIKE $${values.length}`);
  }

  if (hasPassword === true) {
    conditions.push(`c.password IS NOT NULL`);
  }

  if (hasPassword === false) {
    conditions.push(`c.password IS NULL`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    GROUP BY c.id
    ORDER BY ${orderBy} ${orderDirection}
  `;

  const { rows } = await pool.query(query, values);
  return rows;
}

export async function createChat({ name, description = null, password = null, ownerId }) {
  const { rows } = await pool.query(
    `
      INSERT INTO chats (name, description, password, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, created_at, owner_id
    `,
    [name, description, password, ownerId]
  );
  return rows[0];
}

export async function getChatById(id) {
  const { rows } = await pool.query(
    `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.owner_id,
        c.created_at,
        COUNT(uc.user_id)::int AS users_count,
        (c.password IS NOT NULL) AS has_password
      FROM chats c
      LEFT JOIN users_chats uc ON uc.chat_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `,
    [id]
  );
  return rows[0];
}

export async function updateChat({ name = null, description = null, password = null, chatId }) {
  const { rows } = await pool.query(
    `
      UPDATE chats
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        password = COALESCE($3, password)
      WHERE id = $4
      RETURNING id, name, description, created_at, owner_id
    `,
    [name, description, password, chatId]
  );
  return rows[0];
}

export async function deleteChat(id) {
  await pool.query(`DELETE FROM chats WHERE id = $1`, [id]);
}

export async function joinChat(userId, chatId) {
  const { rows } = await pool.query(
    `
      INSERT INTO users_chats (user_id, chat_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING user_id, chat_id
    `,
    [userId, chatId]
  );
  return rows[0];
}

export async function leaveChat(userId, chatId) {
  await pool.query(
    `
      DELETE FROM users_chats
      WHERE user_id = $1 AND chat_id = $2
    `,
    [userId, chatId]
  );
}

export async function userBelongsToChat(userId, chatId) {
  const { rowCount } = await pool.query(
    `
      SELECT 1 FROM users_chats
      WHERE user_id = $1 AND chat_id = $2
    `,
    [userId, chatId]
  );
  return rowCount > 0;
}

export async function userIsChatOwner(userId, chatId) {
  const { rowCount } = await pool.query(
    `
      SELECT 1 FROM chats
      WHERE id = $1 AND owner_id = $2
    `,
    [chatId, userId]
  );
  return rowCount > 0;
}

export async function getChatPasswordHash(chatId) {
  const { rows } = await pool.query(
    `
      SELECT password
      FROM chats
      WHERE id = $1
    `,
    [chatId]
  );

  return rows[0]?.password ?? null;
}
