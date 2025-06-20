import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { getCurrentUser } from "./userController";

const router = express.Router();

router.get("/me", authenticateUser, getCurrentUser);

export default router;
