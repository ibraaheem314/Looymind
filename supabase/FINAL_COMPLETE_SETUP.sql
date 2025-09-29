-- ============================================
-- SCRIPT SQL FINAL COMPLET - LOOYMIND
-- ============================================
-- Script de configuration complète de la base de données
-- À exécuter dans Supabase SQL Editor (remplace tout)

-- ÉTAPE 1: SUPPRIMER TOUTES LES TABLES EXISTANTES (RESET COMPLET)
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS content_flags CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ÉTAPE 2: SUPPRIMER LE BUCKET DE STOCKAGE S'IL EXISTE
DELETE FROM storage.objects WHERE bucket_id = 'looymind-assets';
DELETE FROM storage.buckets WHERE id = 'looymind-assets';

-- ============================================
-- CRÉATION DES TABLES
-- ============================================

-- 1. TABLE PROFILES (UTILISATEURS)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  full_name VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  location VARCHAR(255),
  current_position VARCHAR(200),
  company VARCHAR(200),
  phone VARCHAR(20),
  experience_level VARCHAR(20) DEFAULT 'debutant' CHECK (experience_level IN ('debutant', 'intermediaire', 'avance', 'expert')),
  skills TEXT[],
  interests TEXT[],
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE ARTICLES
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 3. TABLE PROJECTS
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'paused')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  members_count INTEGER DEFAULT 1,
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE CHALLENGES
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prize_xof INTEGER DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  requirements TEXT,
  evaluation_criteria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE SUBMISSIONS
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  score DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- 6. TABLE COMMENTS
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('article', 'project')),
  entity_id UUID NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLE COMMENT_LIKES
CREATE TABLE comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 8. TABLE REPORTS (SIGNALEMENTS)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('article', 'project', 'comment')),
  entity_id UUID NOT NULL,
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id UUID REFERENCES auth.users(id),
  moderator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLE CONTENT_FLAGS (MODÉRATION AUTOMATIQUE)
CREATE TABLE content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('article', 'project', 'comment')),
  entity_id UUID NOT NULL,
  flag_type VARCHAR(50) NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0,
  auto_flagged BOOLEAN DEFAULT true,
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTIVATION DE RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLITIQUES RLS - PROFILES
-- ============================================

-- Tout le monde peut voir les profils
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

-- Les utilisateurs authentifiés peuvent créer leur profil
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = id
  );

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Les utilisateurs peuvent supprimer leur propre profil
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- ============================================
-- POLITIQUES RLS - ARTICLES
-- ============================================

-- Tout le monde peut voir les articles publiés
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

-- Les utilisateurs authentifiés peuvent créer des articles
CREATE POLICY "Authenticated users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Les auteurs peuvent modifier leurs articles
CREATE POLICY "Authors can update their articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Les auteurs peuvent supprimer leurs articles
CREATE POLICY "Authors can delete their articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- POLITIQUES RLS - PROJECTS
-- ============================================

-- Tout le monde peut voir les projets
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Les utilisateurs authentifiés peuvent créer des projets
CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Les auteurs peuvent modifier leurs projets
CREATE POLICY "Authors can update their projects" ON projects
  FOR UPDATE USING (auth.uid() = author_id);

-- Les auteurs peuvent supprimer leurs projets
CREATE POLICY "Authors can delete their projects" ON projects
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- POLITIQUES RLS - CHALLENGES
-- ============================================

-- Tout le monde peut voir les challenges actifs
CREATE POLICY "Anyone can view active challenges" ON challenges
  FOR SELECT USING (status = 'active' OR auth.uid() = author_id);

-- Les utilisateurs authentifiés peuvent créer des challenges
CREATE POLICY "Authenticated users can create challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Les auteurs peuvent modifier leurs challenges
CREATE POLICY "Authors can update their challenges" ON challenges
  FOR UPDATE USING (auth.uid() = author_id);

-- Les auteurs peuvent supprimer leurs challenges
CREATE POLICY "Authors can delete their challenges" ON challenges
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- POLITIQUES RLS - SUBMISSIONS
-- ============================================

-- Les utilisateurs peuvent voir leurs propres soumissions
CREATE POLICY "Users can view their own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des soumissions
CREATE POLICY "Users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs soumissions
CREATE POLICY "Users can update their submissions" ON submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- POLITIQUES RLS - COMMENTS
-- ============================================

-- Tout le monde peut voir les commentaires
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Les utilisateurs authentifiés peuvent créer des commentaires
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Les auteurs peuvent modifier leurs commentaires
CREATE POLICY "Authors can update their comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Les auteurs peuvent supprimer leurs commentaires
CREATE POLICY "Authors can delete their comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================
-- POLITIQUES RLS - COMMENT_LIKES
-- ============================================

-- Les utilisateurs peuvent voir tous les likes
CREATE POLICY "Anyone can view comment likes" ON comment_likes
  FOR SELECT USING (true);

-- Les utilisateurs peuvent liker des commentaires
CREATE POLICY "Users can like comments" ON comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs likes
CREATE POLICY "Users can remove their likes" ON comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POLITIQUES RLS - REPORTS
-- ============================================

-- Les modérateurs peuvent voir tous les signalements
CREATE POLICY "Moderators can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'admin')
    )
  );

-- Les utilisateurs peuvent créer des signalements
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Les modérateurs peuvent modifier les signalements
CREATE POLICY "Moderators can update reports" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'admin')
    )
  );

-- ============================================
-- POLITIQUES RLS - CONTENT_FLAGS
-- ============================================

-- Seuls les modérateurs peuvent voir les flags
CREATE POLICY "Moderators can view content flags" ON content_flags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('moderator', 'admin')
    )
  );

-- ============================================
-- FONCTIONS ET TRIGGERS
-- ============================================

-- Fonction pour incrémenter les vues d'articles
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET views = views + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour gérer les nouveaux utilisateurs (TRIGGER)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    role,
    experience_level,
    location,
    current_position,
    company,
    github_url,
    linkedin_url,
    website_url,
    phone,
    interests,
    skills
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(NEW.raw_user_meta_data->>'experience_level', 'debutant'),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'current_position', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
    COALESCE(NEW.raw_user_meta_data->>'github_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'linkedin_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'website_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'interests')), '{}'),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills')), '{}')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assigner le trigger à postgres
ALTER FUNCTION handle_new_user() OWNER TO postgres;

-- Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour le compteur de likes des commentaires
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour les likes de commentaires
CREATE TRIGGER update_comment_likes_count_trigger
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Fonction pour mettre à jour le compteur de réponses
CREATE OR REPLACE FUNCTION update_comment_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE comments 
    SET replies_count = replies_count + 1 
    WHERE id = NEW.parent_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE comments 
    SET replies_count = replies_count - 1 
    WHERE id = OLD.parent_id;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour les réponses
CREATE TRIGGER update_comment_replies_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_replies_count();

-- ============================================
-- CONFIGURATION DU STOCKAGE
-- ============================================

-- Créer le bucket pour les assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('looymind-assets', 'looymind-assets', true);

-- Politiques de stockage (corrigé pour être idempotent)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'looymind-assets');

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'looymind-assets' 
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'looymind-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'looymind-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- NOTE: Les données de test seront ajoutées après la création d'utilisateurs réels
-- Pour ajouter des challenges de test, utilisez d'abord l'interface d'inscription
-- pour créer un utilisateur, puis remplacez 'VOTRE_USER_ID' par l'ID réel

-- Exemple de challenges (à décommenter après avoir créé un utilisateur) :
/*
INSERT INTO challenges (title, description, category, difficulty, prize_xof, ends_at, status, author_id) VALUES
('Challenge IA - Prédiction de Prix', 'Développez un modèle de machine learning pour prédire les prix immobiliers à Dakar', 'Intelligence Artificielle', 'intermediate', 500000, NOW() + INTERVAL '30 days', 'active', 'VOTRE_USER_ID'),
('Développement Web - E-commerce', 'Créez une plateforme e-commerce complète avec Next.js et Supabase', 'Développement Web', 'advanced', 750000, NOW() + INTERVAL '45 days', 'active', 'VOTRE_USER_ID'),
('Mobile App - Gestion Financière', 'Développez une application mobile de gestion financière personnelle', 'Mobile', 'beginner', 250000, NOW() + INTERVAL '21 days', 'active', 'VOTRE_USER_ID');
*/

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================

-- Vérifier que toutes les tables ont été créées
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Message de confirmation
SELECT '🎉 Configuration Looymind terminée avec succès ! Toutes les tables, politiques RLS, triggers et fonctions ont été créés.' as status;
