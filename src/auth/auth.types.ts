import { TablesInsert } from "../types/supabase";

export type CreateUserBody = Required<
  Omit<TablesInsert<"users">, "id" | "user_id" | "created_at" | "photo_url">
> & {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    last_name: string;
    photo_url: string;
    phone_number: string;
  };
};
