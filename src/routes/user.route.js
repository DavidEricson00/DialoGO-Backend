import { Router } from "express";
import { createUserController, getMeController, loginController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.post("/create", createUserController);
router.post("/login", loginController);
router.get("/me", authMiddleware, getMeController)

export default router;
