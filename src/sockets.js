function setupSockets(io) {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
}

export default setupSockets;
