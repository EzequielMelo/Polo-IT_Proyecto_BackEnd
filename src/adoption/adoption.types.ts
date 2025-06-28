import { TablesInsert } from "../types/supabase";

export type CreateAdoptionRequest = Required<
  Omit<TablesInsert<"adoptions">, "id" | "adoption_date">
>;
