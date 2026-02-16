import { Router } from "express";
import { 
    getChatMessagesController 
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/chat/:chatId", authMiddleware, getChatMessagesController);

export default router