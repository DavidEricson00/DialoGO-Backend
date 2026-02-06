import { createChat, deleteChat, getChatById, getChats, joinChat, leaveChat, updateChat } from "../services/chat.service";

export async function createChatController(req, res) {
    try {
        const { name, description, password } = req.body;

        const chat = await createChat({
            name, 
            description, 
            password, 
            ownerId: req.user.id
        })

        return res.status(201).json(chat)
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Erro ao criar chat"})
    }
}

export async function getChatsController(req, res) {
    try {
        const chats = await getChats();

        return res.json(chats);

    } catch(err){
        console.error(err);
        return res.status(404).json({message: "Erro ao buscar chats"})
    }
}

export async function getChatByIdController(req, res) {
    try {
        const { chatId } = req.params

        const chat = await getChatById(chatId)

        return res.json(chat)
    } catch(err){
        console.error(err)
        return res.status(404).json({message: "Erro ao buscar chat"})
    }
}

export async function updateChatController(req, res) {
    try {
        const { name, description, password, chatId } = req.body

        const chat = await updateChat({
            name, 
            description, 
            password, 
            chatId, 
            ownerId: req.user.id})

        return res.json(chat)
    } catch(err){
        console.error(err)
        return res.status(500).json({message: "Erro ao atualizar o chat"})
    }
}

export async function deleteChatController(req, res) {
    try {
        const { chatId } = req.body;

        await deleteChat(chatId, req.user.id);

        return res.sendStatus(204)

    } catch(err){
        console.error(err)
        return res.status(500).json("Erro ao deletar chat")
    }
}

export async function joinChatController(req, res) {
    try {
        const { chatId } = req.params

        await joinChat(chatId, req.user.id)
        return res.sendStatus(200)
    } catch(err){
        console.error(err)
        return res.status(500).json({message: "Não foi possível entrar no chat"})
    }
}

export async function leaveChatController(req, res) {
    try {
        const { chatId } = req.params

        await leaveChat(chatId, req.user.id)
        return res.sendStatus(200)

    } catch(err){
        console.error(err)
        return res.status(500).json({message: "Não foi possível sair do chat"})
    }
}