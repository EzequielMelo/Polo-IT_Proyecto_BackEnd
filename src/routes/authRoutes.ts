import express from "express";
import { createUser, loginUser } from "../controllers/userController";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("avatar"), createUser);
router.post("/login", loginUser);

export default router;
