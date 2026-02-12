import {
  createChat,
  deleteChat,
  getChatById,
  getAvailableChats,
  getUserChats,
  joinChat,
  leaveChat,
  updateChat
} from "../services/chat.service.js";

function handleError(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ message: err.message || "Erro interno" });
}

export async function createChatController(req, res) {
  try {
    const { name, description, password } = req.body;
    const chat = await createChat({
      name,
      description,
      password,
      ownerId: req.user.id
    });
    return res.status(201).json(chat);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function getAvailableChatsController(req, res) {
  try {
    const { search, order, direction, hasPassword } = req.query;

  const chats = await getAvailableChats(
    req.user.id,
    { search, order, direction, hasPassword }
  );

    return res.json(chats);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function getUserChatsController(req, res) {
  try {
    const chats = await getUserChats(req.user.id);

    return res.json(chats)
  } catch(err) {
    return handleError(res, err)
  }
}

export async function getChatByIdController(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await getChatById(chatId);
    return res.json(chat);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function updateChatController(req, res) {
  try {
    const { name, description, password, chatId } = req.body;
    const chat = await updateChat({
      name,
      description,
      password,
      chatId,
      ownerId: req.user.id
    });
    return res.json(chat);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function deleteChatController(req, res) {
  try {
    const { chatId } = req.params;
    await deleteChat(chatId, req.user.id);
    return res.sendStatus(204);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function joinChatController(req, res) {
  try {
    const { chatId } = req.params
    const { password } = req.body

    await joinChat(chatId, req.user.id, password)
    return res.sendStatus(200)
  } catch (err) {
    return handleError(res, err)
  }
}

export async function leaveChatController(req, res) {
  try {
    const { chatId } = req.params;
    await leaveChat(chatId, req.user.id);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(res, err);
  }
}
