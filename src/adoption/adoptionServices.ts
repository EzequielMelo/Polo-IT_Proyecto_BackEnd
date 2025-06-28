import { supabase } from "../supabaseClient";
import { CreateAdoptionRequest } from "./adoption.types";

export async function adoptionRequest(
  body: CreateAdoptionRequest,
  userId: string,
) {
  const { pet_id, notes } = body;

  // 🔍 1. Verificar que la mascota exista y esté publicada
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("status_id, user_id")
    .eq("id", pet_id)
    .single();

  if (petError || !pet) {
    throw new Error("Mascota no encontrada.");
  }

  if (pet.status_id !== 1) {
    throw new Error("Esta mascota no está disponible para adopción.");
  }

  const owner_user_id = pet.user_id;

  // ✅ 2. Crear la solicitud de adopción
  const { error: dbError } = await supabase.from("adoptions").insert({
    adopter_user_id: userId,
    pet_id,
    notes,
    owner_user_id, // 👈 Nuevo campo agregado
    status_id: 1, // Pendiente
  });

  if (dbError) {
    throw new Error(
      "Falló la creación del pedido de adopción: " + dbError.message,
    );
  }

  // 🔄 3. Marcar la mascota como "reservada" (status_id = 2)
  const { error: updateError } = await supabase
    .from("pets")
    .update({ status_id: 2 })
    .eq("id", pet_id);

  if (updateError) {
    throw new Error(
      "Falló el cambio de estado de la mascota: " + updateError.message,
    );
  }

  return {
    message: "Pedido de adopción exitosamente creado y mascota reservada",
    adoption: {
      adopter_user_id: userId,
      pet_id,
      notes,
      owner_user_id,
      status_id: 1,
    },
  };
}

export async function approveAdoptionRequest(
  adoptionId: string,
  userId: string,
) {
  // 1. Traer la solicitud de adopción
  const { data: adoption, error: adoptionError } = await supabase
    .from("adoptions")
    .select("id, pet_id, status_id")
    .eq("id", adoptionId)
    .single();

  if (adoptionError || !adoption) {
    throw new Error("No se encontró la solicitud de adopción.");
  }

  // 2. Traer datos de la mascota
  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("user_id, status_id")
    .eq("id", adoption.pet_id)
    .single();

  if (petError || !pet) {
    throw new Error("No se encontró la mascota relacionada.");
  }

  // 3. Verificar dueño de la mascota
  if (pet.user_id !== userId) {
    throw new Error("No tenés permiso para aprobar esta adopción.");
  }

  // 4. Verificar estados
  if (pet.status_id !== 2) {
    throw new Error("La mascota no está reservada.");
  }

  if (adoption.status_id !== 1) {
    throw new Error("La solicitud de adopción no está pendiente.");
  }

  // 5. Actualizar ambas tablas
  const [{ error: petUpdateError }, { error: adoptionUpdateError }] =
    await Promise.all([
      supabase.from("pets").update({ status_id: 3 }).eq("id", adoption.pet_id),
      supabase.from("adoptions").update({ status_id: 2 }).eq("id", adoption.id),
    ]);

  if (petUpdateError || adoptionUpdateError) {
    throw new Error(
      "Error al aprobar la adopción: " +
        (petUpdateError?.message || adoptionUpdateError?.message),
    );
  }

  return { message: "Adopción aprobada correctamente." };
}

export async function getMyAdoptions(userId: string) {
  const { data: adoptions, error } = await supabase
    .from("adoptions")
    .select("id, pet_id, adoption_date, status_id, notes")
    .eq("adopter_user_id", userId);

  if (error) throw new Error("Error al obtener adopciones: " + error.message);

  if (!adoptions || adoptions.length === 0) {
    return [];
  }

  const petIds = adoptions.map((a) => a.pet_id);

  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select(
      `
      id,
      name,
      photo_url,
      breed,
      age,
      specie:pet_specie(name),
      status:pet_status(name)
    `,
    )
    .in("id", petIds);

  if (petsError)
    throw new Error("Error al obtener mascotas: " + petsError.message);

  const result = adoptions.map((adoption) => {
    const pet = pets.find((p) => p.id === adoption.pet_id);

    return {
      ...adoption,
      pet: pet
        ? {
            ...pet,
            specie: (pet.specie as unknown as { name: string })?.name ?? null,
            status: (pet.status as unknown as { name: string })?.name ?? null,
          }
        : null,
    };
  });

  return result;
}

export async function getAdoptionPreviewsOfMyPets(userId: string) {
  const { data, error } = await supabase
    .from("adoptions")
    .select(
      `
      id,
      notes,
      pet_id,
      status_id,
      status:adoption_status(name),
      adopter:adopter_user_id (
        name,
        last_name
      ),
      pet:pet_id (
        name
      )
    `,
    )
    .eq("owner_user_id", userId);

  if (error) {
    throw new Error("Error al obtener las adopciones: " + error.message);
  }

  return data.map((adoption) => ({
    id: adoption.id,
    notes: adoption.notes,
    pet_id: adoption.pet_id,
    pet_name: (adoption.pet as unknown as { name: string })?.name ?? null,
    adopter_name:
      (adoption.adopter as unknown as { name: string })?.name ?? null,
    adopter_last_name:
      (adoption.adopter as unknown as { last_name: string })?.last_name ?? null,
    status: (adoption.status as unknown as { name: string })?.name ?? null,
  }));
}

export async function getAdoptionDetailById(adoptionId: string) {
  console.log("adoptionId:", adoptionId);
  const { data, error } = await supabase
    .from("adoptions")
    .select(
      `
      id,
      notes,
      adoption_date,
      created_at,
      status_id,
      status:adoption_status ( id, name ),
      adopter:adopter_user_id (
        user_id,
        name,
        last_name,
        location,
        photo_url,
        phone_number
      ),
      pet:pet_id (
        id,
        name,
        age,
        breed,
        description,
        photo_url,
        gender:pet_gender(name),
        size:pet_size(name),
        specie:pet_specie(name),
        status:pet_status(name)
      )
    `,
    )
    .eq("id", adoptionId)
    .single();

  if (error || !data) {
    console.log("🔍 Resultado Supabase:", { data, error });
    throw new Error("No se pudo obtener la solicitud de adopción.");
  }

  type PetType = {
    id: string;
    name: string;
    age: number;
    breed: string;
    description: string;
    photo_url: string;
    gender?: { name: string };
    size?: { name: string };
    specie?: { name: string };
    status?: { name: string };
  };

  type AdopterType = {
    user_id: string;
    name: string;
    last_name: string;
    location: string;
    photo_url: string;
    phone_number: string;
  };

  const pet = data.pet as unknown as PetType | null;
  const adopter = data.adopter as unknown as AdopterType | null;

  return {
    id: data.id,
    notes: data.notes,
    adoption_date: data.adoption_date,
    created_at: data.created_at,
    status_id: data.status_id,
    status: (data.status as unknown as { name: string })?.name ?? null,

    pet: pet
      ? {
          id: pet.id ?? null,
          name: pet.name,
          age: pet.age,
          breed: pet.breed,
          description: pet.description,
          photo_url: pet.photo_url,
          gender: pet.gender?.name ?? null,
          size: pet.size?.name ?? null,
          specie: pet.specie?.name ?? null,
          status: pet.status?.name ?? null,
        }
      : null,

    adopter: adopter
      ? {
          user_id: adopter.user_id ?? null,
          name: adopter.name,
          last_name: adopter.last_name,
          location: adopter.location,
          photo_url: adopter.photo_url,
          phone_number: adopter.phone_number,
        }
      : null,
  };
}
