import { TablesInsert } from "../types/supabase";

export type CreatePost = Required<
  Omit<TablesInsert<"pets">, "id" | "user_id" | "created_at" | "photo_url">
>;
