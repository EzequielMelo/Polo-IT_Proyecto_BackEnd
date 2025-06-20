import { TablesInsert } from "../types/supabase";
import { Tables } from "../types/supabase";

export type CreatePost = Required<
  Omit<TablesInsert<"pets">, "id" | "user_id" | "created_at" | "photo_url">
>;

export type Gender = Tables<"pet_gender">;
export type Size = Tables<"pet_size">;
export type Specie = Tables<"pet_specie">;
export type Status = Tables<"pet_status">;
export type PetsBase = Tables<"pets">;

export type PetDetails = Omit<
  PetsBase,
  "gender_id" | "size_id" | "specie_id" | "status_id"
> & {
  gender: Gender | null;
  size: Size | null;
  specie: Specie | null;
  status: Status | null;
  user: {
    user_id: string;
    name: string | null;
    last_name: string | null;
    location: string | null;
  };
};
