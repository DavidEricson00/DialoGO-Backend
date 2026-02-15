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

export async function sendMessageController(req, res) {
    try {
        const { content, chatId } = req.body;

        const message = await sendMessage({ 
            content, 
            chatId, 
            userId: req.user.id 
        });

        return res.status(201).json(message);
    } catch (err){
        const status = err.statusCode || 500;
        return res.status(status).json({ message: err.message });
    }
}