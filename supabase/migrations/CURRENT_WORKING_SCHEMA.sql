-- ============================================================================
-- LOOYMIND - SCHÉMA DE BASE DE DONNÉES ACTUEL ET FONCTIONNEL
-- Version consolidée - Octobre 2024
-- ============================================================================
-- Ce fichier contient tous les schémas SQL actuellement en production
-- Exécuter dans l'ordre pour une nouvelle installation
-- ============================================================================

-- ============================================================================
-- 1. PROFILES (Base utilisateurs)
-- ============================================================================

-- La table profiles est automatiquement créée par le trigger on_auth_user_created
-- Pas besoin de la créer manuellement si vous utilisez l'authentification Supabase

-- Vérifier/créer la table profiles si nécessaire
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'mentor', 'org', 'admin')),
  experience_level TEXT DEFAULT 'debutant' CHECK (experience_level IN ('debutant', 'intermediaire', 'avance', 'expert')),
  current_position TEXT,
  company TEXT,
  skills TEXT[],
  interests TEXT[],
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. ARTICLES SYSTÈME
-- ============================================================================

-- Table articles
DROP TABLE IF EXISTS public.articles CASCADE;
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour articles
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created ON public.articles(created_at DESC);

-- RLS pour articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Articles are viewable by everyone" ON public.articles;
CREATE POLICY "Articles are viewable by everyone" ON public.articles FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can create articles" ON public.articles;
CREATE POLICY "Users can create articles" ON public.articles FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own articles" ON public.articles;
CREATE POLICY "Users can update own articles" ON public.articles FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own articles" ON public.articles;
CREATE POLICY "Users can delete own articles" ON public.articles FOR DELETE USING (auth.uid() = author_id);

-- Table article_views (vues uniques)
DROP TABLE IF EXISTS public.article_views CASCADE;
CREATE TABLE public.article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, user_id, ip_address)
);

CREATE INDEX IF NOT EXISTS idx_article_views_article ON public.article_views(article_id);

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view article_views" ON public.article_views;
CREATE POLICY "Anyone can view article_views" ON public.article_views FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert article_views" ON public.article_views;
CREATE POLICY "Anyone can insert article_views" ON public.article_views FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 3. SYSTÈME DE LIKES UNIFIÉ (articles, projets, commentaires, ressources)
-- ============================================================================

DROP TABLE IF EXISTS public.likes CASCADE;
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  project_id UUID,  -- Référence ajoutée plus tard avec projects
  comment_id UUID,  -- Référence ajoutée plus tard avec comments
  resource_id UUID, -- Référence ajoutée plus tard avec resources
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id),
  UNIQUE(user_id, project_id),
  UNIQUE(user_id, comment_id),
  UNIQUE(user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_article ON public.likes(article_id);
CREATE INDEX IF NOT EXISTS idx_likes_project ON public.likes(project_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all likes" ON public.likes;
CREATE POLICY "Users can view all likes" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own likes" ON public.likes;
CREATE POLICY "Users can insert own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own likes" ON public.likes;
CREATE POLICY "Users can delete own likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Fonction unifiée pour incrémenter les likes
CREATE OR REPLACE FUNCTION public.increment_likes_unified()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si c'est un like sur un article
  IF NEW.article_id IS NOT NULL THEN
    UPDATE public.articles 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.article_id;
  END IF;
  
  -- Si c'est un like sur un projet
  IF NEW.project_id IS NOT NULL THEN
    UPDATE public.projects 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fonction unifiée pour décrémenter les likes
CREATE OR REPLACE FUNCTION public.decrement_likes_unified()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si c'était un like sur un article
  IF OLD.article_id IS NOT NULL THEN
    UPDATE public.articles 
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.article_id;
  END IF;
  
  -- Si c'était un like sur un projet
  IF OLD.project_id IS NOT NULL THEN
    UPDATE public.projects 
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.project_id;
  END IF;
  
  RETURN OLD;
END;
$$;

-- Triggers unifiés pour les likes
DROP TRIGGER IF EXISTS on_likes_inserted ON public.likes;
CREATE TRIGGER on_likes_inserted
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.increment_likes_unified();

DROP TRIGGER IF EXISTS on_likes_deleted ON public.likes;
CREATE TRIGGER on_likes_deleted
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.decrement_likes_unified();

-- Permissions
GRANT EXECUTE ON FUNCTION public.increment_likes_unified() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.decrement_likes_unified() TO authenticated, anon;

-- ============================================================================
-- 4. SYSTÈME DE COMMENTAIRES (articles, projets)
-- ============================================================================

DROP TABLE IF EXISTS public.comments CASCADE;
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  project_id UUID, -- Référence ajoutée plus tard avec projects
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON public.comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- Trigger pour incrémenter comments_count sur articles
CREATE OR REPLACE FUNCTION public.increment_article_comments()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.article_id IS NOT NULL THEN
    UPDATE public.articles 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.article_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_article_comments()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.article_id IS NOT NULL THEN
    UPDATE public.articles 
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.article_id;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_article_comment_created ON public.comments;
CREATE TRIGGER on_article_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_article_comments();

DROP TRIGGER IF EXISTS on_article_comment_deleted ON public.comments;
CREATE TRIGGER on_article_comment_deleted
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.decrement_article_comments();

-- ============================================================================
-- 5. SYSTÈME DE COMPÉTITIONS
-- ============================================================================

DROP TABLE IF EXISTS public.competitions CASCADE;
CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('data-science', 'nlp', 'computer-vision', 'prediction', 'other')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  metric_type TEXT NOT NULL,
  metric_description TEXT,
  dataset_url TEXT,
  dataset_description TEXT,
  rules TEXT,
  prizes TEXT,
  prize_amount DECIMAL(10,2),
  prize_description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  submissions_count INTEGER DEFAULT 0,
  participants_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competitions_slug ON public.competitions(slug);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_created_by ON public.competitions(created_by);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public competitions are viewable" ON public.competitions;
CREATE POLICY "Public competitions are viewable" ON public.competitions FOR SELECT USING (visibility = 'public');

DROP POLICY IF EXISTS "Authenticated users can create competitions" ON public.competitions;
CREATE POLICY "Authenticated users can create competitions" ON public.competitions FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own competitions" ON public.competitions;
CREATE POLICY "Users can update own competitions" ON public.competitions FOR UPDATE USING (auth.uid() = created_by);

GRANT SELECT ON public.competitions TO anon, authenticated;
GRANT ALL ON public.competitions TO authenticated;

-- Table submissions
DROP TABLE IF EXISTS public.submissions CASCADE;
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  score DECIMAL(10,6),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scored', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_competition ON public.submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.submissions(user_id);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own submissions" ON public.submissions;
CREATE POLICY "Users can create own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.submissions TO authenticated;
GRANT INSERT ON public.submissions TO authenticated;

-- Table leaderboard
DROP TABLE IF EXISTS public.leaderboard CASCADE;
CREATE TABLE public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  best_score DECIMAL(10,6) NOT NULL,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_competition ON public.leaderboard(competition_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard(competition_id, rank);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leaderboard is viewable by everyone" ON public.leaderboard;
CREATE POLICY "Leaderboard is viewable by everyone" ON public.leaderboard FOR SELECT USING (true);

GRANT SELECT ON public.leaderboard TO anon, authenticated;

-- Triggers pour competitions
CREATE OR REPLACE FUNCTION public.increment_competition_submissions()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.competitions 
  SET submissions_count = submissions_count + 1 
  WHERE id = NEW.competition_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_competition_submissions()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.competitions 
  SET submissions_count = GREATEST(0, submissions_count - 1)
  WHERE id = OLD.competition_id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_competition_participants()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.competitions 
  SET participants_count = (
    SELECT COUNT(DISTINCT user_id) 
    FROM public.submissions 
    WHERE competition_id = NEW.competition_id
  )
  WHERE id = NEW.competition_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_submission_created ON public.submissions;
CREATE TRIGGER on_submission_created
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.increment_competition_submissions();

DROP TRIGGER IF EXISTS on_submission_deleted ON public.submissions;
CREATE TRIGGER on_submission_deleted
  AFTER DELETE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.decrement_competition_submissions();

DROP TRIGGER IF EXISTS on_submission_participant ON public.submissions;
CREATE TRIGGER on_submission_participant
  AFTER INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.increment_competition_participants();

GRANT EXECUTE ON FUNCTION public.increment_competition_submissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_competition_submissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_competition_participants() TO authenticated;

-- ============================================================================
-- FIN DU SCHÉMA ACTUEL
-- ============================================================================
-- Note: Le système de projets est partiellement implémenté
-- Voir projects_complete_schema.sql pour le schéma complet des projets
-- ============================================================================

