-- =====================================================
-- SCRIPT SQL COMPLET - LOOYMIND PLATFORM
-- Intégration des anciens fichiers + nouvelles fonctionnalités
-- =====================================================

-- Nettoyage complet
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CONFIGURATION STORAGE SUPABASE
-- =====================================================

-- Bucket pour les datasets (lecture publique)
INSERT INTO storage.buckets (id, name, public) VALUES ('datasets', 'datasets', true);

-- Bucket pour les soumissions (lecture privée)
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);

-- Bucket pour les avatars (lecture publique)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Bucket pour les images de projets (lecture publique)
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true);

-- Bucket pour les images de ressources (lecture publique)
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- =====================================================
-- 2. TABLES PRINCIPALES
-- =====================================================

-- Table des profils utilisateurs (version complète)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
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
  experience_level text CHECK (experience_level IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  role text CHECK (role IN ('member', 'mentor', 'org', 'admin')) DEFAULT 'member',
  skills text[],
  interests text[],
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des défis
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  category text NOT NULL,
  metric text NOT NULL, -- e.g. rmse, f1, map@k
  dataset_url text NOT NULL,
  rules text,
  prize_xof integer DEFAULT 0,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz NOT NULL,
  status text CHECK (status IN ('a_venir', 'en_cours', 'termine')) DEFAULT 'a_venir',
  author_id uuid REFERENCES profiles(id),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des soumissions
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  description text,
  file_url text NOT NULL, -- storage URL (bucket supabase)
  score double precision,
  rank integer,
  status text CHECK (status IN ('pending', 'scored', 'error')) DEFAULT 'pending',
  error_msg text,
  created_at timestamptz DEFAULT now()
);

-- Table des projets
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  tech_stack text[],
  github_url text,
  demo_url text,
  status text CHECK (status IN ('planning', 'in_progress', 'completed', 'paused')) DEFAULT 'planning',
  category text NOT NULL,
  founder_id uuid REFERENCES profiles(id),
  image_url text,
  members integer DEFAULT 1,
  stars integer DEFAULT 0,
  forks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des membres de projets
CREATE TABLE public.project_members (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'contributeur',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- Table des mentors
CREATE TABLE public.mentors (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  domains text[],
  availability text,
  description text,
  experience_years integer,
  created_at timestamptz DEFAULT now()
);

-- Table des demandes de mentorat
CREATE TABLE public.mentor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES profiles(id),
  mentor_id uuid REFERENCES mentors(user_id),
  goal text NOT NULL,
  level text CHECK (level IN ('debutant', 'intermediaire', 'avance')),
  domains text[],
  status text CHECK (status IN ('open', 'matched', 'completed', 'cancelled')) DEFAULT 'open',
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des ressources
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  type text CHECK (type IN ('course', 'article', 'tool', 'dataset', 'video', 'book')) NOT NULL,
  category text NOT NULL,
  difficulty text CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  author_id uuid REFERENCES profiles(id),
  author_name text,
  url text NOT NULL,
  image_url text,
  rating double precision DEFAULT 0,
  downloads integer DEFAULT 0,
  duration text,
  tags text[],
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des articles (nouvelle fonctionnalité)
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES profiles(id),
  category text,
  tags text[],
  featured_image text,
  status text CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des commentaires (nouvelle fonctionnalité)
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id),
  entity_type text NOT NULL, -- 'project', 'article', 'challenge'
  entity_id uuid NOT NULL,
  parent_id uuid REFERENCES comments(id),
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des likes de commentaires
CREATE TABLE public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Table des signalements (modération)
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Table des flags de contenu
CREATE TABLE public.content_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  flag_type text NOT NULL,
  severity text CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. INDEX POUR LES PERFORMANCES
-- =====================================================

CREATE INDEX submissions_challenge_score_idx ON submissions (challenge_id, score DESC);
CREATE INDEX submissions_user_created_idx ON submissions (user_id, created_at DESC);
CREATE INDEX projects_status_created_idx ON projects (status, created_at DESC);
CREATE INDEX resources_type_category_idx ON resources (type, category);
CREATE INDEX mentor_requests_status_created_idx ON mentor_requests (status, created_at DESC);
CREATE INDEX articles_status_created_idx ON articles (status, created_at DESC);
CREATE INDEX comments_entity_idx ON comments (entity_type, entity_id);
CREATE INDEX reports_status_created_idx ON reports (status, created_at DESC);

-- =====================================================
-- 4. RLS (ROW LEVEL SECURITY)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. POLITIQUES RLS POUR PROFILES
-- =====================================================

CREATE POLICY "Profils visibles par tous" ON profiles FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent modifier leur profil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Utilisateurs peuvent créer leur profil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 6. POLITIQUES RLS POUR CHALLENGES
-- =====================================================

CREATE POLICY "Défis visibles par tous" ON challenges FOR SELECT USING (true);
CREATE POLICY "Seuls les admins/orgs peuvent créer des défis" ON challenges 
  FOR INSERT WITH CHECK (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'org')));
CREATE POLICY "Créateurs peuvent modifier leurs défis" ON challenges 
  FOR UPDATE USING (author_id = auth.uid() OR EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 7. POLITIQUES RLS POUR SUBMISSIONS
-- =====================================================

CREATE POLICY "Utilisateurs voient leurs soumissions" ON submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Utilisateurs peuvent créer des soumissions" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins voient toutes les soumissions" ON submissions FOR SELECT USING (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- 8. POLITIQUES RLS POUR PROJECTS
-- =====================================================

CREATE POLICY "Projets visibles par tous" ON projects FOR SELECT USING (true);
CREATE POLICY "Utilisateurs connectés peuvent créer des projets" ON projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Fondateurs peuvent modifier leurs projets" ON projects FOR UPDATE USING (founder_id = auth.uid());

-- =====================================================
-- 9. POLITIQUES RLS POUR ARTICLES
-- =====================================================

CREATE POLICY "Articles publiés visibles par tous" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Auteurs voient leurs articles" ON articles FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Utilisateurs connectés peuvent créer des articles" ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auteurs peuvent modifier leurs articles" ON articles FOR UPDATE USING (author_id = auth.uid());

-- =====================================================
-- 10. POLITIQUES RLS POUR COMMENTS
-- =====================================================

CREATE POLICY "Commentaires visibles par tous" ON comments FOR SELECT USING (true);
CREATE POLICY "Utilisateurs connectés peuvent créer des commentaires" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auteurs peuvent modifier leurs commentaires" ON comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Auteurs peuvent supprimer leurs commentaires" ON comments FOR DELETE USING (author_id = auth.uid());

-- =====================================================
-- 11. POLITIQUES RLS POUR STORAGE
-- =====================================================

-- Politiques pour le bucket datasets
CREATE POLICY "Datasets sont visibles par tous" ON storage.objects
  FOR SELECT USING (bucket_id = 'datasets');

CREATE POLICY "Seuls les admins/orgs peuvent uploader des datasets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'datasets' 
    AND EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'org')
    )
  );

-- Politiques pour le bucket submissions
CREATE POLICY "Utilisateurs peuvent lire leurs soumissions" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'submissions' 
    AND (
      auth.uid()::text = (storage.foldername(name))[2]
      OR EXISTS(
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
      )
    )
  );

CREATE POLICY "Utilisateurs peuvent uploader leurs soumissions" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'submissions' 
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- Politiques pour le bucket avatars
CREATE POLICY "Avatars sont visibles par tous" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Utilisateurs peuvent uploader leur avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Utilisateurs peuvent modifier leur avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- 12. FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction helper pour extraire les dossiers du chemin
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[] LANGUAGE sql AS $$
  SELECT string_to_array(name, '/')
$$;

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

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

-- Fonction pour mettre à jour le classement
CREATE OR REPLACE FUNCTION update_leaderboard(challenge_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE submissions s
  SET rank = t.rnk
  FROM (
    SELECT id, row_number() OVER (ORDER BY score ASC) AS rnk
    FROM submissions
    WHERE challenge_id = challenge_uuid AND status = 'scored'
  ) t
  WHERE s.id = t.id AND s.challenge_id = challenge_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer le score RMSE (exemple)
CREATE OR REPLACE FUNCTION calculate_rmse_score(submission_uuid uuid, predictions jsonb, ground_truth jsonb)
RETURNS double precision AS $$
DECLARE
  mse double precision := 0;
  count_rows integer := 0;
  pred_val double precision;
  true_val double precision;
  key text;
BEGIN
  FOR key IN SELECT jsonb_object_keys(predictions)
  LOOP
    pred_val := (predictions->key)::double precision;
    true_val := (ground_truth->key)::double precision;
    mse := mse + power(pred_val - true_val, 2);
    count_rows := count_rows + 1;
  END LOOP;
  
  IF count_rows = 0 THEN
    RETURN null;
  END IF;
  
  RETURN sqrt(mse / count_rows);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour incrémenter les vues d'articles
CREATE OR REPLACE FUNCTION increment_article_views(article_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE articles SET views = views + 1 WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. DONNÉES DE TEST (COMMENTÉES POUR ÉVITER LES ERREURS)
-- =====================================================

-- Note: Les données de test sont commentées pour éviter les erreurs de clés étrangères
-- Vous pouvez les décommenter après avoir créé un utilisateur réel

/*
-- Exemple de défi (nécessite un utilisateur existant)
INSERT INTO challenges (title, slug, description, category, metric, dataset_url, ends_at, author_id) VALUES
('Prédiction des prix immobiliers', 'prediction-prix-immobiliers', 'Prédire les prix des maisons à Dakar', 'Machine Learning', 'RMSE', 'https://example.com/dataset.csv', NOW() + INTERVAL '30 days', '00000000-0000-0000-0000-000000000000');
*/

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
