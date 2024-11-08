export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  games: {
    Tables: {
      games: {
        Row: {
          codename: string
          id: string
          is_active: boolean
        }
        Insert: {
          codename: string
          id?: string
          is_active?: boolean
        }
        Update: {
          codename?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      pilots: {
        Row: {
          actual_driver: boolean
          actual_team: string | null
          actual_team_color: string | null
          birthday: number
          championships: string
          code: string
          created_at: string
          deleted_at: string | null
          f2_winner: number
          first_year: number
          historical: boolean
          id: number
          last_modified_at: string
          level: number
          name: string
          nationality: string
          number: number
          order: number | null
          photo_url: string | null
          podiums: number
          poles: number
          race_wins: number
          races: number
          surname: string
          team: number[]
          teammate: number[] | null
          updated_at: string
          world_champion: number
          wp_id: string | null
        }
        Insert: {
          actual_driver?: boolean
          actual_team?: string | null
          actual_team_color?: string | null
          birthday: number
          championships?: string
          code: string
          created_at?: string
          deleted_at?: string | null
          f2_winner: number
          first_year: number
          historical: boolean
          id?: number
          last_modified_at?: string
          level?: number
          name: string
          nationality: string
          number: number
          order?: number | null
          photo_url?: string | null
          podiums: number
          poles: number
          race_wins: number
          races: number
          surname: string
          team: number[]
          teammate?: number[] | null
          updated_at?: string
          world_champion: number
          wp_id?: string | null
        }
        Update: {
          actual_driver?: boolean
          actual_team?: string | null
          actual_team_color?: string | null
          birthday?: number
          championships?: string
          code?: string
          created_at?: string
          deleted_at?: string | null
          f2_winner?: number
          first_year?: number
          historical?: boolean
          id?: number
          last_modified_at?: string
          level?: number
          name?: string
          nationality?: string
          number?: number
          order?: number | null
          photo_url?: string | null
          podiums?: number
          poles?: number
          race_wins?: number
          races?: number
          surname?: string
          team?: number[]
          teammate?: number[] | null
          updated_at?: string
          world_champion?: number
          wp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pilots_nationality_fkey"
            columns: ["nationality"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          car_photo_url: string | null
          color: string
          created_at: string
          deleted_at: string | null
          id: number
          initials_team_name: string
          last_modified_at: string | null
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          car_photo_url?: string | null
          color: string
          created_at?: string
          deleted_at?: string | null
          id: number
          initials_team_name?: string
          last_modified_at?: string | null
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          car_photo_url?: string | null
          color?: string
          created_at?: string
          deleted_at?: string | null
          id?: number
          initials_team_name?: string
          last_modified_at?: string | null
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      csa: "as"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pd: {
    Tables: {
      championships: {
        Row: {
          code: string | null
          created_at: string
          id: number
          is_active: boolean
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      levels: {
        Row: {
          championship_id: number | null
          codename: string
          created_at: string
          description: string
          id: number
          is_active: boolean
          max_moves: number
          time_limit: number
          visibleNumber: boolean
        }
        Insert: {
          championship_id?: number | null
          codename: string
          created_at?: string
          description: string
          id?: number
          is_active?: boolean
          max_moves: number
          time_limit: number
          visibleNumber?: boolean
        }
        Update: {
          championship_id?: number | null
          codename?: string
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          max_moves?: number
          time_limit?: number
          visibleNumber?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "levels_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
      championships: {
        Row: {
          api_avaible: boolean
          code: string
          color: string
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          name: string
          order: number | null
          photo_url: string
          updated_at: string
        }
        Insert: {
          api_avaible?: boolean
          code: string
          color: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name: string
          order?: number | null
          photo_url?: string
          updated_at?: string
        }
        Update: {
          api_avaible?: boolean
          code?: string
          color?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name?: string
          order?: number | null
          photo_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      circuits: {
        Row: {
          country_id: string
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          lat: number
          location: string
          long: number
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          country_id: string
          created_at?: string
          deleted_at?: string | null
          id: string
          last_modified_at?: string
          lat: number
          location: string
          long: number
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          country_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          lat?: number
          location?: string
          long?: number
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "circuits_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      countries: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          iso2: string
          iso3: string
          last_modified_at: string
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          iso2: string
          iso3: string
          last_modified_at?: string
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          iso2?: string
          iso3?: string
          last_modified_at?: string
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          birthday: string
          code_driver: string
          country_id: string
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          name: string
          surname: string
          updated_at: string
          synchronized: boolean
        }
        Insert: {
          birthday: string
          code_driver: string
          country_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name: string
          surname: string
          updated_at?: string
          synchronized: boolean
        }
        Update: {
          birthday?: string
          code_driver?: string
          country_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name?: string
          surname?: string
          updated_at?: string
          synchronized: boolean
        }
        Relationships: [
          {
            foreignKeyName: "drivers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      engines: {
        Row: {
          color: string
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          name: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      meteo: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          last_modified_at: string
          meteo: string | null
          race_id: string
          round: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          meteo?: string | null
          race_id: string
          round: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          meteo?: string | null
          race_id?: string
          round?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_meteo_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          }
        ]
      }
      options: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          key: string
          last_modified_at: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          key: string
          last_modified_at?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          key?: string
          last_modified_at?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      race_sessions: {
        Row: {
          created_at: string
          date: string
          deleted_at: string | null
          id: string
          include_statistic: boolean
          last_modified_at: string
          meteo: string | null
          name: string
          race_id: string
          round: number
          updated_at: string
          type: string | null
        }
        Insert: {
          created_at?: string
          date: string
          deleted_at?: string | null
          id?: string
          include_statistic: boolean
          last_modified_at?: string
          meteo?: string | null
          name: string
          race_id: string
          round: number
          updated_at?: string
          type?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          deleted_at?: string | null
          id?: string
          include_statistic?: boolean
          last_modified_at?: string
          meteo?: string | null
          name?: string
          race_id?: string
          round?: number
          updated_at?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_race_sessions_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          }
        ]
      }
      races: {
        Row: {
          championship_id: string
          circuit_id: string
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          name: string
          round: number
          season_id: number
          updated_at: string
        }
        Insert: {
          championship_id: string
          circuit_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name: string
          round: number
          season_id: number
          updated_at?: string
        }
        Update: {
          championship_id?: string
          circuit_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          name?: string
          round?: number
          season_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "races_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "races_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "races_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          }
        ]
      }
      result_drivers: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          result_id: string
          synchronized: boolean
          team_season_drivers_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          result_id: string
          synchronized?: boolean
          team_season_drivers_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          result_id?: string
          synchronized?: boolean
          team_season_drivers_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "result_drivers_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_drivers_team_season_drivers_id_fkey"
            columns: ["team_season_drivers_id"]
            isOneToOne: false
            referencedRelation: "team_season_drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      results: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          last_modified_at: string
          points: number
          pole: boolean
          position: number
          race_session_id: string
          retired: boolean
          updated_at: string
          synchronized: boolean
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          points: number
          pole?: boolean
          position: number
          race_session_id: string
          retired?: boolean
          updated_at?: string
          synchronized?: boolean
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_modified_at?: string
          points?: number
          pole?: boolean
          position?: number
          race_session_id?: string
          retired?: boolean
          updated_at?: string
          synchronized?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_results_race_sessions_id_fkey"
            columns: ["race_session_id"]
            isOneToOne: false
            referencedRelation: "race_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      seasons: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          last_modified_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_season_drivers: {
        Row: {
          championship_id: string
          created_at?: string
          deleted_at: string | null
          driver_id: string
          id: string
          last_modified_at?: string
          number: number
          season_id: number
          team_id: string
          updated_at?: string
          synchronized: boolean
          api_id: number | null
        }
        Insert: {
          championship_id: string
          created_at?: string
          deleted_at?: string | null
          driver_id: string
          id?: string
          last_modified_at?: string
          number: number
          season_id: number
          team_id: string
          updated_at?: string
          synchronized: boolean
          api_id: number | null
        }
        Update: {
          championship_id?: string
          created_at?: string
          deleted_at?: string | null
          driver_id?: string
          id?: string
          last_modified_at?: string
          number?: number
          season_id?: number
          team_id?: string
          updated_at?: string
          synchronized: boolean
          api_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_season_drivers_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_season_drivers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_season_drivers_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_season_drivers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          color: string
          created_at: string
          deleted_at: string | null
          engine_id: string | null
          id: string
          last_modified_at: string
          name: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          deleted_at?: string | null
          engine_id?: string | null
          id?: string
          last_modified_at?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          deleted_at?: string | null
          engine_id?: string | null
          id?: string
          last_modified_at?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_engine_id_fkey"
            columns: ["engine_id"]
            isOneToOne: false
            referencedRelation: "engines"
            referencedColumns: ["id"]
          }
        ]
      }
      weather_response: {
        Row: {
          content: string | null
        }
        Insert: {
          content?: string | null
        }
        Update: {
          content?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_queue_friends: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      epoch_to_timestamp: {
        Args: {
          epoch: string
        }
        Returns: string
      }
      fetch_next_race_meteo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_jwt_for_weatherkit: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_driver_details_and_position: {
        Args: {
          driver_season_team_id: string
        }
        Returns: Json
      }
      get_recent_sessions: {
        Args: {
          championship_uuid: string
        }
        Returns: {
          id: string
          round: number
          race_round: number
        }[]
      }
      get_team_details_and_stats: {
        Args: {
          team_season_driver_id: string
        }
        Returns: Json
      }
      get_team_points_by_race: {
        Args: {
          team_season_driver_id_param: string
        }
        Returns: Json
      }
      is_uid_in_jsonb_array: {
        Args: {
          jsonb_array: Json[]
          user_uid: string
        }
        Returns: boolean
      }
      is_uuid: {
        Args: {
          v_input: string
        }
        Returns: boolean
      }
      pull: {
        Args: {
          last_pulled_at?: number
        }
        Returns: Json
      }
      timestamp_to_epoch: {
        Args: {
          ts: string
        }
        Returns: number
      }
    }
    Enums: {
      event_type: "conventional" | "sprint_shootout" | "sprint"
      game_level: "EASY" | "HARD"
      moves_status: "ONGOING" | "ACCEPTED" | "DECLINED"
      question_position: "ROW" | "COLUMN" | "BOTH"
      question_type:
      | "RACES"
      | "TEAM"
      | "NUMBER"
      | "WORLD_CHAMPION"
      | "WINS"
      | "F2_CHAMPION"
      | "PODIUMS"
      | "POLES"
      | "NATIONALITY"
      | "ACTUAL_DRIVER"
      | "IS_WORLD_CHAMPION"
      | "TEAM_MATES"
      | "HISTORICAL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  telemetry: {
    Tables: {
      max_speed: {
        Row: {
          created_at: string
          data: Json
          race_session_id: string
          team_season_driver_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          race_session_id?: string
          team_season_driver_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          race_session_id?: string
          team_season_driver_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_max_speed_race_session_id_fkey"
            columns: ["race_session_id"]
            isOneToOne: false
            referencedRelation: "race_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_max_speed_team_season_driver_id_fkey"
            columns: ["team_season_driver_id"]
            isOneToOne: false
            referencedRelation: "team_season_drivers"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  ttt: {
    Tables: {
      championships: {
        Row: {
          code: string
          created_at: string
          id: number
          is_active: boolean
          results_available: boolean
          name: string
        }
        Insert: {
          code?: string
          created_at?: string
          id?: number
          is_active?: boolean
          results_available?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          is_active?: boolean
          results_available?: boolean
          name?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          created_at: string
          id: string
          level_id: number
          status: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level_id: number
          status: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level_id?: number
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      levels: {
        Row: {
          championship_id: number | null
          codename: string
          created_at: string
          id: number
          is_active: boolean
          time_limit: number
        }
        Insert: {
          championship_id?: number | null
          codename: string
          created_at?: string
          id?: number
          is_active?: boolean
          time_limit: number
        }
        Update: {
          championship_id?: number | null
          codename?: string
          created_at?: string
          id?: number
          is_active?: boolean
          time_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_championship"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          }
        ]
      }
      moves: {
        Row: {
          answer: string | null
          coordinates: number[] | null
          created_at: string
          id: string
          player_id: string
          room_id: string
          status: Database["public"]["Enums"]["moves_status"]
        }
        Insert: {
          answer?: string | null
          coordinates?: number[] | null
          created_at?: string
          id?: string
          player_id?: string
          room_id: string
          status?: Database["public"]["Enums"]["moves_status"]
        }
        Update: {
          answer?: string | null
          coordinates?: number[] | null
          created_at?: string
          id?: string
          player_id?: string
          room_id?: string
          status?: Database["public"]["Enums"]["moves_status"]
        }
        Relationships: [
          {
            foreignKeyName: "moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          competition_id: string
          created_at: string
          player_id: string
          ready: boolean
          score: number
          simbol: string
          updated_at: string
          username: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string
          player_id: string
          ready?: boolean
          score?: number
          simbol: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string
          player_id?: string
          ready?: boolean
          score?: number
          simbol?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          last_modified_at: string
          level: number
          position: Database["public"]["Enums"]["question_position"]
          type: Database["public"]["Enums"]["question_type"]
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          level: number
          position?: Database["public"]["Enums"]["question_position"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          last_modified_at?: string
          level?: number
          position?: Database["public"]["Enums"]["question_position"]
          type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_level_fkey"
            columns: ["level"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          }
        ]
      }
      queue: {
        Row: {
          competition_id: string | null
          created_at: string
          id: string
          level_id: number
        }
        Insert: {
          competition_id?: string | null
          created_at?: string
          id?: string
          level_id: number
        }
        Update: {
          competition_id?: string | null
          created_at?: string
          id?: string
          level_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "queue_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          }
        ]
      }
      queue_friend: {
        Row: {
          code: string | null
          competition_id: string | null
          created_at: string
          id: string
          level_id: number
        }
        Insert: {
          code?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          level_id: number
        }
        Update: {
          code?: string | null
          competition_id?: string | null
          created_at?: string
          id?: string
          level_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "queue_friend_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_friend_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_friend_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          }
        ]
      }
      rooms: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          questions: number[] | null
          status: Database["ttt"]["Enums"]["room_status"] | null
          turn: string
          winner: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          questions?: number[] | null
          status?: Database["ttt"]["Enums"]["room_status"] | null
          turn: string
          winner?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          questions?: number[] | null
          status?: Database["ttt"]["Enums"]["room_status"] | null
          turn?: string
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_turn_fkey"
            columns: ["turn"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_winner_fkey"
            columns: ["winner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      view_other_players: {
        Row: {
          competition_id: string | null
          created_at: string | null
          player_id: string | null
          ready: boolean | null
          score: number | null
          simbol: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      check_answer: {
        Args: {
          question_id1: number
          question_id2: number
          pilot_id: number
        }
        Returns: boolean
      }
      generate_answer_ttt: {
        Args: {
          question1_id: number
          question2_id: number
        }
        Returns: number
      }
      generate_tic_tac_toe_board: {
        Args: {
          level_id: number
        }
        Returns: unknown
      }
      player_ready: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_player_ready_status: {
        Args: {
          competition_id_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      question_type:
      | "TEAM"
      | "WIN"
      | "RACES"
      | "POLE"
      | "PODIUMS"
      | "F2_CHAMPION"
      | "NATION"
      | "NUMBER"
      | "WORLD_CHAMPION"
      room_status: "WAITING" | "ONGOING" | "FINISHED" | "ERROR" | "SKIPPED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  dashboard: {
    Tables: {
      roles: {
        Row: {
          id: string
          created_at: string
          money: boolean
          read_api: boolean
          dmi_api: boolean
          read_result: boolean
          dmi_result: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          money: boolean
          read_api: boolean
          dmi_api: boolean
          read_result: boolean
          dmi_result: boolean
        }
        Update: {
          id?: string
          created_at?: string
          money?: boolean
          read_api?: boolean
          dmi_api?: boolean
          read_result?: boolean
          dmi_result?: boolean
        }
        Relationships: []
      }
      user: {
        Row: {
          id: string
          created_at: string
          dark_mode: boolean
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          dark_mode: boolean
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          dark_mode?: boolean
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      sync_log: {
        Row: {
          id: number
          code: string
          description: string
          record_type: string
          record_id: string
          json_object: Json
          sync_type: Database["dashboard"]["Enums"]["sync_type"]
          sync_status: Database["dashboard"]["Enums"]["sync_status"]
          error_description: string | null
        }
        Insert: {
          id?: number
          code: string
          description: string
          record_type: string
          record_id: string
          json_object: Json
          sync_type: Database["dashboard"]["Enums"]["sync_type"]
          sync_status: Database["dashboard"]["Enums"]["sync_status"]
          error_description?: string | null
        }
        Update: {
          id?: number
          code?: string
          description?: string
          record_type?: string
          record_id?: string
          json_object?: Json
          sync_type?: Database["dashboard"]["Enums"]["sync_type"]
          sync_status?: Database["dashboard"]["Enums"]["sync_status"]
          error_description?: string | null
        }
        Relationships: []
      }
      queue_log: {
        Row: {
          id: string
          created_at: string
          queue_id: string
          log_type: Database["dashboard"]["Enums"]["log_status"]
          error_message: string | null
          error_stack: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          queue_id: string
          log_type: Database["dashboard"]["Enums"]["log_status"]
          error_message?: string | null
          error_stack?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          queue_id?: string
          log_type?: Database["dashboard"]["Enums"]["log_status"]
          error_message?: string | null
          error_stack?: string | null
        }
        Relationships: []
      }
      process_queue: {
        Row: {
          id: string
          created_at: string
          interface_type: Database["dashboard"]["Enums"]["queue_interface_type"] | null
          interval_minutes: number | null
          last_run: string | null
          active: boolean | null
          endpoint: string
          championship: string | null
          championship_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          interface_type?: Database["dashboard"]["Enums"]["queue_interface_type"] | null
          interval_minutes?: number | null
          last_run?: string | null
          active?: boolean | null
          endpoint?: string | null
          championship?: string | null
          championship_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          interface_type?: Database["dashboard"]["Enums"]["queue_interface_type"] | null
          interval_minutes?: number | null
          last_run?: string | null
          active?: boolean | null
          endpoint?: string | null
          championship?: string | null
          championship_id?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          id: string
          transaction_date: string
          amount: number
          description: string
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_date: string
          amount: number
          description: string
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_date?: string
          amount?: number
          description?: string
          category_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      financial_categories: {
        Row: {
          id: string
          name: string
          financial_transaction_type: Database["dashboard"]["Enums"]["financial_transaction_type"]
          created_at: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          financial_transaction_type: Database["dashboard"]["Enums"]["financial_transaction_type"]
          created_at?: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          financial_transaction_type?: Database["dashboard"]["Enums"]["financial_transaction_type"]
          created_at?: string
          description?: string | null
        }
        Relationships: []
      }

    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      financial_transaction_type: 'income' | 'expense'
      queue_interface_type: "pulselive_result" | "pulselive_session"
      log_type: "sync" | "job_queue"
      sync_type: "insert" | "modify" | "delete"
      sync_status: "pending" | "completed" | "error"
      log_status: "ERROR" | "UPDATED" | "NO_CHANGES"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
    Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
    Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database["public"]["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database["public"]["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
