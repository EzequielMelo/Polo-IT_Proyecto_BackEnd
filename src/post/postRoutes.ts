import express from "express";
import multer from "multer";
import {
  createPetPost,
  deletePetPost,
  getPetPost,
  getPetPosts,
} from "./postController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", authenticateUser, upload.single("photo"), createPetPost);
router.delete("/delete/:id", authenticateUser, deletePetPost);
router.get("/get-post/:id", getPetPost);
router.get("/get-posts", getPetPosts);

export default router;
