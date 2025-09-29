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
      profiles: {
        Row: {
          id: string
          display_name: string
          role: 'member' | 'mentor' | 'org' | 'admin'
          location: string | null
          bio: string | null
          skills: string[] | null
          github: string | null
          linkedin: string | null
          avatar_url: string | null
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'member' | 'mentor' | 'org' | 'admin'
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          github?: string | null
          linkedin?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'member' | 'mentor' | 'org' | 'admin'
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          github?: string | null
          linkedin?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          difficulty: 'debutant' | 'intermediaire' | 'avance'
          category: string
          metric: string
          dataset_url: string
          rules: string | null
          prize_xof: number
          starts_at: string
          ends_at: string
          status: 'a_venir' | 'en_cours' | 'termine'
          org_id: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          difficulty?: 'debutant' | 'intermediaire' | 'avance'
          category: string
          metric: string
          dataset_url: string
          rules?: string | null
          prize_xof?: number
          starts_at?: string
          ends_at: string
          status?: 'a_venir' | 'en_cours' | 'termine'
          org_id?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          difficulty?: 'debutant' | 'intermediaire' | 'avance'
          category?: string
          metric?: string
          dataset_url?: string
          rules?: string | null
          prize_xof?: number
          starts_at?: string
          ends_at?: string
          status?: 'a_venir' | 'en_cours' | 'termine'
          org_id?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          file_url: string
          score: number | null
          rank: number | null
          status: 'pending' | 'scored' | 'error'
          error_msg: string | null
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          file_url: string
          score?: number | null
          rank?: number | null
          status?: 'pending' | 'scored' | 'error'
          error_msg?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          file_url?: string
          score?: number | null
          rank?: number | null
          status?: 'pending' | 'scored' | 'error'
          error_msg?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          tech_stack: string[] | null
          github_url: string | null
          demo_url: string | null
          status: 'planning' | 'in_progress' | 'completed' | 'paused'
          category: string
          founder_id: string | null
          image_url: string | null
          members: number
          stars: number
          forks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          tech_stack?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          status?: 'planning' | 'in_progress' | 'completed' | 'paused'
          category: string
          founder_id?: string | null
          image_url?: string | null
          members?: number
          stars?: number
          forks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          tech_stack?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          status?: 'planning' | 'in_progress' | 'completed' | 'paused'
          category?: string
          founder_id?: string | null
          image_url?: string | null
          members?: number
          stars?: number
          forks?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_members: {
        Row: {
          project_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      mentors: {
        Row: {
          user_id: string
          domains: string[] | null
          availability: string | null
          description: string | null
          experience_years: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          domains?: string[] | null
          availability?: string | null
          description?: string | null
          experience_years?: number | null
          created_at?: string
        }
        Update: {
          user_id?: string
          domains?: string[] | null
          availability?: string | null
          description?: string | null
          experience_years?: number | null
          created_at?: string
        }
      }
      mentor_requests: {
        Row: {
          id: string
          requester_id: string | null
          mentor_id: string | null
          goal: string
          level: 'debutant' | 'intermediaire' | 'avance' | null
          domains: string[] | null
          status: 'open' | 'matched' | 'completed' | 'cancelled'
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id?: string | null
          mentor_id?: string | null
          goal: string
          level?: 'debutant' | 'intermediaire' | 'avance' | null
          domains?: string[] | null
          status?: 'open' | 'matched' | 'completed' | 'cancelled'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string | null
          mentor_id?: string | null
          goal?: string
          level?: 'debutant' | 'intermediaire' | 'avance' | null
          domains?: string[] | null
          status?: 'open' | 'matched' | 'completed' | 'cancelled'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          type: 'course' | 'article' | 'tool' | 'dataset' | 'video' | 'book'
          category: string
          difficulty: 'debutant' | 'intermediaire' | 'avance'
          author_id: string | null
          author_name: string | null
          url: string
          image_url: string | null
          rating: number
          downloads: number
          duration: string | null
          tags: string[] | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          type: 'course' | 'article' | 'tool' | 'dataset' | 'video' | 'book'
          category: string
          difficulty?: 'debutant' | 'intermediaire' | 'avance'
          author_id?: string | null
          author_name?: string | null
          url: string
          image_url?: string | null
          rating?: number
          downloads?: number
          duration?: string | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          type?: 'course' | 'article' | 'tool' | 'dataset' | 'video' | 'book'
          category?: string
          difficulty?: 'debutant' | 'intermediaire' | 'avance'
          author_id?: string | null
          author_name?: string | null
          url?: string
          image_url?: string | null
          rating?: number
          downloads?: number
          duration?: string | null
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          slug: string
          author_id: string
          status: 'draft' | 'published' | 'archived'
          featured: boolean
          tags: string[]
          category: string
          image_url: string | null
          views: number
          likes: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          slug: string
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          tags?: string[]
          category: string
          image_url?: string | null
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          slug?: string
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          tags?: string[]
          category?: string
          image_url?: string | null
          views?: number
          likes?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          content: string
          entity_type: 'project' | 'article' | 'challenge'
          entity_id: string
          parent_id: string | null
          author_id: string
          author_name: string | null
          author_avatar: string | null
          author_role: string | null
          likes: number
          replies_count: number
          status: 'published' | 'hidden' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          entity_type: 'project' | 'article' | 'challenge'
          entity_id: string
          parent_id?: string | null
          author_id: string
          author_name?: string | null
          author_avatar?: string | null
          author_role?: string | null
          likes?: number
          replies_count?: number
          status?: 'published' | 'hidden' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          entity_type?: 'project' | 'article' | 'challenge'
          entity_id?: string
          parent_id?: string | null
          author_id?: string
          author_name?: string | null
          author_avatar?: string | null
          author_role?: string | null
          likes?: number
          replies_count?: number
          status?: 'published' | 'hidden' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_leaderboard: {
        Args: {
          challenge_uuid: string
        }
        Returns: undefined
      }
      calculate_rmse_score: {
        Args: {
          submission_uuid: string
          predictions: Json
          ground_truth: Json
        }
        Returns: number
      }
      increment_article_views: {
        Args: {
          article_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
