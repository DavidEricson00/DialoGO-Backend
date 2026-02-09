import { Router } from "express";
import { 
    getChatMessagesController, 
    sendMessageController 
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/chat/:chatId", authMiddleware, getChatMessagesController);

router.post("/", authMiddleware, sendMessageController);

export default router