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
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          role: "admin" | "organizer" | "player";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          role?: "admin" | "organizer" | "player";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          role?: "admin" | "organizer" | "player";
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          creator_id: string;
          name: string;
          logo_url: string | null;
          is_official: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          name: string;
          logo_url?: string | null;
          is_official?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          name?: string;
          logo_url?: string | null;
          is_official?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          status: "draft" | "active" | "finished";
          settings: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          status?: "draft" | "active" | "finished";
          settings?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          status?: "draft" | "active" | "finished";
          settings?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tournament_participants: {
        Row: {
          id: string;
          tournament_id: string;
          team_id: string;
          seed_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          team_id: string;
          seed_number: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          team_id?: string;
          seed_number?: number;
          created_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          round: "16" | "8" | "4" | "2" | "1";
          position: number;
          team1_id: string | null;
          team2_id: string | null;
          winner_id: string | null;
          next_match_id: string | null;
          score_team1: number | null;
          score_team2: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round: "16" | "8" | "4" | "2" | "1";
          position: number;
          team1_id?: string | null;
          team2_id?: string | null;
          winner_id?: string | null;
          next_match_id?: string | null;
          score_team1?: number | null;
          score_team2?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round?: "16" | "8" | "4" | "2" | "1";
          position?: number;
          team1_id?: string | null;
          team2_id?: string | null;
          winner_id?: string | null;
          next_match_id?: string | null;
          score_team1?: number | null;
          score_team2?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
