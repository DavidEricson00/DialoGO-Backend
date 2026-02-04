import { userBelongsToChat } from "../repository/chat.repository";
import { 
    getChatMessages as getChatMessagesRepo,
    sendMessage as sendMessageRepo
} from "../repository/message.repository";

export async function getChatMessages(id) {
    if(!id) {
        throw new Error("Id inválido")
    }

    const messages = await getChatMessagesRepo(id);

    if(!messages) throw new Error("Mensagens não encontradas");

    return messages.map(msg => ({
        content: msg.content,
        sent_at: msg.sent_at
    }));
}

export async function sendMessage(content, chatId, userId) {
    if(!content || !chatId || !userId) {
        throw new Error("Dados inválidos");
    }

    const isMember = await userBelongsToChat(userId,chatId);

    if (!isMember) {
        const err = new Error("Usuário não participa do chat");
        err.statusCode = 403;
        throw err;
    }

    const message = await sendMessageRepo({
        content,
        chatId,
        userId
    })

    return {
        content: message.content,
        sent_at: message.sent_at,
        chat_id: message.chat_id,
        user_id: message.user_id
    }
}