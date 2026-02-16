import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { PORT } from "./config/env.js";
import setupSockets from "./sockets.js";
import { setIO } from "./socketInstance.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

setIO(io);

setupSockets(io);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
