import { Router } from "express";
import userRouter from "./user.route.js";
import messageRouter from "./message.route.js"
import chatRouter from "./chat.route.js"


const router = Router();

router.use("/user", userRouter);
router.use("/message", messageRouter);
router.use("/chat", chatRouter);

export default router;