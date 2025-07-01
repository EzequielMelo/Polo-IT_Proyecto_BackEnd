import express from "express";
import multer from "multer";
import {
  createPetPost,
  deletePetPost,
  getLatestPostsController,
  getPetPost,
  getPetPosts,
  getUserPostsController,
} from "./postController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", authenticateUser, upload.single("photo"), createPetPost);
router.delete("/delete/:id", authenticateUser, deletePetPost);
router.get("/get-post/:id", getPetPost);
router.get("/get-posts", getPetPosts);
router.get("/get-latest-posts", getLatestPostsController);
router.get("/get-user-posts", authenticateUser, getUserPostsController);

export default router;
