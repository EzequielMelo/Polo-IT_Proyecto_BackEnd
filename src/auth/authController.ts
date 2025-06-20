import { RequestHandler } from "express";
import * as authService from "./authServices";

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body, req.file);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login exitoso", ...result });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
