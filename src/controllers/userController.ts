import { supabase } from "../supabaseClient";
import { supabaseAdmin } from "../supabaseAdmin";
import { RequestHandler } from "express";
import { translateSupabaseError } from "../utils/supabaseErrorTranslator";

interface CreateUserBody {
  email: string;
  password: string;
  name: string;
  last_name: string;
  age: number;
  gender: string;
  location: string;
}

export const createUser: RequestHandler<
  unknown,
  unknown,
  CreateUserBody
> = async (req, res, next) => {
  try {
    const { email, password, name, last_name, age, gender, location } =
      req.body;

    const file = req.file;

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son requeridos." });
      return next();
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      const translatedError = translateSupabaseError(
        authError?.message || "Error al registrar",
      );
      res.status(400).json({ error: translatedError });
      return next();
    }

    const userId = authData.user.id;
    let avatarUrl: string | null = null;

    if (file) {
      const fileExt = file.originalname.split(".").pop(); // ej: "jpg"
      const fileName = `avatar.${fileExt}`; // ej: "avatar.jpg"
      const filePath = `${userId}/${fileName}`; // ej: "abc123/avatar.jpg"

      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true, // reemplaza si ya existe
        });

      if (uploadError) {
        res.status(500).json({
          error: "Error al subir la imagen",
          details: uploadError.message,
        });
        return next();
      }

      // Obtener la URL pública (si el bucket es público)
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrlData.publicUrl;
    }

    const { error: dbError } = await supabaseAdmin.from("users").insert({
      user_id: userId,
      name,
      last_name,
      age: parseInt(age.toString(), 10),
      gender,
      location,
      photo_url: avatarUrl,
    });

    if (dbError) {
      res.status(500).json({
        error: "Usuario creado en Auth, pero falló al crear el perfil.",
        details: dbError.message,
      });
      return next();
    }

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      user: authData.user,
      avatar: avatarUrl,
    });
    return next();
  } catch (err) {
    next(err);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      const translatedError = translateSupabaseError(
        error?.message || "Error al iniciar sesión",
      );
      res.status(400).json({ error: translatedError });
      return;
    }

    // Obtener el perfil desde la tabla `users`
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (profileError) {
      res.status(500).json({
        error: "Error al obtener el perfil del usuario.",
        details: profileError.message,
      });
      return;
    }

    res.status(200).json({
      message: "Login exitoso",
      token: data.session.access_token,
      refreshToken: data.session.refresh_token, // si querés usarlo más adelante
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        last_name: profile.last_name,
        avatar: profile.photo_url,
        // otros campos relevantes que uses en la UI
      },
    });
  } catch (err) {
    next(err);
  }
};
