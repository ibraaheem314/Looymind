// Re-export from client files only
export { createClient, supabase } from './supabase-client'

// Re-export types
export type {
  Profile,
  Challenge,
  Submission,
  Project,
  Resource,
  Mentor,
  MentorRequest,
  Article,
  Comment,
  CommentLike
} from './supabase-client'
