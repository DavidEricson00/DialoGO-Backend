import { getChatMessages, sendMessage } from "../services/messages.service.js";

export async function getChatMessagesController(req, res) {
    try {
        const { chatId } = req.params;
        const chatMessages = await getChatMessages(chatId);
        return res.json(chatMessages);
    } catch(err) {
        console.error(err);
        return res.status(404).json({message: "Erro ao buscar mensagens"});
    }
}
