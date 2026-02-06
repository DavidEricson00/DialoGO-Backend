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
} from "../repository/chat.repository";

export async function createChat({name, description=null, password=null, ownerId}) {
    if(!name) {
        throw new Error("Dados inválidos");
    }

    const chat =  await createChatRepo({
        name,
        description,
        password,
        ownerId
    })

    await joinChatRepo(ownerId, chat.id);

    return {
        name: chat.name,
        description: chat.description,
        created_at: chat.created_at,
        ownerId: chat.ownerId
    }
}

export async function getChats() {
    const chats = await getChatsRepo()

    if(!chats) throw new Error("Chat não encontrados");

    return chats.map(chat => ({
        name: chat.name,
        description: chat.description,
        created_at: chat.created_at
    }))
}

export async function getChatById(id) {
    if (!id) {
        throw new Error("Id inválido")
    }

    const chat = await getChatByIdRepo(id)

    if(!chat) throw new Error("Chat não encontrados");

    return {
        name: chat.name,
        description: chat.description,
        created_at: chat.created_at
    }
}

export async function updateChat({name=null, description=null, password=null, chatId, ownerId}) {
    if(!chatId || !ownerId) {
        throw new Error("Id inválido");
    }

    const isOwner = await userIsChatOwner(ownerId,chatId);

    if (!isOwner) {
        const err = new Error("Usuário não é o dono do chat");
        err.statusCode = 403;
        throw err;
    }

    const chatUpdated =  await updateChatRepo({
        name,
        description,
        password,
        chatId
    })

    return {
        name: chatUpdated.name,
        description: chatUpdated.description,
        created_at: chatUpdated.created_at
    }
}

export async function deleteChat(chatId, ownerId) {
    if(!chatId || !ownerId) {
        throw new Error("Id inválido");
    }

    const isOwner = await userIsChatOwner(ownerId,chatId);

    if (!isOwner) {
        const err = new Error("Usuário não é o dono do chat");
        err.statusCode = 403;
        throw err;
    }
    
    await deleteChatRepo(chatId)
}

export async function joinChat(chatId, userId) {
    if(!chatId || !userId) {
        throw new Error("Id inválido");
    }

    const isMember = await userBelongsToChat(userId,chatId);

    if (isMember) {
        const err = new Error("Usuário já participa do chat");
        err.statusCode = 403;
        throw err;
    }

    await joinChatRepo(userId, chatId)
}


export async function leaveChat(chatId, userId) {
    if(!chatId || !userId) {
        throw new Error("Id inválido");
    }

    const isMember = await userBelongsToChat(userId,chatId);

    if (!isMember) {
        const err = new Error("Usuário não participa do chat");
        err.statusCode = 403;
        throw err;
    }

    const isOwner = await userIsChatOwner(userId,chatId);

    if (isOwner) {
        const err = new Error("Usuário é o dono do chat");
        err.statusCode = 403;
        throw err;
    }

    await leaveChatRepo(userId, chatId)
}