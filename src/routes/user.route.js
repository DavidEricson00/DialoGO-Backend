import { Router } from "express";
import { createUserController, getMeController, loginController, updateUserController} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();

router.get("/me", authMiddleware, getMeController);

router.post("/create", createUserController);
router.post("/login", loginController);

router.put("/", authMiddleware, updateUserController);

export default router;
