import express from "express";
import multer from "multer";
import { createPetPost } from "./postController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", authenticateUser, upload.single("photo"), createPetPost);

export default router;
