export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accountant_assets: {
        Row: {
          category: string
          created_at: string
          depreciation_method: string
          disposal_amount: number | null
          disposal_date: string | null
          id: string
          is_disposed: boolean
          name: string
          notes: string | null
          purchase_date: string
          purchase_price: number
          residual_value: number
          useful_life_years: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          depreciation_method?: string
          disposal_amount?: number | null
          disposal_date?: string | null
          id?: string
          is_disposed?: boolean
          name: string
          notes?: string | null
          purchase_date: string
          purchase_price: number
          residual_value?: number
          useful_life_years: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          depreciation_method?: string
          disposal_amount?: number | null
          disposal_date?: string | null
          id?: string
          is_disposed?: boolean
          name?: string
          notes?: string | null
          purchase_date?: string
          purchase_price?: number
          residual_value?: number
          useful_life_years?: number
          user_id?: string
        }
        Relationships: []
      }
      accountant_hours: {
        Row: {
          billable: boolean
          client: string | null
          created_at: string
          date: string
          description: string
          hours: number
          id: string
          user_id: string
        }
        Insert: {
          billable?: boolean
          client?: string | null
          created_at?: string
          date: string
          description: string
          hours: number
          id?: string
          user_id: string
        }
        Update: {
          billable?: boolean
          client?: string | null
          created_at?: string
          date?: string
          description?: string
          hours?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      accountant_invoice_lines: {
        Row: {
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          sort_order: number
          unit_price: number
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          sort_order?: number
          unit_price: number
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          sort_order?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "accountant_invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "accountant_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      accountant_invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          client_vat_number: string | null
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string
          subtotal: number
          total: number
          user_id: string
          vat_amount: number
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          client_vat_number?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          status?: string
          subtotal?: number
          total?: number
          user_id: string
          vat_amount?: number
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          client_vat_number?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string
          subtotal?: number
          total?: number
          user_id?: string
          vat_amount?: number
        }
        Relationships: []
      }
      accountant_receipts: {
        Row: {
          ai_scanned: boolean
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          supplier: string | null
          user_id: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          ai_scanned?: boolean
          amount: number
          category?: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          supplier?: string | null
          user_id: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          ai_scanned?: boolean
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          supplier?: string | null
          user_id?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: []
      }
      accountant_settings: {
        Row: {
          business_name: string | null
          id: string
          kvk_number: string | null
          starter_aftrek: boolean
          tax_year: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          id?: string
          kvk_number?: string | null
          starter_aftrek?: boolean
          tax_year?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          id?: string
          kvk_number?: string | null
          starter_aftrek?: boolean
          tax_year?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      accountant_subscriptions: {
        Row: {
          amount: number
          category: string
          created_at: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          last_generated: string | null
          name: string
          notes: string | null
          start_date: string
          supplier: string | null
          user_id: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_generated?: string | null
          name: string
          notes?: string | null
          start_date: string
          supplier?: string | null
          user_id: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_generated?: string | null
          name?: string
          notes?: string | null
          start_date?: string
          supplier?: string | null
          user_id?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: []
      }
      accountant_transactions: {
        Row: {
          amount: number
          bank_reference: string | null
          category: string
          created_at: string
          date: string
          description: string
          id: string
          imported_from: string | null
          is_private: boolean
          km_distance: number | null
          receipt_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          category?: string
          created_at?: string
          date: string
          description: string
          id?: string
          imported_from?: string | null
          is_private?: boolean
          km_distance?: number | null
          receipt_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          imported_from?: string | null
          is_private?: boolean
          km_distance?: number | null
          receipt_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountant_transactions_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "accountant_receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_beleid_feedback: {
        Row: {
          categorie: string
          gestemde_uids: string[] | null
          id: string
          idee: string
          school_id: string | null
          stemmen: number | null
          timestamp: string | null
          uid: string
        }
        Insert: {
          categorie: string
          gestemde_uids?: string[] | null
          id?: string
          idee: string
          school_id?: string | null
          stemmen?: number | null
          timestamp?: string | null
          uid: string
        }
        Update: {
          categorie?: string
          gestemde_uids?: string[] | null
          id?: string
          idee?: string
          school_id?: string | null
          stemmen?: number | null
          timestamp?: string | null
          uid?: string
        }
        Relationships: []
      }
      ai_beleid_surveys: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
          uid: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          uid: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          uid?: string
        }
        Relationships: []
      }
      analytics_daily_aggregates: {
        Row: {
          created_at: string | null
          data: Json | null
          date: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          date: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          date?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_name: string
          created_at: string
          id: string
          message: string
          priority: string
          title: string
          trip_id: string
        }
        Insert: {
          author_name?: string
          created_at?: string
          id?: string
          message: string
          priority?: string
          title: string
          trip_id?: string
        }
        Update: {
          author_name?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          title?: string
          trip_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          data: Json | null
          id: string
          school_id: string | null
          timestamp: string | null
          uid: string
        }
        Insert: {
          action: string
          data?: Json | null
          id?: string
          school_id?: string | null
          timestamp?: string | null
          uid: string
        }
        Update: {
          action?: string
          data?: Json | null
          id?: string
          school_id?: string | null
          timestamp?: string | null
          uid?: string
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: []
      }
      bomberman_rooms: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          lobby_start_time: string | null
          players: Json | null
          school_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          lobby_start_time?: string | null
          players?: Json | null
          school_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          lobby_start_time?: string | null
          players?: Json | null
          school_id?: string | null
          status?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_name: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_name: string
          trip_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_name?: string
          trip_id?: string
        }
        Relationships: []
      }
      class_settings: {
        Row: {
          data: Json | null
          id: string
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          id: string
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      classroom_configs: {
        Row: {
          data: Json | null
          id: string
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          id: string
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      curriculum_missions: {
        Row: {
          class_restriction: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          education_levels: string[] | null
          id: string
          is_bonus: boolean | null
          is_external: boolean | null
          is_review: boolean | null
          period: number
          position: number
          slo_kerndoelen: string[]
          slo_vso_kerndoelen: string[] | null
          status: string | null
          title: string
          updated_at: string | null
          year_group: number
        }
        Insert: {
          class_restriction?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          education_levels?: string[] | null
          id: string
          is_bonus?: boolean | null
          is_external?: boolean | null
          is_review?: boolean | null
          period: number
          position: number
          slo_kerndoelen: string[]
          slo_vso_kerndoelen?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
          year_group: number
        }
        Update: {
          class_restriction?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          education_levels?: string[] | null
          id?: string
          is_bonus?: boolean | null
          is_external?: boolean | null
          is_review?: boolean | null
          period?: number
          position?: number
          slo_kerndoelen?: string[]
          slo_vso_kerndoelen?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
          year_group?: number
        }
        Relationships: []
      }
      developer_plans: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      developer_tasks: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      developer_timeline: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      drawing_challenges: {
        Row: {
          challenged_id: string
          challenger_id: string
          created_at: string | null
          id: string
          session_id: string | null
          status: string | null
        }
        Insert: {
          challenged_id: string
          challenger_id: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          status?: string | null
        }
        Update: {
          challenged_id?: string
          challenger_id?: string
          created_at?: string | null
          id?: string
          session_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      drawing_duels: {
        Row: {
          created_at: string | null
          current_prompt_index: number | null
          end_time: string | null
          id: string
          player1: Json
          player1_ready: boolean | null
          player2: Json
          player2_ready: boolean | null
          prompt_order: Json | null
          start_time: string | null
          status: string
          student_class: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_prompt_index?: number | null
          end_time?: string | null
          id?: string
          player1: Json
          player1_ready?: boolean | null
          player2: Json
          player2_ready?: boolean | null
          prompt_order?: Json | null
          start_time?: string | null
          status?: string
          student_class?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_prompt_index?: number | null
          end_time?: string | null
          id?: string
          player1?: Json
          player1_ready?: boolean | null
          player2?: Json
          player2_ready?: boolean | null
          prompt_order?: Json | null
          start_time?: string | null
          status?: string
          student_class?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      emergency_alerts: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          message: string | null
          resolved: boolean
          trip_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string | null
          resolved?: boolean
          trip_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string | null
          resolved?: boolean
          trip_id?: string
          user_name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Relationships: []
      }
      game_permissions: {
        Row: {
          data: Json | null
          id: string
          school_id: string | null
          updated_at: string | null
          year_group: number | null
        }
        Insert: {
          data?: Json | null
          id: string
          school_id?: string | null
          updated_at?: string | null
          year_group?: number | null
        }
        Update: {
          data?: Json | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
          year_group?: number | null
        }
        Relationships: []
      }
      gamification_events: {
        Row: {
          active: boolean | null
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Relationships: []
      }
      gathering_checkins: {
        Row: {
          checked_in_at: string
          id: string
          point_id: string
          source: string
          trip_id: string
          user_id: string
          user_name: string
        }
        Insert: {
          checked_in_at?: string
          id?: string
          point_id: string
          source?: string
          trip_id: string
          user_id: string
          user_name: string
        }
        Update: {
          checked_in_at?: string
          id?: string
          point_id?: string
          source?: string
          trip_id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "gathering_checkins_point_id_fkey"
            columns: ["point_id"]
            isOneToOne: false
            referencedRelation: "gathering_points"
            referencedColumns: ["id"]
          },
        ]
      }
      gathering_points: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          maps_query: string
          name: string
          trip_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_query: string
          name: string
          trip_id?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_query?: string
          name?: string
          trip_id?: string
        }
        Relationships: []
      }
      highlighted_work: {
        Row: {
          data: Json | null
          id: string
          school_id: string | null
          timestamp: string | null
        }
        Insert: {
          data?: Json | null
          id?: string
          school_id?: string | null
          timestamp?: string | null
        }
        Update: {
          data?: Json | null
          id?: string
          school_id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      hybrid_assessments: {
        Row: {
          auto_score: number | null
          created_at: string | null
          final_score: number | null
          id: string
          mission_id: string
          passed: boolean | null
          school_id: string | null
          student_name: string
          teacher_checks: Json | null
          teacher_score: number | null
          uid: string
          weights: Json | null
        }
        Insert: {
          auto_score?: number | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          mission_id: string
          passed?: boolean | null
          school_id?: string | null
          student_name: string
          teacher_checks?: Json | null
          teacher_score?: number | null
          uid: string
          weights?: Json | null
        }
        Update: {
          auto_score?: number | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          mission_id?: string
          passed?: boolean | null
          school_id?: string | null
          student_name?: string
          teacher_checks?: Json | null
          teacher_score?: number | null
          uid?: string
          weights?: Json | null
        }
        Relationships: []
      }
      leaderboard_scores: {
        Row: {
          group_name: string
          id: string
          score: number
          trip_id: string
          updated_at: string
        }
        Insert: {
          group_name: string
          id?: string
          score?: number
          trip_id: string
          updated_at?: string
        }
        Update: {
          group_name?: string
          id?: string
          score?: number
          trip_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      mfa_trusted_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_hash: string
          user_agent_hash: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_hash: string
          user_agent_hash?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_hash?: string
          user_agent_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      peer_feedback: {
        Row: {
          class_id: string
          created_at: string | null
          criteria: Json | null
          feedback_text: string
          from_student_id: string
          helpful_vote: boolean | null
          id: string
          mission_id: string
          rating: number | null
          school_id: string
          to_student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          criteria?: Json | null
          feedback_text: string
          from_student_id: string
          helpful_vote?: boolean | null
          id?: string
          mission_id: string
          rating?: number | null
          school_id: string
          to_student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          criteria?: Json | null
          feedback_text?: string
          from_student_id?: string
          helpful_vote?: boolean | null
          id?: string
          mission_id?: string
          rating?: number | null
          school_id?: string
          to_student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      photo_submissions: {
        Row: {
          approved: boolean | null
          created_at: string
          id: string
          photo_url: string
          task_id: string
          trip_id: string
          user_name: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: string
          photo_url: string
          task_id: string
          trip_id: string
          user_name: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: string
          photo_url?: string
          task_id?: string
          trip_id?: string
          user_name?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string | null
          id: string
          image_path: string
          trip_id: string
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path: string
          trip_id: string
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          id?: string
          image_path?: string
          trip_id?: string
        }
        Relationships: []
      }
      pilot_requests: {
        Row: {
          aantal_leerlingen: string | null
          bericht: string | null
          contact_persoon: string
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          notities: string | null
          rol: string | null
          school_naam: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aantal_leerlingen?: string | null
          bericht?: string | null
          contact_persoon: string
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          notities?: string | null
          rol?: string | null
          school_naam: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aantal_leerlingen?: string | null
          bericht?: string | null
          contact_persoon?: string
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          notities?: string | null
          rol?: string | null
          school_naam?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          poll_id: string
          selected_option: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_id: string
          selected_option: string
          voter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_id?: string
          selected_option?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          options: Json
          question: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json
          question: string
          trip_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json
          question?: string
          trip_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          trip_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          trip_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          checkout_session_id: string | null
          confirmed_at: string | null
          created_at: string | null
          email_history: Json | null
          end_date: string
          id: string
          is_guest: boolean | null
          license_plate: string | null
          notes: string | null
          number_of_nights: number
          payment_id: string | null
          payment_intent_id: string | null
          refund_amount: number | null
          refund_id: string | null
          refund_reason: string | null
          refunded_at: string | null
          review_email_sent: boolean | null
          review_email_sent_at: string | null
          start_date: string
          status: string | null
          status_reason: string | null
          status_updated_at: string | null
          status_updated_by: string | null
          total_price: number
          user_email: string
          user_id: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          checkout_session_id?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email_history?: Json | null
          end_date: string
          id?: string
          is_guest?: boolean | null
          license_plate?: string | null
          notes?: string | null
          number_of_nights: number
          payment_id?: string | null
          payment_intent_id?: string | null
          refund_amount?: number | null
          refund_id?: string | null
          refund_reason?: string | null
          refunded_at?: string | null
          review_email_sent?: boolean | null
          review_email_sent_at?: string | null
          start_date: string
          status?: string | null
          status_reason?: string | null
          status_updated_at?: string | null
          status_updated_by?: string | null
          total_price: number
          user_email: string
          user_id?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          checkout_session_id?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email_history?: Json | null
          end_date?: string
          id?: string
          is_guest?: boolean | null
          license_plate?: string | null
          notes?: string | null
          number_of_nights?: number
          payment_id?: string | null
          payment_intent_id?: string | null
          refund_amount?: number | null
          refund_id?: string | null
          refund_reason?: string | null
          refunded_at?: string | null
          review_email_sent?: boolean | null
          review_email_sent_at?: string | null
          start_date?: string
          status?: string | null
          status_reason?: string | null
          status_updated_at?: string | null
          status_updated_by?: string | null
          total_price?: number
          user_email?: string
          user_id?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: []
      }
      reviews_cache: {
        Row: {
          cached_at: string | null
          id: string
          reviews: Json | null
          sources: Json | null
        }
        Insert: {
          cached_at?: string | null
          id?: string
          reviews?: Json | null
          sources?: Json | null
        }
        Update: {
          cached_at?: string | null
          id?: string
          reviews?: Json | null
          sources?: Json | null
        }
        Relationships: []
      }
      room_assignments: {
        Row: {
          created_at: string
          id: string
          room_id: string
          student_name: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          student_name: string
          trip_id: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          student_name?: string
          trip_id?: string
        }
        Relationships: []
      }
      school_configs: {
        Row: {
          created_at: string | null
          custom_config: Json | null
          id: string
          max_year_havo: number | null
          max_year_mavo: number | null
          max_year_vwo: number | null
          period_naming: string | null
          periods_per_year: number | null
          school_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_config?: Json | null
          id?: string
          max_year_havo?: number | null
          max_year_mavo?: number | null
          max_year_vwo?: number | null
          period_naming?: string | null
          periods_per_year?: number | null
          school_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_config?: Json | null
          id?: string
          max_year_havo?: number | null
          max_year_mavo?: number | null
          max_year_vwo?: number | null
          period_naming?: string | null
          periods_per_year?: number | null
          school_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      shared_games: {
        Row: {
          book_data: Json | null
          created_at: string | null
          creator_name: string
          creator_uid: string
          creator_xp_earned: number | null
          description: string | null
          game_code: string | null
          high_scores: Json | null
          id: string
          likes: string[] | null
          mission_id: string | null
          play_count: number | null
          school_id: string | null
          student_class: string | null
          thumbnail: string | null
          title: string
        }
        Insert: {
          book_data?: Json | null
          created_at?: string | null
          creator_name: string
          creator_uid: string
          creator_xp_earned?: number | null
          description?: string | null
          game_code?: string | null
          high_scores?: Json | null
          id?: string
          likes?: string[] | null
          mission_id?: string | null
          play_count?: number | null
          school_id?: string | null
          student_class?: string | null
          thumbnail?: string | null
          title: string
        }
        Update: {
          book_data?: Json | null
          created_at?: string | null
          creator_name?: string
          creator_uid?: string
          creator_xp_earned?: number | null
          description?: string | null
          game_code?: string | null
          high_scores?: Json | null
          id?: string
          likes?: string[] | null
          mission_id?: string | null
          play_count?: number | null
          school_id?: string | null
          student_class?: string | null
          thumbnail?: string | null
          title?: string
        }
        Relationships: []
      }
      sos_locations: {
        Row: {
          alert_id: string | null
          id: string
          latitude: number
          longitude: number
          trip_id: string
          updated_at: string | null
          user_name: string
        }
        Insert: {
          alert_id?: string | null
          id?: string
          latitude: number
          longitude: number
          trip_id: string
          updated_at?: string | null
          user_name: string
        }
        Update: {
          alert_id?: string | null
          id?: string
          latitude?: number
          longitude?: number
          trip_id?: string
          updated_at?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_locations_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "emergency_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      sos_status_updates: {
        Row: {
          alert_id: string
          created_at: string
          id: string
          note: string | null
          status: string
          trip_id: string
          updated_by: string | null
          user_name: string
        }
        Insert: {
          alert_id: string
          created_at?: string
          id?: string
          note?: string | null
          status: string
          trip_id: string
          updated_by?: string | null
          user_name: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          id?: string
          note?: string | null
          status?: string
          trip_id?: string
          updated_by?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_status_updates_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "emergency_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      student_activities: {
        Row: {
          data: string | null
          id: string
          school_id: string | null
          student_name: string
          timestamp: string | null
          type: string
          uid: string
        }
        Insert: {
          data?: string | null
          id?: string
          school_id?: string | null
          student_name: string
          timestamp?: string | null
          type: string
          uid: string
        }
        Update: {
          data?: string | null
          id?: string
          school_id?: string | null
          student_name?: string
          timestamp?: string | null
          type?: string
          uid?: string
        }
        Relationships: []
      }
      student_consents: {
        Row: {
          consent_type: string
          consent_version: string
          created_at: string | null
          granted: boolean
          granted_at: string | null
          granted_by: string
          id: string
          ip_address: string | null
          parent_email: string | null
          parent_name: string | null
          revoked_at: string | null
          school_id: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          consent_type: string
          consent_version?: string
          created_at?: string | null
          granted?: boolean
          granted_at?: string | null
          granted_by: string
          id?: string
          ip_address?: string | null
          parent_email?: string | null
          parent_name?: string | null
          revoked_at?: string | null
          school_id: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          consent_type?: string
          consent_version?: string
          created_at?: string | null
          granted?: boolean
          granted_at?: string | null
          granted_by?: string
          id?: string
          ip_address?: string | null
          parent_email?: string | null
          parent_name?: string | null
          revoked_at?: string | null
          school_id?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_feedback: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_groups: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
        }
        Relationships: []
      }
      teacher_locations: {
        Row: {
          display_name: string
          id: string
          latitude: number
          longitude: number
          trip_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          display_name: string
          id?: string
          latitude: number
          longitude: number
          trip_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          display_name?: string
          id?: string
          latitude?: number
          longitude?: number
          trip_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_messages: {
        Row: {
          content: string | null
          id: string
          read: boolean | null
          school_id: string | null
          sender_id: string | null
          target_id: string
          target_type: string
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          read?: boolean | null
          school_id?: string | null
          sender_id?: string | null
          target_id: string
          target_type: string
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          read?: boolean | null
          school_id?: string | null
          sender_id?: string | null
          target_id?: string
          target_type?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      teacher_notes: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      user_library: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          data: Json | null
          school_id: string | null
          student_class: string | null
          uid: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          data?: Json | null
          school_id?: string | null
          student_class?: string | null
          uid: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          data?: Json | null
          school_id?: string | null
          student_class?: string | null
          uid?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          mission_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          mission_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          mission_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_config: Json | null
          chat_lock_reason: string | null
          chat_lock_time: string | null
          chat_locked: boolean | null
          created_at: string | null
          display_name: string | null
          education_level: string | null
          email: string | null
          id: string
          last_login: string | null
          must_change_password: boolean | null
          password_reset_at: string | null
          password_reset_by: string | null
          processing_restricted: boolean | null
          processing_restricted_at: string | null
          processing_restricted_reason: string | null
          role: string
          school_id: string | null
          stats: Json | null
          student_class: string | null
          uid: string
          updated_at: string | null
          year_group: number | null
        }
        Insert: {
          avatar_config?: Json | null
          chat_lock_reason?: string | null
          chat_lock_time?: string | null
          chat_locked?: boolean | null
          created_at?: string | null
          display_name?: string | null
          education_level?: string | null
          email?: string | null
          id: string
          last_login?: string | null
          must_change_password?: boolean | null
          password_reset_at?: string | null
          password_reset_by?: string | null
          processing_restricted?: boolean | null
          processing_restricted_at?: string | null
          processing_restricted_reason?: string | null
          role?: string
          school_id?: string | null
          stats?: Json | null
          student_class?: string | null
          uid: string
          updated_at?: string | null
          year_group?: number | null
        }
        Update: {
          avatar_config?: Json | null
          chat_lock_reason?: string | null
          chat_lock_time?: string | null
          chat_locked?: boolean | null
          created_at?: string | null
          display_name?: string | null
          education_level?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          must_change_password?: boolean | null
          password_reset_at?: string | null
          password_reset_by?: string | null
          processing_restricted?: boolean | null
          processing_restricted_at?: string | null
          processing_restricted_reason?: string | null
          role?: string
          school_id?: string | null
          stats?: Json | null
          student_class?: string | null
          uid?: string
          updated_at?: string | null
          year_group?: number | null
        }
        Relationships: []
      }
      web_vitals_events: {
        Row: {
          build_id: string | null
          created_at: string
          cta_key: string | null
          device_class: string
          event_name: string
          id: string
          metadata: Json
          metric_name: string
          metric_rating: string
          metric_value: number
          nav_type: string
          page_key: string | null
          role: string | null
          route: string
        }
        Insert: {
          build_id?: string | null
          created_at?: string
          cta_key?: string | null
          device_class: string
          event_name?: string
          id?: string
          metadata?: Json
          metric_name: string
          metric_rating: string
          metric_value: number
          nav_type?: string
          page_key?: string | null
          role?: string | null
          route: string
        }
        Update: {
          build_id?: string | null
          created_at?: string
          cta_key?: string | null
          device_class?: string
          event_name?: string
          id?: string
          metadata?: Json
          metric_name?: string
          metric_rating?: string
          metric_value?: number
          nav_type?: string
          page_key?: string | null
          role?: string | null
          route?: string
        }
        Relationships: []
      }
      xp_suspicious_logs: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          reviewed: boolean | null
          school_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          reviewed?: boolean | null
          school_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          reviewed?: boolean | null
          school_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          mission_id: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          mission_id?: string | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          mission_id?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      web_vitals_route_daily: {
        Row: {
          day_nl: string | null
          device_class: string | null
          metric_name: string | null
          p50: number | null
          p75: number | null
          p95: number | null
          route: string | null
          samples: number | null
        }
        Relationships: []
      }
      web_vitals_route_last_24h: {
        Row: {
          device_class: string | null
          metric_name: string | null
          p50: number | null
          p75: number | null
          p95: number | null
          route: string | null
          samples: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      atomic_toggle_like: {
        Args: { p_game_id: string; p_user_id: string }
        Returns: Json
      }
      award_xp: {
        Args: {
          p_amount: number
          p_mission_id?: string
          p_source: string
          p_user_id: string
        }
        Returns: Json
      }
      calculate_level: { Args: { xp_amount: number }; Returns: number }
      check_xp_rate_limit:
        | { Args: { p_amount: number; p_user_id: string }; Returns: Json }
        | { Args: { p_amount: number; p_user_id: string }; Returns: Json }
      cleanup_expired_mfa_sessions: { Args: never; Returns: number }
      create_mfa_trust: {
        Args: {
          p_duration_minutes?: number
          p_ip_hash: string
          p_user_agent_hash?: string
          p_user_id: string
        }
        Returns: string
      }
      delete_student: { Args: { p_student_id: string }; Returns: boolean }
      get_caller_school_id: { Args: never; Returns: string }
      get_my_class: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      get_my_school_id: { Args: never; Returns: string }
      get_next_invoice_number: {
        Args: { p_user_id: string; p_year: number }
        Returns: string
      }
      get_sos_status_for_user: {
        Args: { p_alert_id: string; p_trip_id: string; p_user_name: string }
        Returns: {
          created_at: string
          note: string
          status: string
        }[]
      }
      has_mfa_trust: {
        Args: {
          p_ip_hash: string
          p_user_agent_hash?: string
          p_user_id: string
        }
        Returns: boolean
      }
      increment_play_count: { Args: { game_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_belgie_admin: { Args: never; Returns: boolean }
      is_mfa_aal2: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      is_teacher_in_school: {
        Args: { target_school_id: string }
        Returns: boolean
      }
      reset_student_progress: {
        Args: { p_student_id: string }
        Returns: boolean
      }
      revoke_all_mfa_trust: { Args: { p_user_id: string }; Returns: undefined }
      unvote_on_idea: { Args: { p_idea_id: string }; Returns: Json }
      update_student_stats: { Args: { p_stats: Json }; Returns: undefined }
      vote_on_idea: { Args: { p_idea_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
