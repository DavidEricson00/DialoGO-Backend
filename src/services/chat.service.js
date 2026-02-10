import {
  createChat as createChatRepo,
  getChats as getChatsRepo,
  updateChat as updateChatRepo,
  getChatById as getChatByIdRepo,
  deleteChat as deleteChatRepo,
  joinChat as joinChatRepo,
  leaveChat as leaveChatRepo,
  userBelongsToChat,
  userIsChatOwner
} from "../repository/chat.repository.js";

function error(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function createChat({ name, description = null, password = null, ownerId }) {
  if (!name || !ownerId) throw error("Dados inválidos", 400);

  const chat = await createChatRepo({ name, description, password, ownerId });
  await joinChatRepo(ownerId, chat.id);

  return {
    id: chat.id,
    name: chat.name,
    description: chat.description,
    owner_id: chat.owner_id,
    created_at: chat.created_at
  };
}

export async function getChats({ search, order, direction, hasPassword }) {
  const allowedOrder = ["name", "created_at"];
  const allowedDirection = ["asc", "desc"];

  const orderBy = allowedOrder.includes(order) ? order : "created_at";
  const orderDirection = allowedDirection.includes(direction) ? direction : "desc";

  let passwordFilter = null;
  if (hasPassword === "true") passwordFilter = true;
  if (hasPassword === "false") passwordFilter = false;

  const chats = await getChatsRepo({
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

export async function joinChat(chatId, userId) {
  if (!chatId || !userId) throw error("Dados inválidos", 400);

  const isMember = await userBelongsToChat(userId, chatId);
  if (isMember) throw error("Usuário já participa do chat", 409);

  await joinChatRepo(userId, chatId);
}

export async function leaveChat(chatId, userId) {
  if (!chatId || !userId) throw error("Dados inválidos", 400);

  const isMember = await userBelongsToChat(userId, chatId);
  if (!isMember) throw error("Usuário não participa do chat", 409);

  const isOwner = await userIsChatOwner(userId, chatId);
  if (isOwner) throw error("Dono não pode sair do chat", 403);

  await leaveChatRepo(userId, chatId);
}
