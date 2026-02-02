import { Router } from "express";
import { createUserController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/", createUserController);

export default router;
