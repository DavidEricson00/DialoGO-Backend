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

router.post("/", authMiddleware, createChatController);
router.get("/", authMiddleware, getChatsController);
router.get("/:chatId", authMiddleware, getChatByIdController);
router.patch("/", authMiddleware, updateChatController);
router.delete("/:chatId", authMiddleware, deleteChatController);
router.post("/join/:chatId", authMiddleware, joinChatController);
router.delete("/leave/:chatId", authMiddleware, leaveChatController);

export default router;
