import { sendMessage } from "./services/messages.service.js";
import { JWT_SECRET } from "./config/env.js";
import jwt from "jsonwebtoken";

function setupSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token não informado"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      socket.user = {
        id: decoded.sub,
        username: decoded.username
      };

      next();
    } catch (err) {
      return next(new Error("Token inválido"));
    }
  });

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


    socket.on("sendMessage", async ({content, chatId}) => {
      try {
        const message = await sendMessage({
          content,
          chatId,
          userId: socket.user.id
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
