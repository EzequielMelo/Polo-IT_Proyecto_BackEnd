import { Tables } from "../types/supabase";

// Usamos el tipo que representa la fila de "gender"
export type Gender = Tables<"gender">;

// Tipo base de la tabla "users"
export type UserBase = Tables<"users">;

// Tipo para el perfil con la relación "gender" embebida
export type UserProfile = Omit<UserBase, "gender_id"> & {
  gender: Gender | null;
};
