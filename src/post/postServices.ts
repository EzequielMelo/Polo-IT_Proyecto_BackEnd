import { CreatePost } from "./post.types";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabaseClient";
import { PetDetails } from "./post.types";

export async function postPet(
  body: CreatePost,
  userId: string,
  file?: Express.Multer.File,
) {
  const { age, breed, description, gender_id, name, size_id, specie_id } = body;

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
    status_id: 1,
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
      status_id: 1,
      photo_url: petImageUrl,
    },
  };
}

export async function deletePost(petId: string, userId: string) {
  // 1. Buscar el post para obtener el path de la imagen
  const { data: pet, error } = await supabase
    .from("pets")
    .select("photo_url, user_id")
    .eq("id", petId)
    .single();

  const { data } = await supabase
    .from("pets")
    .select("*")
    .eq("id", petId)
    .eq("user_id", userId);

  console.log("Mascota encontrada:", data);
  if (error || !pet || pet.user_id !== userId) {
    return {
      success: false,
      message: "No se encontró la mascota o no tienes permiso.",
    };
  }

  // 2. Si hay una imagen, eliminarla del storage
  if (pet.photo_url) {
    const imagePath = extractStoragePath(pet.photo_url);
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("pet-images")
        .remove([imagePath]);

      if (storageError) {
        console.warn(
          "No se pudo eliminar la imagen del storage:",
          storageError.message,
        );
      }
    }
  }

  // 3. Eliminar el post
  const { error: deleteError } = await supabase
    .from("pets")
    .delete()
    .match({ id: petId, user_id: userId });

  if (deleteError) {
    throw new Error("No se pudo eliminar el post: " + deleteError.message);
  }

  return { message: "Post y foto eliminados correctamente." };
}

export async function getPost(petId: string) {
  const { data: petInfo, error } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      age,
      breed,
      description,
      photo_url,
      created_at,
      gender:pet_gender(name),
      size:pet_size(name),
      specie:pet_specie(name),
s     tatus:pet_status(name),
      user:users (
        user_id,
        name,
        last_name,
        location
      )
    `,
    )
    .eq("id", petId)
    .single<PetDetails>();

  if (error || !petInfo) {
    throw new Error(
      "Post no encontrado o error al obtenerlo: " + error.message,
    );
  }

  return {
    ...petInfo,
    gender: petInfo.gender?.name ?? null,
    size: petInfo.size?.name ?? null,
    specie: petInfo.specie?.name ?? null,
    status: petInfo.status?.name ?? null,
  };
}

export async function getPosts() {
  const { data: petsInfo, error } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      age,
      breed,
      description,
      photo_url,
      created_at,
      gender:pet_gender(name),
      size:pet_size(name),
      specie:pet_specie(name),
      status:pet_status(name),
      user:users (
        user_id,
        name,
        last_name,
        photo_url,
        location
      )
    `,
    )
    .neq("status_id", 3) // Excluir mascotas adoptadas
    .order("created_at", { ascending: false });

  if (error || !petsInfo) {
    throw new Error("Error al obtener los posts: " + error.message);
  }

  // Mapear para simplificar el formato
  return petsInfo.map((pet) => ({
    ...pet,
    gender: (pet.gender as unknown as { name: string })?.name ?? null,
    size: (pet.size as unknown as { name: string })?.name ?? null,
    specie: (pet.specie as unknown as { name: string })?.name ?? null,
    status: (pet.status as unknown as { name: string })?.name ?? null,
  }));
}

export async function getUserPosts(userId: string) {
  const { data: petsInfo, error } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      age,
      breed,
      description,
      photo_url,
      created_at,
      gender:pet_gender(name),
      size:pet_size(name),
      specie:pet_specie(name),
      status:pet_status(name)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !petsInfo) {
    throw new Error("Error al obtener los posts del usuario: " + error.message);
  }

  return petsInfo.map((pet) => ({
    ...pet,
    gender: (pet.gender as unknown as { name: string })?.name ?? null,
    size: (pet.size as unknown as { name: string })?.name ?? null,
    specie: (pet.specie as unknown as { name: string })?.name ?? null,
    status: (pet.status as unknown as { name: string })?.name ?? null,
  }));
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

function extractStoragePath(url: string): string | null {
  const basePath = "/object/public/pet-images/";
  const index = url.indexOf(basePath);
  if (index === -1) return null;
  return url.slice(index + basePath.length);
}
