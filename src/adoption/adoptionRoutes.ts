import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  createAdoptionRequest,
  approveAdoption,
  getUserAdoptionsController,
  getAdoptionPreviews,
  getAdoptionDetail,
} from "./adoptionController";

const router = express.Router();

router.post("/request", authenticateUser, createAdoptionRequest);
router.patch("/approve/:id", authenticateUser, approveAdoption);
router.get("/user-adoptions", authenticateUser, getUserAdoptionsController);
router.get("/previews", authenticateUser, getAdoptionPreviews);
router.get("/detail/:id", authenticateUser, getAdoptionDetail);

export default router;
