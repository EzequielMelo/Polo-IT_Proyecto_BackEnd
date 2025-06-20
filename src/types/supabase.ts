export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      gender: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      pet_gender: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      pet_size: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      pet_specie: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      pet_status: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          age: number | null;
          breed: string | null;
          created_at: string | null;
          description: string | null;
          gender_id: number | null;
          id: string;
          name: string | null;
          photo_url: string | null;
          size_id: number | null;
          specie_id: number | null;
          status_id: number | null;
          user_id: string;
        };
        Insert: {
          age?: number | null;
          breed?: string | null;
          created_at?: string | null;
          description?: string | null;
          gender_id?: number | null;
          id?: string;
          name?: string | null;
          photo_url?: string | null;
          size_id?: number | null;
          specie_id?: number | null;
          status_id?: number | null;
          user_id?: string;
        };
        Update: {
          age?: number | null;
          breed?: string | null;
          created_at?: string | null;
          description?: string | null;
          gender_id?: number | null;
          id?: string;
          name?: string | null;
          photo_url?: string | null;
          size_id?: number | null;
          specie_id?: number | null;
          status_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pets_gender_id_fkey";
            columns: ["gender_id"];
            isOneToOne: false;
            referencedRelation: "pet_gender";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pets_size_id_fkey";
            columns: ["size_id"];
            isOneToOne: false;
            referencedRelation: "pet_size";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pets_specie_id_fkey";
            columns: ["specie_id"];
            isOneToOne: false;
            referencedRelation: "pet_specie";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pets_status_id_fkey";
            columns: ["status_id"];
            isOneToOne: false;
            referencedRelation: "pet_status";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      users: {
        Row: {
          age: number | null;
          created_at: string;
          gender_id: number | null;
          id: string;
          last_name: string | null;
          location: string | null;
          name: string | null;
          phone_number: string | null;
          photo_url: string | null;
          user_id: string;
        };
        Insert: {
          age?: number | null;
          created_at?: string;
          gender_id?: number | null;
          id?: string;
          last_name?: string | null;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          photo_url?: string | null;
          user_id?: string;
        };
        Update: {
          age?: number | null;
          created_at?: string;
          gender_id?: number | null;
          id?: string;
          last_name?: string | null;
          location?: string | null;
          name?: string | null;
          phone_number?: string | null;
          photo_url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_gender_fkey";
            columns: ["gender_id"];
            isOneToOne: false;
            referencedRelation: "gender";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
