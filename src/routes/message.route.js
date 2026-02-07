import { Router } from "express";
import { 
    getChatMessagesController, 
    sendMessageController 
} from "../controllers/message.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/chat/:chatId", authMiddleware, getChatMessagesController);

router.post("/", authMiddleware, sendMessageController);

export default router