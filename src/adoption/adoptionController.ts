import { RequestHandler } from "express";
import {
  adoptionRequest,
  approveAdoptionRequest,
  denyAdoptionRequest,
  getMyAdoptions,
  getAdoptionPreviewsOfMyPets,
  getAdoptionDetailById,
  checkAdoptionRequestExists,
} from "./adoptionServices";

export const createAdoptionRequest: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    const { pet_id, notes } = req.body;

    if (!pet_id || typeof pet_id !== "string") {
      res.status(400).json({ error: "El ID de la mascota es requerido." });
      return;
    }

    const result = await adoptionRequest(
      { pet_id, notes, adopter_user_id: userId, status_id: 1 },
      userId,
    );

    res.status(201).json(result);
  } catch (err) {
    next(err); // Dejá que tu middleware de manejo de errores lo capture
  }
};

export const approveAdoption: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const { id: adoptionId } = req.params;
    const userId = res.locals.user.id; // Esto asume que tu middleware de autenticación ya puso el user en `res.locals`

    console.log("userId:", userId);
    console.log("adoptionId:", adoptionId);

    if (!adoptionId || typeof adoptionId !== "string") {
      res.status(400).json({ error: "ID de adopción inválido." });
      return;
    }

    const result = await approveAdoptionRequest(adoptionId, userId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const denyAdoption: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const { id: adoptionId } = req.params;
    const userId = res.locals.user.id; // Esto asume que tu middleware de autenticación ya puso el user en `res.locals`

    if (!adoptionId || typeof adoptionId !== "string") {
      res.status(400).json({ error: "ID de adopción inválido." });
      return;
    }

    const result = await denyAdoptionRequest(adoptionId, userId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserAdoptionsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = res.locals.user?.id;

    if (!userId || typeof userId !== "string") {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    const adoptions = await getMyAdoptions(userId);
    res.status(200).json(adoptions);
  } catch (error) {
    next(error);
  }
};

export const getAdoptionPreviews: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const userId = res.locals.user?.id;

    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const previews = await getAdoptionPreviewsOfMyPets(userId);

    res.status(200).json(previews);
  } catch (error) {
    next(error);
  }
};

export const getAdoptionDetail: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "ID de adopción inválido." });
      return;
    }

    const adoption = await getAdoptionDetailById(id);

    res.status(200).json(adoption);
  } catch (error) {
    next(error);
  }
};

export const checkIfUserRequestedAdoption: RequestHandler = async (
  req,
  res,
  next,
): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    const { pet_id } = req.query;

    if (!userId || typeof pet_id !== "string") {
      res.status(400).json({ error: "Faltan parámetros" });
      return;
    }
    const exists = await checkAdoptionRequestExists(pet_id, userId);

    res.status(200).json(exists);
  } catch (error) {
    next(error);
  }
};
