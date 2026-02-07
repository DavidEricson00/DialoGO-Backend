import { Router } from "express";
import userRouter from "./user.route.js";
import messageRouter from "./message.route.js"
import chatRouter from "./chat.route.js"


const router = Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

export default router;