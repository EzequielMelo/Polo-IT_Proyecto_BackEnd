import { CreatePost } from "./post.types";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabaseClient";

export async function postPet(
  body: CreatePost,
  userId: string,
  file?: Express.Multer.File,
) {
  const {
    age,
    breed,
    description,
    gender_id,
    name,
    size_id,
    specie_id,
    status_id,
  } = body;

  let petImageUrl: string | null = null;
  if (file) {
    petImageUrl = await uploadPetImage(userId, file);
  }

  const { error: dbError } = await supabase.from("pets").insert({
    user_id: userId,
    age,
    breed,
    description,
    gender_id,
    name,
    size_id,
    specie_id,
    status_id,
    photo_url: petImageUrl,
  });

  if (dbError) {
    throw new Error("falló la creacion del post" + dbError.message);
  }

  return {
    message: "Mascota publicada exitosamente",
    pet: {
      user_id: userId,
      age,
      breed,
      description,
      gender_id,
      name,
      size_id,
      specie_id,
      status_id,
      photo_url: petImageUrl,
    },
  };
}

async function uploadPetImage(
  userId: string,
  file: Express.Multer.File,
): Promise<string | null> {
  const fileExt = file.originalname.split(".").pop(); // ej: jpg
  const uniqueName = `${uuidv4()}.${fileExt}`; // nombre único
  const filePath = `${userId}/${uniqueName}`; // carpeta por usuario

  const { error: uploadError } = await supabase.storage
    .from("pet-images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // muy importante para no sobrescribir
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("pet-images").getPublicUrl(filePath);

  return data.publicUrl ?? null;
}
