-- =====================================================
-- LOOYMIND PLATFORM - COMPLETE DATABASE SCHEMA
-- Clean version without special characters
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STORAGE BUCKETS CONFIGURATION
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('datasets', 'datasets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  first_name text,
  last_name text,
  display_name text NOT NULL,
  bio text,
  avatar_url text,
  github_url text,
  linkedin_url text,
  website_url text,
  phone text,
  location text,
  current_position text,
  company text,
  experience_level text CHECK (experience_level IN ('debutant', 'intermediaire', 'avance', 'expert')) DEFAULT 'debutant',
  role text CHECK (role IN ('member', 'mentor', 'org', 'admin')) DEFAULT 'member',
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  points integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  category text NOT NULL,
  metric text NOT NULL,
  dataset_url text NOT NULL,
  rules text,
  prize_xof integer DEFAULT 0,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz NOT NULL,
  status text CHECK (status IN ('a_venir', 'en_cours', 'termine')) DEFAULT 'a_venir',
  author_id uuid REFERENCES profiles(id),
  image_url text,
  max_participants integer,
  participants_count integer DEFAULT 0,
  submissions_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Challenge submissions table
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  submission_file_url text NOT NULL,
  score numeric(10,6),
  rank integer,
  is_public boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id, created_at)
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  best_score numeric(10,6) NOT NULL,
  best_submission_id uuid REFERENCES challenge_submissions(id),
  rank integer,
  submissions_count integer DEFAULT 0,
  last_submission_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  reading_time integer,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  cover_image_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  github_url text,
  demo_url text,
  dataset_url text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  difficulty text CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  views_count integer DEFAULT 0,
  stars_count integer DEFAULT 0,
  forks_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  resource_type text CHECK (resource_type IN ('tutorial', 'documentation', 'video', 'dataset', 'tool', 'book')) NOT NULL,
  url text NOT NULL,
  cover_image_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')),
  is_free boolean DEFAULT true,
  author_id uuid REFERENCES profiles(id),
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  is_edited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (
    (article_id IS NOT NULL AND project_id IS NULL) OR
    (article_id IS NULL AND project_id IS NOT NULL)
  )
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES resources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK (
    (article_id IS NOT NULL AND project_id IS NULL AND comment_id IS NULL AND resource_id IS NULL) OR
    (article_id IS NULL AND project_id IS NOT NULL AND comment_id IS NULL AND resource_id IS NULL) OR
    (article_id IS NULL AND project_id IS NULL AND comment_id IS NOT NULL AND resource_id IS NULL) OR
    (article_id IS NULL AND project_id IS NULL AND comment_id IS NULL AND resource_id IS NOT NULL)
  ),
  UNIQUE(user_id, article_id, project_id, comment_id, resource_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  challenges_participated integer DEFAULT 0,
  challenges_won integer DEFAULT 0,
  articles_published integer DEFAULT 0,
  projects_published integer DEFAULT 0,
  comments_posted integer DEFAULT 0,
  total_views integer DEFAULT 0,
  total_likes integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  rank_position integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_ends_at ON challenges(ends_at);

CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON challenge_submissions(score DESC);

CREATE INDEX IF NOT EXISTS idx_leaderboards_challenge ON leaderboards(challenge_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON leaderboards(rank);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);

CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- User sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions" 
ON user_sessions FOR SELECT 
USING (auth.uid() = user_id);

-- Challenges policies
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
CREATE POLICY "Challenges are viewable by everyone" 
ON challenges FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create challenges" ON challenges;
CREATE POLICY "Authenticated users can create challenges" 
ON challenges FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own challenges" ON challenges;
CREATE POLICY "Users can update own challenges" 
ON challenges FOR UPDATE 
USING (auth.uid() = author_id);

-- Challenge submissions policies
DROP POLICY IF EXISTS "Public submissions are viewable" ON challenge_submissions;
CREATE POLICY "Public submissions are viewable" 
ON challenge_submissions FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create submissions" ON challenge_submissions;
CREATE POLICY "Users can create submissions" 
ON challenge_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Leaderboards policies
DROP POLICY IF EXISTS "Leaderboards are viewable by everyone" ON leaderboards;
CREATE POLICY "Leaderboards are viewable by everyone" 
ON leaderboards FOR SELECT 
USING (true);

-- Articles policies
DROP POLICY IF EXISTS "Published articles viewable by all" ON articles;
CREATE POLICY "Published articles viewable by all" 
ON articles FOR SELECT 
USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can create articles" ON articles;
CREATE POLICY "Users can create articles" 
ON articles FOR INSERT 
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own articles" ON articles;
CREATE POLICY "Users can update own articles" 
ON articles FOR UPDATE 
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own articles" ON articles;
CREATE POLICY "Users can delete own articles" 
ON articles FOR DELETE 
USING (auth.uid() = author_id);

-- Projects policies
DROP POLICY IF EXISTS "Published projects viewable by all" ON projects;
CREATE POLICY "Published projects viewable by all" 
ON projects FOR SELECT 
USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" 
ON projects FOR DELETE 
USING (auth.uid() = author_id);

-- Resources policies
DROP POLICY IF EXISTS "Resources viewable by everyone" ON resources;
CREATE POLICY "Resources viewable by everyone" 
ON resources FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create resources" ON resources;
CREATE POLICY "Authenticated users can create resources" 
ON resources FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Comments policies
DROP POLICY IF EXISTS "Comments viewable by everyone" ON comments;
CREATE POLICY "Comments viewable by everyone" 
ON comments FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Authenticated users can create comments" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE 
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
USING (auth.uid() = author_id);

-- Likes policies
DROP POLICY IF EXISTS "Likes viewable by everyone" ON likes;
CREATE POLICY "Likes viewable by everyone" 
ON likes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create own likes" ON likes;
CREATE POLICY "Users can create own likes" 
ON likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON likes;
CREATE POLICY "Users can delete own likes" 
ON likes FOR DELETE 
USING (auth.uid() = user_id);

-- Follows policies
DROP POLICY IF EXISTS "Follows viewable by everyone" ON follows;
CREATE POLICY "Follows viewable by everyone" 
ON follows FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create own follows" ON follows;
CREATE POLICY "Users can create own follows" 
ON follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can delete own follows" ON follows;
CREATE POLICY "Users can delete own follows" 
ON follows FOR DELETE 
USING (auth.uid() = follower_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- User stats policies
DROP POLICY IF EXISTS "User stats viewable by everyone" ON user_stats;
CREATE POLICY "User stats viewable by everyone" 
ON user_stats FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;
CREATE POLICY "Users can update own stats" 
ON user_stats FOR UPDATE 
USING (auth.uid() = user_id);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, full_name, first_name, last_name, role, experience_level, location, current_position, company, github_url, linkedin_url, website_url, phone, bio, skills, interests)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(NEW.raw_user_meta_data->>'experience_level', 'debutant'),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'current_position', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'github_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'linkedin_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'website_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'skills' IS NOT NULL 
        THEN ARRAY(SELECT jsonb_array_elements_text((NEW.raw_user_meta_data->>'skills')::jsonb))
        ELSE '{}'::text[]
      END,
      '{}'::text[]
    ),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'interests' IS NOT NULL 
        THEN ARRAY(SELECT jsonb_array_elements_text((NEW.raw_user_meta_data->>'interests')::jsonb))
        ELSE '{}'::text[]
      END,
      '{}'::text[]
    )
  );

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- =====================================================
-- END OF SCHEMA
-- =====================================================