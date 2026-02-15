import bcrypt from "bcrypt"
import { BYCRYPT_SALT_ROUNDS } from "../config/env.js";
import {
  createChat as createChatRepo,
  getAvailableChats as getAvailableChatsRepo,
  updateChat as updateChatRepo,
  getChatById as getChatByIdRepo,
  deleteChat as deleteChatRepo,
  joinChat as joinChatRepo,
  leaveChat as leaveChatRepo,
  getUserChats as getUserChatsRepo,
  getUsersFromChat as getUsersFromChatRepo,
  userBelongsToChat,
  userIsChatOwner,
  getChatPasswordHash,
} from "../repository/chat.repository.js";

function error(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}


export async function createChat({ name, description = null, password = null, ownerId }) {
  if (!name || !ownerId) throw error("Dados inválidos", 400);

  if (name.length > 32 || description.length > 128 || password.length > 100) {
        throw new Error("Dados inválidos");
  }

  let chat;

  if (password) {
    const saltRounds = Number(BYCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    chat = await createChatRepo({
      name,
      description,
      password: passwordHash,
      ownerId
    });
  } else {
    chat = await createChatRepo({
      name,
      description,
      password: null,
      ownerId
    });
  }

  await joinChatRepo(ownerId, chat.id);

  return {
    id: chat.id,
    name: chat.name,
    description: chat.description,
    owner_id: chat.owner_id,
    created_at: chat.created_at
  };
}


export async function getAvailableChats(
  userId,
  { search, order, direction, hasPassword }
) {
  const allowedOrder = ["name", "users_count", "created_at"];
  const allowedDirection = ["asc", "desc"];

  const orderBy = allowedOrder.includes(order) ? order : "created_at";
  const orderDirection = allowedDirection.includes(direction) ? direction : "desc";

  let passwordFilter = null;
  if (hasPassword === "true") passwordFilter = true;
  if (hasPassword === "false") passwordFilter = false;

  const chats = await getAvailableChatsRepo(userId, {
    search,
    orderBy,
    orderDirection,
    hasPassword: passwordFilter
  });

  return chats.map(chat => ({
    id: chat.id,
    name: chat.name,
    description: chat.description,
    users_count: chat.users_count,
    has_password: chat.has_password
  }));
}


export async function getUserChats(userId) {
  const chats = await getUserChatsRepo(userId);

  return chats.map(chat => ({
    id: chat.id,
    name: chat.name,
    description: chat.description,
    users_count: chat.users_count,
    has_password: chat.has_password
  }));
}


export async function getChatById(id) {
  if (!id) throw error("Id inválido", 400);

  const chat = await getChatByIdRepo(id);
  if (!chat) throw error("Chat não encontrado", 404);

  return {
    id: chat.id,
    name: chat.name,
    description: chat.description,
    owner_id: chat.owner_id,
    created_at: chat.created_at,
    users_count: chat.users_count,
    has_password: chat.has_password
  };
}


export async function updateChat({ name = null, description = null, password = null, chatId, ownerId }) {
  if (!chatId || !ownerId) throw error("Dados inválidos", 400);

  if (name.length > 32 || description.length > 128 || password.length > 100) {
        throw new Error("Dados inválidos");
  }

  const isOwner = await userIsChatOwner(ownerId, chatId);
  if (!isOwner) throw error("Usuário não é o dono do chat", 403);

  const chatUpdated = await updateChatRepo({ name, description, password, chatId });
  if (!chatUpdated) throw error("Chat não encontrado", 404);

  return {
    id: chatUpdated.id,
    name: chatUpdated.name,
    description: chatUpdated.description,
    created_at: chatUpdated.created_at
  };
}


export async function deleteChat(chatId, ownerId) {
  if (!chatId || !ownerId) throw error("Dados inválidos", 400);

  const isOwner = await userIsChatOwner(ownerId, chatId);
  if (!isOwner) throw error("Usuário não é o dono do chat", 403);

  
  await deleteChatRepo(chatId);
}


export async function joinChat(chatId, userId, password = null) {
  if (!chatId || !userId) throw error("Dados inválidos", 400);

  const isMember = await userBelongsToChat(userId, chatId);
  if (isMember) throw error("Usuário já participa do chat", 409);

  const passwordHash = await getChatPasswordHash(chatId);

  if (passwordHash) {
    if (!password || !password.trim()) {
      throw error("Senha obrigatória", 401);
    }

    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      throw error("Senha incorreta", 403);
    }
  }

  await joinChatRepo(userId, chatId);
}


export async function leaveChat(chatId, userId) {
  if (!chatId || !userId) throw error("Dados inválidos", 400);

  const isMember = await userBelongsToChat(userId, chatId);
  if (!isMember) throw error("Usuário não participa do chat", 403);

  const isOwner = await userIsChatOwner(userId, chatId);
  if (isOwner) throw error("Dono não pode sair do chat", 403);

  await leaveChatRepo(userId, chatId);
}

export async function getUsersFromChat(chatId, userId) {
  if (!chatId || !userId) throw error("Dados inválidos", 400);

  const isMember = await userBelongsToChat(userId, chatId);
  if (!isMember) throw error("Usuário não participa do chat", 403);

  const users = await getUsersFromChatRepo(chatId)

  return users.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    created_at: user.created_at
  }));
}