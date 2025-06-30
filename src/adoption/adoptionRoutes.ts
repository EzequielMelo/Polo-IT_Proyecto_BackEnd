import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import {
  createAdoptionRequest,
  approveAdoption,
  denyAdoption,
  getUserAdoptionsController,
  getAdoptionPreviews,
  getAdoptionDetail,
  checkIfUserRequestedAdoption,
} from "./adoptionController";

const router = express.Router();

router.post("/request", authenticateUser, createAdoptionRequest);
router.patch("/approve/:id", authenticateUser, approveAdoption);
router.patch("/deny/:id", authenticateUser, denyAdoption);
router.get("/user-adoptions", authenticateUser, getUserAdoptionsController);
router.get("/previews", authenticateUser, getAdoptionPreviews);
router.get("/detail/:id", authenticateUser, getAdoptionDetail);
router.get("/check", authenticateUser, checkIfUserRequestedAdoption);

export default router;
