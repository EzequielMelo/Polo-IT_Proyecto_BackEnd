import express from "express";
import { supabase } from "../supabaseClient";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", authenticateUser, async (req, res) => {
  const { id, email } = res.locals.user;

  // Buscar el perfil desde tu tabla personalizada
  const { data: profile, error } = await supabase
    .from("users")
    .select("name, last_name, photo_url, age, gender, location")
    .eq("user_id", id)
    .single();

  if (error) {
    res.status(404).json({ error: "Perfil no encontrado" });
    return;
  }

  res.status(200).json({
    id,
    email,
    name: profile.name,
    lastName: profile.last_name,
    avatar: profile.photo_url,
    age: profile.age,
    gender: profile.gender,
    location: profile.location,
  });
});

export default router;
