import { Router } from "express";
import { createUserController, getMeController, getUserByIdController, loginController, updateUserController} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getMeController);
router.get("/:id", authMiddleware, getUserByIdController);

router.post("/create", createUserController);
router.post("/login", loginController);

router.patch("/", authMiddleware, updateUserController);

export default router;
