// Re-export from client and server files
export { createClient, supabase } from './supabase-client'
export { createServerClient } from './supabase-server'

// Re-export types
export type {
  Profile,
  Challenge,
  Submission,
  Project,
  Resource,
  Mentor,
  MentorRequest
} from './supabase-client'
