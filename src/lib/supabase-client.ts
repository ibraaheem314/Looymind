import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// Legacy client for compatibility
export const supabase = createClientComponentClient<Database>()

// Export specific types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Challenge = Database['public']['Tables']['challenges']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Mentor = Database['public']['Tables']['mentors']['Row']
export type MentorRequest = Database['public']['Tables']['mentor_requests']['Row']
