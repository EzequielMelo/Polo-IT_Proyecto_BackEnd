import { RequestHandler } from "express";
import { postPet } from "./postServices";

export const createPetPost: RequestHandler = async (req, res, next) => {
  try {
    const userId = res.locals.user.id; // ← del middleware
    const result = await postPet(req.body, userId, req.file);
    res.status(201).json({ message: "Mascota publicada exitosamente", result });
  } catch (error) {
    next(error);
  }
};
