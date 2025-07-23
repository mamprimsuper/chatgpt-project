export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
          description: string | null
          speciality: string | null
          system_prompt: string
          greeting: string | null
          suggestions: Json | null
          color: string
          icon_name: string
          active: boolean
          premium_tier: number
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          speciality?: string | null
          system_prompt: string
          greeting?: string | null
          suggestions?: Json | null
          color?: string
          icon_name?: string
          active?: boolean
          premium_tier?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          speciality?: string | null
          system_prompt?: string
          greeting?: string | null
          suggestions?: Json | null
          color?: string
          icon_name?: string
          active?: boolean
          premium_tier?: number
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          agent_id: string | null
          title: string | null
          user_session: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          title?: string | null
          user_session?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string | null
          title?: string | null
          user_session?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string | null
          content: string
          role: string
          artifacts: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id?: string | null
          content: string
          role: string
          artifacts?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string | null
          content?: string
          role?: string
          artifacts?: Json | null
          created_at?: string
        }
      }
    }
  }
}

// Tipos específicos para o projeto
export type DbAgent = Database['public']['Tables']['agents']['Row'];
export type DbChat = Database['public']['Tables']['chats']['Row'];
export type DbMessage = Database['public']['Tables']['messages']['Row'];
