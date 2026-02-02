const express = require("express");
const http = require("http");
const cors = require("cors")
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(express.json())

app.use(
    cors({
        origin: "*"
    })
)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.get("/api/health", (req, res) => {
    res.json({ok: true, message: "Servidor rodando!"});
});

io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    socket.on("disconnect", () =>{
        console.log("Usuário desconectado: ", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
