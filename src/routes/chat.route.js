import { Router } from "express";
import { 
    createChatController,
    getChatsController,
    getChatByIdController,
    updateChatController,
    deleteChatController,
    joinChatController,
    leaveChatController
 } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:chatId", authMiddleware, getChatByIdController);
router.get("/", authMiddleware, getChatsController);

router.post("/join/:chatId", authMiddleware, joinChatController);
router.post("/", authMiddleware, createChatController);

router.patch("/", authMiddleware, updateChatController);

router.delete("/leave/:chatId", authMiddleware, leaveChatController);
router.delete("/:chatId", authMiddleware, deleteChatController);

export default router;
