export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          segment: string;
          brand_voice: string;
          target_audience: string;
          platforms: string[];
          preferred_formats: string[];
          notes: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          segment: string;
          brand_voice?: string;
          target_audience?: string;
          platforms?: string[];
          preferred_formats?: string[];
          notes?: string;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
      };
      briefs: {
        Row: {
          id: string;
          client_id: string | null;
          raw_briefing: string;
          decoded_result: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          raw_briefing: string;
          decoded_result: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["briefs"]["Insert"]>;
      };
      copy_history: {
        Row: {
          id: string;
          client_id: string | null;
          module: string;
          prompt: string;
          result: Record<string, unknown>;
          copy_type: string | null;
          tone: string | null;
          platform: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          module?: string;
          prompt: string;
          result: Record<string, unknown>;
          copy_type?: string | null;
          tone?: string | null;
          platform: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["copy_history"]["Insert"]>;
      };
      activities: {
        Row: {
          id: string;
          type: string;
          title: string;
          client_id: string | null;
          module: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          client_id?: string | null;
          module: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>;
      };
      calendar_entries: {
        Row: {
          id: string;
          client_id: string | null;
          title: string;
          platform: string;
          format: string;
          scheduled_date: string;
          status: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          title: string;
          platform: string;
          format?: string;
          scheduled_date: string;
          status?: string;
          notes?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_entries"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
