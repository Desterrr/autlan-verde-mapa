export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          autor: string
          categoria: string
          contenido: string
          created_at: string | null
          fecha_publicacion: string | null
          id: string
          imagen: string | null
          published: boolean | null
          resumen: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autor: string
          categoria: string
          contenido: string
          created_at?: string | null
          fecha_publicacion?: string | null
          id?: string
          imagen?: string | null
          published?: boolean | null
          resumen: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autor?: string
          categoria?: string
          contenido?: string
          created_at?: string | null
          fecha_publicacion?: string | null
          id?: string
          imagen?: string | null
          published?: boolean | null
          resumen?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      asignaciones: {
        Row: {
          camion_id: string
          chofer_id: string
          created_at: string
          dias_asignados: string[]
          estado: string
          fecha_fin: string | null
          fecha_inicio: string
          horario_fin: string
          horario_inicio: string
          id: string
          observaciones: string | null
          ruta_id: string
          updated_at: string
        }
        Insert: {
          camion_id: string
          chofer_id: string
          created_at?: string
          dias_asignados?: string[]
          estado?: string
          fecha_fin?: string | null
          fecha_inicio: string
          horario_fin: string
          horario_inicio: string
          id?: string
          observaciones?: string | null
          ruta_id: string
          updated_at?: string
        }
        Update: {
          camion_id?: string
          chofer_id?: string
          created_at?: string
          dias_asignados?: string[]
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          horario_fin?: string
          horario_inicio?: string
          id?: string
          observaciones?: string | null
          ruta_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asignaciones_camion_id_fkey"
            columns: ["camion_id"]
            isOneToOne: false
            referencedRelation: "camiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_chofer_id_fkey"
            columns: ["chofer_id"]
            isOneToOne: false
            referencedRelation: "choferes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asignaciones_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      camiones: {
        Row: {
          año: number | null
          capacidad: string | null
          created_at: string
          estado: string
          id: string
          modelo: string
          placa: string
          updated_at: string
        }
        Insert: {
          año?: number | null
          capacidad?: string | null
          created_at?: string
          estado?: string
          id?: string
          modelo: string
          placa: string
          updated_at?: string
        }
        Update: {
          año?: number | null
          capacidad?: string | null
          created_at?: string
          estado?: string
          id?: string
          modelo?: string
          placa?: string
          updated_at?: string
        }
        Relationships: []
      }
      choferes: {
        Row: {
          apellido: string
          cedula: string
          created_at: string
          estado: string
          fecha_vencimiento_licencia: string | null
          id: string
          licencia: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          apellido: string
          cedula: string
          created_at?: string
          estado?: string
          fecha_vencimiento_licencia?: string | null
          id?: string
          licencia: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          apellido?: string
          cedula?: string
          created_at?: string
          estado?: string
          fecha_vencimiento_licencia?: string | null
          id?: string
          licencia?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      colonias: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          colonia: string
          created_at: string | null
          descripcion: string | null
          dias: string[]
          horario: string
          id: string
          puntos_especificos: Json | null
          ruta: Json
          tipo: Database["public"]["Enums"]["waste_type"]
          updated_at: string | null
        }
        Insert: {
          colonia: string
          created_at?: string | null
          descripcion?: string | null
          dias: string[]
          horario: string
          id?: string
          puntos_especificos?: Json | null
          ruta: Json
          tipo: Database["public"]["Enums"]["waste_type"]
          updated_at?: string | null
        }
        Update: {
          colonia?: string
          created_at?: string | null
          descripcion?: string | null
          dias?: string[]
          horario?: string
          id?: string
          puntos_especificos?: Json | null
          ruta?: Json
          tipo?: Database["public"]["Enums"]["waste_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      waste_type: "organico" | "inorganico" | "mixto"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      waste_type: ["organico", "inorganico", "mixto"],
    },
  },
} as const
