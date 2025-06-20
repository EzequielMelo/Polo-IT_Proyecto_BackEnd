import express from "express";
import { registerUser, loginUser } from "./authController";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

export default router;
