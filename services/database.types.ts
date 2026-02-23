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
  public: {
    Tables: {
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
          email: string | null
          id: string
          last_login: string | null
          must_change_password: boolean | null
          password_reset_at: string | null
          password_reset_by: string | null
          role: string
          school_id: string | null
          stats: Json | null
          student_class: string | null
          uid: string
          updated_at: string | null
        }
        Insert: {
          avatar_config?: Json | null
          chat_lock_reason?: string | null
          chat_lock_time?: string | null
          chat_locked?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          last_login?: string | null
          must_change_password?: boolean | null
          password_reset_at?: string | null
          password_reset_by?: string | null
          role?: string
          school_id?: string | null
          stats?: Json | null
          student_class?: string | null
          uid: string
          updated_at?: string | null
        }
        Update: {
          avatar_config?: Json | null
          chat_lock_reason?: string | null
          chat_lock_time?: string | null
          chat_locked?: boolean | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          must_change_password?: boolean | null
          password_reset_at?: string | null
          password_reset_by?: string | null
          role?: string
          school_id?: string | null
          stats?: Json | null
          student_class?: string | null
          uid?: string
          updated_at?: string | null
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
      [_ in never]: never
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
      check_xp_rate_limit: {
        Args: { p_amount: number; p_user_id: string }
        Returns: Json
      }
      get_my_class: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
      get_my_school_id: { Args: never; Returns: string }
      get_sos_status_for_user: {
        Args: { p_alert_id: string; p_trip_id: string; p_user_name: string }
        Returns: {
          created_at: string
          note: string
          status: string
        }[]
      }
      increment_play_count: { Args: { game_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_belgie_admin: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      is_teacher_in_school: {
        Args: { target_school_id: string }
        Returns: boolean
      }
      unvote_on_idea: { Args: { p_idea_id: string }; Returns: Json }
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
  public: {
    Enums: {},
  },
} as const
