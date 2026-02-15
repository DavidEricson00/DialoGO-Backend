import { Router } from "express";
import { 
    createChatController,
    getUserChatsController,
    getAvailableChatsController,
    getChatByIdController,
    updateChatController,
    deleteChatController,
    joinChatController,
    leaveChatController,
    getUsersFromChatController
 } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getUserChatsController);
router.get("/:chatId/users", authMiddleware, getUsersFromChatController);
router.get("/:chatId", authMiddleware, getChatByIdController);
router.get("/", authMiddleware, getAvailableChatsController);

router.post("/join/:chatId", authMiddleware, joinChatController);
router.post("/", authMiddleware, createChatController);

router.patch("/", authMiddleware, updateChatController);

router.delete("/leave/:chatId", authMiddleware, leaveChatController);
router.delete("/:chatId", authMiddleware, deleteChatController);

export default router;
