import { Router } from "express";
import { createUserController, loginController } from "../controllers/auth.controller.js";


const router = Router();

router.post("/create", createUserController);
router.post("/login", loginController);

export default router;
