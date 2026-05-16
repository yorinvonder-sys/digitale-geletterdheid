import type { Database as GeneratedDatabase, Json } from './database.types';

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type DeveloperTaskStatus =
  | 'todo'
  | 'pending'
  | 'in_progress'
  | 'done'
  | 'completed'
  | 'blocked'
  | 'waiting_external';

type DeveloperPriority = 'low' | 'medium' | 'high';

type PendingTables = {
  developer_tasks: TableDefinition<
    {
      id: string;
      user_id: string;
      title: string | null;
      description: string | null;
      status: DeveloperTaskStatus;
      priority: DeveloperPriority;
      category: string | null;
      data: Json | null;
      created_at: string | null;
      updated_at: string | null;
    },
    {
      id?: string;
      user_id: string;
      title?: string | null;
      description?: string | null;
      status?: DeveloperTaskStatus;
      priority?: DeveloperPriority;
      category?: string | null;
      data?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    }
  >;
  developer_plans: TableDefinition<
    {
      id: string;
      user_id: string;
      plan_data: Json | null;
      data: Json | null;
      version: number;
      status: 'draft' | 'approved' | 'rejected';
      created_at: string | null;
      updated_at: string | null;
    },
    {
      id?: string;
      user_id: string;
      plan_data?: Json | null;
      data?: Json | null;
      version?: number;
      status?: 'draft' | 'approved' | 'rejected';
      created_at?: string | null;
      updated_at?: string | null;
    }
  >;
  developer_milestones: TableDefinition<
    {
      id: string;
      user_id: string;
      title: string;
      deadline: string | null;
      completed: boolean;
      tasks: Json;
      phase: string | null;
      start_date: string | null;
      end_date: string | null;
      status: 'pending' | 'in_progress' | 'completed';
      learning_goal: string | null;
      updated_at: string | null;
      created_at: string | null;
    },
    {
      id?: string;
      user_id: string;
      title: string;
      deadline?: string | null;
      completed?: boolean;
      tasks?: Json;
      phase?: string | null;
      start_date?: string | null;
      end_date?: string | null;
      status?: 'pending' | 'in_progress' | 'completed';
      learning_goal?: string | null;
      updated_at?: string | null;
      created_at?: string | null;
    }
  >;
  developer_settings: TableDefinition<
    {
      user_id: string;
      settings: Json;
      updated_at: string | null;
      created_at: string | null;
    },
    {
      user_id: string;
      settings?: Json;
      updated_at?: string | null;
      created_at?: string | null;
    }
  >;
  bomberman_lobbies: TableDefinition<
    {
      id: string;
      host_uid: string;
      host_name: string;
      school_id: string | null;
      class_id: string | null;
      players: Json;
      status: 'waiting' | 'playing' | 'finished';
      max_players: number;
      settings: Json;
      created_at: string | null;
      updated_at: string | null;
    },
    {
      id?: string;
      host_uid: string;
      host_name: string;
      school_id?: string | null;
      class_id?: string | null;
      players?: Json;
      status?: 'waiting' | 'playing' | 'finished';
      max_players?: number;
      settings?: Json;
      created_at?: string | null;
      updated_at?: string | null;
    }
  >;
  duel_presence: TableDefinition<
    {
      uid: string;
      name: string;
      class: string | null;
      school_id: string | null;
      online_at: string;
    },
    {
      uid: string;
      name: string;
      class?: string | null;
      school_id?: string | null;
      online_at?: string;
    }
  >;
  duel_challenges: TableDefinition<
    {
      id: string;
      challenger_uid: string;
      challenger_name: string;
      challenged_uid: string;
      challenged_name: string;
      school_id: string | null;
      status: 'pending' | 'accepted' | 'declined' | 'expired';
      created_at: string | null;
    },
    {
      id?: string;
      challenger_uid: string;
      challenger_name: string;
      challenged_uid: string;
      challenged_name: string;
      school_id?: string | null;
      status?: 'pending' | 'accepted' | 'declined' | 'expired';
      created_at?: string | null;
    }
  >;
  active_duels: TableDefinition<
    {
      id: string;
      player1_uid: string;
      player1_name: string;
      player2_uid: string;
      player2_name: string;
      school_id: string | null;
      current_round: number;
      max_rounds: number;
      current_drawer: string;
      current_word: string | null;
      player1_score: number;
      player2_score: number;
      status: 'drawing' | 'guessing' | 'round_end' | 'finished';
      drawing_data: Json | null;
      round_start_time: string | null;
      created_at: string | null;
      updated_at: string | null;
    },
    {
      id?: string;
      player1_uid: string;
      player1_name: string;
      player2_uid: string;
      player2_name: string;
      school_id?: string | null;
      current_round?: number;
      max_rounds?: number;
      current_drawer: string;
      current_word?: string | null;
      player1_score?: number;
      player2_score?: number;
      status?: 'drawing' | 'guessing' | 'round_end' | 'finished';
      drawing_data?: Json | null;
      round_start_time?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    }
  >;
  feedback: TableDefinition<
    {
      id: string;
      user_id: string;
      user_name: string;
      user_class: string;
      school_id: string | null;
      message: string;
      status: string;
      created_at: string | null;
    },
    {
      id?: string;
      user_id: string;
      user_name: string;
      user_class?: string;
      school_id?: string | null;
      message: string;
      status?: string;
      created_at?: string | null;
    }
  >;
  xp_abuse_logs: TableDefinition<
    {
      id: string;
      user_id: string;
      activity_type: string;
      details: Json;
      created_at: string;
    },
    {
      id?: string;
      user_id: string;
      activity_type: string;
      details?: Json;
      created_at?: string;
    }
  >;
  user_blocks: TableDefinition<
    {
      id: string;
      blocker_id: string;
      blocked_id: string;
      blocked_name: string | null;
      reason: string | null;
      created_at: string | null;
    },
    {
      id?: string;
      blocker_id: string;
      blocked_id: string;
      blocked_name?: string | null;
      reason?: string | null;
      created_at?: string | null;
    }
  >;
  class_settings: TableDefinition<
    {
      id: string;
      class_id: string | null;
      enabled_missions: string[];
      difficulty: 'easy' | 'medium' | 'hard';
      xp_multiplier: number;
      school_id: string | null;
      data: Json | null;
      updated_at: string | null;
    },
    {
      id?: string;
      class_id?: string | null;
      enabled_missions?: string[];
      difficulty?: 'easy' | 'medium' | 'hard';
      xp_multiplier?: number;
      school_id?: string | null;
      data?: Json | null;
      updated_at?: string | null;
    }
  >;
  teacher_messages: TableDefinition<
    {
      id: string;
      school_id: string | null;
      target_type: 'student' | 'class' | 'all';
      target_id: string;
      sender_name: string | null;
      sender_id: string | null;
      text: string | null;
      content: string | null;
      read: boolean;
      created_at: string | null;
      timestamp: string | null;
    },
    {
      id?: string;
      school_id?: string | null;
      target_type: 'student' | 'class' | 'all';
      target_id: string;
      sender_name?: string | null;
      sender_id?: string | null;
      text?: string | null;
      content?: string | null;
      read?: boolean;
      created_at?: string | null;
      timestamp?: string | null;
    }
  >;
  teacher_message_reads: TableDefinition<
    {
      message_id: string;
      user_id: string;
      read_at: string;
    },
    {
      message_id: string;
      user_id: string;
      read_at?: string;
    },
    {
      message_id?: string;
      user_id?: string;
      read_at?: string;
    }
  >;
  gamification_events: TableDefinition<
    {
      id: string;
      type: 'xp_boost' | 'competition' | 'badge_unlock' | null;
      name: string | null;
      multiplier: number | null;
      target_class: string | null;
      start_time: string | null;
      end_time: string | null;
      active: boolean;
      school_id: string | null;
      data: Json | null;
      created_at: string | null;
    },
    {
      id?: string;
      type?: 'xp_boost' | 'competition' | 'badge_unlock' | null;
      name?: string | null;
      multiplier?: number | null;
      target_class?: string | null;
      start_time?: string | null;
      end_time?: string | null;
      active?: boolean;
      school_id?: string | null;
      data?: Json | null;
      created_at?: string | null;
    }
  >;
  highlighted_work: TableDefinition<
    {
      id: string;
      uid: string | null;
      school_id: string | null;
      student_name: string | null;
      mission_id: string | null;
      title: string | null;
      content: string | null;
      teacher_note: string | null;
      data: Json | null;
      timestamp: string | null;
    },
    {
      id?: string;
      uid?: string | null;
      school_id?: string | null;
      student_name?: string | null;
      mission_id?: string | null;
      title?: string | null;
      content?: string | null;
      teacher_note?: string | null;
      data?: Json | null;
      timestamp?: string | null;
    }
  >;
  teacher_notes: TableDefinition<
    {
      id: string;
      teacher_uid: string | null;
      student_uid: string | null;
      school_id: string | null;
      text: string | null;
      category: string | null;
      data: Json | null;
      created_at: string | null;
      updated_at: string | null;
    },
    {
      id?: string;
      teacher_uid?: string | null;
      student_uid?: string | null;
      school_id?: string | null;
      text?: string | null;
      category?: string | null;
      data?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    }
  >;
  student_groups: TableDefinition<
    {
      id: string;
      name: string | null;
      class_id: string | null;
      school_id: string | null;
      student_uids: string[];
      data: Json | null;
      created_at: string | null;
    },
    {
      id?: string;
      name?: string | null;
      class_id?: string | null;
      school_id?: string | null;
      student_uids?: string[];
      data?: Json | null;
      created_at?: string | null;
    }
  >;
};

type PublicSchema = GeneratedDatabase['public'];

export type DatabaseWithPendingMigrations = Omit<GeneratedDatabase, 'public'> & {
  public: Omit<PublicSchema, 'Tables'> & {
    Tables: Omit<PublicSchema['Tables'], keyof PendingTables> & PendingTables;
  };
};
