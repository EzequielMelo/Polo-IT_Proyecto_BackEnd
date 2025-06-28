import { RequestHandler } from "express";
import { postPet, deletePost, getPost, getPosts } from "./postServices";
import { getUserPosts } from "./postServices";

export const createPetPost: RequestHandler = async (req, res, next) => {
  try {
    const userId = res.locals.user.id; // ← del middleware
    const result = await postPet(req.body, userId, req.file);
    res.status(201).json({ message: "Mascota publicada exitosamente", result });
  } catch (error) {
    next(error);
  }
};

export const deletePetPost: RequestHandler = async (req, res, next) => {
  try {
    const petId = req.params.id;
    const userId = res.locals.user.id;

    const result = await deletePost(petId, userId);

    if (!result.success) {
      res.status(403).json({ error: result.message });
      return;
    }

    res.status(200).json({ message: result.message });
  } catch (err) {
    next(err);
  }
};

export const getPetPost: RequestHandler = async (req, res, next) => {
  try {
    const petId = req.params.id;

    if (!petId || typeof petId !== "string") {
      res.status(400).json({ error: "ID inválido." });
      return;
    }

    const pet = await getPost(petId);
    res.status(200).json(pet);
  } catch (err) {
    next(err);
  }
};

export const getPetPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (err) {
    next(err); // Pasa el error al middleware de manejo de errores
  }
};

export const getUserPostsController: RequestHandler = async (
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

    const posts = await getUserPosts(userId);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
