import { supabase } from "../supabaseClient";
import { UserProfile } from "./user.types";

export async function getUserProfile(id: string) {
  const { data: profile, error } = await supabase
    .from("users")
    .select("name, last_name, photo_url, age, gender(name), location")
    .eq("user_id", id)
    .single<UserProfile>();

  if (error || !profile) {
    throw new Error("Perfil no encontrado");
  }

  return profile;
}
