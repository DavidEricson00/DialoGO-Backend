import { sendMessage } from "./services/messages.service.js";

function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    socket.on("joinRoom", ({chatId}) => {
      const roomName = `chat:${chatId}`;
      socket.join(roomName)
      console.log(`Socket ${socket.id} entrou na sala ${roomName}`)
    })


    socket.on("leaveRoom", ({chatId}) => {
      const roomName = `chat:${chatId}`;
      socket.leave(roomName);
      console.log(`Socket ${socket.id} saiu da sala ${roomName}`)
    })


    socket.on("sendMessage", async ({content, chatId, userId}) => {
      try {
        const message = await sendMessage({
          content,
          chatId,
          userId
        });

        const roomName = `chat:${chatId}`;

        io.to(roomName).emit("newMessage", message);
      
      } catch (error) {
        console.error(error);
        socket.emit("errorMessage", {message: error.message})
      }
    });

    
    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
}

export default setupSockets;
