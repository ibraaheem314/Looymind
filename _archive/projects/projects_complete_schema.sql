-- =====================================================
-- SYSTÈME DE PROJETS COMPLET - SCHEMA DATABASE
-- =====================================================
-- Inspiré de GitHub, Dribbble, Behance, Devpost, Product Hunt
-- =====================================================

-- Supprimer les tables si elles existent (pour éviter les conflits)
DROP TABLE IF EXISTS project_submissions CASCADE;
DROP TABLE IF EXISTS project_versions CASCADE;
DROP TABLE IF EXISTS project_comments CASCADE;
DROP TABLE IF EXISTS project_likes CASCADE;
DROP TABLE IF EXISTS project_views CASCADE;
DROP TABLE IF EXISTS project_tags CASCADE;
DROP TABLE IF EXISTS project_technologies CASCADE;
DROP TABLE IF EXISTS project_collaborators CASCADE;
DROP TABLE IF EXISTS project_team_members CASCADE;
DROP TABLE IF EXISTS project_teams CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Table principale des projets
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  
  -- Images et médias
  cover_image_url TEXT,
  gallery_urls TEXT[], -- Array d'URLs d'images
  
  -- Détails du projet
  project_type VARCHAR(50) NOT NULL DEFAULT 'web', -- web, mobile, desktop, ai, data, research, other
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, archived, draft
  visibility VARCHAR(20) NOT NULL DEFAULT 'public', -- public, private, unlisted
  
  -- Dates importantes
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  launched_at TIMESTAMP WITH TIME ZONE,
  
  -- Métadonnées
  featured BOOLEAN DEFAULT FALSE,
  featured_at TIMESTAMP WITH TIME ZONE,
  featured_until TIMESTAMP WITH TIME ZONE,
  
  -- Statistiques (compteurs)
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  collaborators_count INTEGER DEFAULT 0,
  
  -- Liens externes
  live_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  documentation_url TEXT,
  
  -- Auteur et équipe
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_project_type CHECK (project_type IN ('web', 'mobile', 'desktop', 'ai', 'data', 'research', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'archived', 'draft')),
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'unlisted'))
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_projects_author ON projects(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_likes_count ON projects(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_views_count ON projects(views_count DESC);

-- Table des équipes de projets
CREATE TABLE project_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  
  -- Propriétaire de l'équipe
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter la contrainte de clé étrangère pour team_id dans projects
ALTER TABLE projects ADD CONSTRAINT fk_projects_team_id 
  FOREIGN KEY (team_id) REFERENCES project_teams(id) ON DELETE SET NULL;

-- Table des membres d'équipe
CREATE TABLE project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES project_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- owner, admin, member, contributor
  permissions TEXT[], -- Array de permissions spécifiques
  
  -- Dates
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(team_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member', 'contributor'))
);

-- Table des collaborateurs de projets (pour les projets individuels)
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'contributor', -- owner, collaborator, contributor, reviewer
  permissions TEXT[], -- Array de permissions spécifiques
  
  -- Dates
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Contraintes
  UNIQUE(project_id, user_id),
  CONSTRAINT valid_collaborator_role CHECK (role IN ('owner', 'collaborator', 'contributor', 'reviewer'))
);

-- Table des technologies utilisées
CREATE TABLE project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- frontend, backend, database, tool, framework, library
  proficiency_level VARCHAR(20) DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
  
  -- Contraintes
  UNIQUE(project_id, technology),
  CONSTRAINT valid_category CHECK (category IN ('frontend', 'backend', 'database', 'tool', 'framework', 'library', 'language', 'platform')),
  CONSTRAINT valid_proficiency CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

-- Table des tags de projets
CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  
  -- Contraintes
  UNIQUE(project_id, tag)
);

-- Table des vues de projets (pour les statistiques)
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL pour les vues anonymes
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Métadonnées
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes pour éviter les vues multiples du même utilisateur
  UNIQUE(project_id, user_id) -- Un utilisateur ne peut voir qu'une fois
);

-- Table des likes de projets
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Timestamps
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(project_id, user_id)
);

-- Table des commentaires de projets
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES project_comments(id) ON DELETE CASCADE, -- Pour les réponses
  content TEXT NOT NULL,
  
  -- Métadonnées
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des versions de projets (pour l'historique)
CREATE TABLE project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  changelog TEXT,
  
  -- Métadonnées
  is_current BOOLEAN DEFAULT FALSE,
  released_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(project_id, version_number)
);

-- Table des soumissions de projets (pour les défis/concours)
CREATE TABLE project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  submission_data JSONB, -- Données spécifiques à la soumission
  
  -- Statut
  status VARCHAR(20) DEFAULT 'submitted', -- submitted, under_review, approved, rejected
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_submission_status CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected'))
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Lecture des projets : exactement comme les articles
DROP POLICY IF EXISTS "select_public_projects" ON projects;
DROP POLICY IF EXISTS "select_own_projects" ON projects;
DROP POLICY IF EXISTS "select_projects" ON projects;

-- Projets publics visibles par TOUS (même non connectés)
CREATE POLICY "select_projects" ON projects
  FOR SELECT 
  USING (
    visibility = 'public' 
    OR auth.uid() = author_id
  );

-- Création de projets (simple et direct)
DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- Modification de ses propres projets
DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects
  FOR UPDATE 
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Suppression de ses propres projets ET par les admins
DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_projects_owners_and_admins" ON projects
  FOR DELETE 
  USING (
    auth.uid() = author_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Project Teams
ALTER TABLE project_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_teams" ON project_teams
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "insert_teams" ON project_teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "update_teams" ON project_teams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "delete_teams" ON project_teams
  FOR DELETE USING (auth.uid() = owner_id);

-- Project Team Members
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_team_members" ON project_team_members
  FOR SELECT USING (true);

CREATE POLICY "manage_team_members" ON project_team_members
  FOR ALL USING (auth.uid() = user_id);

-- Project Collaborators
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_collaborators" ON project_collaborators
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "manage_own_collaboration" ON project_collaborators
  FOR ALL USING (auth.uid() = user_id);

-- Project Technologies
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_technologies" ON project_technologies;
CREATE POLICY "select_technologies" ON project_technologies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "manage_technologies" ON project_technologies;
CREATE POLICY "manage_technologies" ON project_technologies
  FOR ALL USING (true);

-- Project Tags
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_tags" ON project_tags;
CREATE POLICY "select_tags" ON project_tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "manage_tags" ON project_tags;
CREATE POLICY "manage_tags" ON project_tags
  FOR ALL USING (true);

-- Project Views
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_views" ON project_views;
CREATE POLICY "select_views" ON project_views
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "insert_views" ON project_views;
CREATE POLICY "insert_views" ON project_views
  FOR INSERT WITH CHECK (true);

-- Project Likes - UTILISER LA TABLE LIKES GÉNÉRIQUE
-- RLS policies pour la table likes générique (si pas déjà définies)
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Lecture des likes (tous peuvent voir)
DROP POLICY IF EXISTS "select_likes" ON likes;
CREATE POLICY "select_likes" ON likes
  FOR SELECT USING (true);

-- Insertion de likes (seulement son propre like)
DROP POLICY IF EXISTS "insert_likes" ON likes;
CREATE POLICY "insert_likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Suppression de likes (seulement ses propres likes)
DROP POLICY IF EXISTS "delete_own_likes" ON likes;
CREATE POLICY "delete_own_likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Permissions pour la table likes
GRANT ALL ON likes TO anon, authenticated;

-- Project Comments
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_comments" ON project_comments;
CREATE POLICY "select_comments" ON project_comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "insert_comments" ON project_comments;
CREATE POLICY "insert_comments" ON project_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "update_own_comments" ON project_comments;
CREATE POLICY "update_own_comments" ON project_comments
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "delete_own_comments" ON project_comments;
CREATE POLICY "delete_own_comments" ON project_comments
  FOR DELETE USING (auth.uid() = author_id);

-- =====================================================
-- TRIGGERS POUR LES COMPTEURS
-- =====================================================

-- Les fonctions project_likes sont maintenant obsolètes
-- Remplacées par increment_likes_unified() et decrement_likes_unified()

-- Triggers sur la table likes générique - GESTION UNIFIÉE
-- Supprimer les anciens triggers pour éviter les conflits
DROP TRIGGER IF EXISTS on_article_liked ON likes;
DROP TRIGGER IF EXISTS on_article_unliked ON likes;
DROP TRIGGER IF EXISTS on_project_liked ON likes;
DROP TRIGGER IF EXISTS on_project_unliked ON likes;

-- Créer des fonctions unifiées qui gèrent articles ET projets
CREATE OR REPLACE FUNCTION increment_likes_unified()
RETURNS TRIGGER AS $$
BEGIN
  -- Gérer les likes d'articles
  IF NEW.article_id IS NOT NULL THEN
    UPDATE articles
    SET likes_count = likes_count + 1
    WHERE id = NEW.article_id;
    
    RAISE NOTICE 'Article % likes incremented', NEW.article_id;
  END IF;
  
  -- Gérer les likes de projets
  IF NEW.project_id IS NOT NULL THEN
    UPDATE projects
    SET likes_count = likes_count + 1
    WHERE id = NEW.project_id;
    
    RAISE NOTICE 'Project % likes incremented', NEW.project_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_unified()
RETURNS TRIGGER AS $$
BEGIN
  -- Gérer les likes d'articles
  IF OLD.article_id IS NOT NULL THEN
    UPDATE articles
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.article_id;
    
    RAISE NOTICE 'Article % likes decremented', OLD.article_id;
  END IF;
  
  -- Gérer les likes de projets
  IF OLD.project_id IS NOT NULL THEN
    UPDATE projects
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.project_id;
    
    RAISE NOTICE 'Project % likes decremented', OLD.project_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Créer les triggers unifiés
CREATE TRIGGER on_likes_inserted
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_unified();

CREATE TRIGGER on_likes_deleted
  AFTER DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_unified();

-- Trigger pour les vues de projets
CREATE OR REPLACE FUNCTION increment_project_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET views_count = views_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_viewed
  AFTER INSERT ON project_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_project_views();

-- Trigger pour les commentaires de projets
CREATE OR REPLACE FUNCTION increment_project_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET comments_count = comments_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_project_comments()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_commented
  AFTER INSERT ON project_comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_project_comments();

CREATE TRIGGER on_project_comment_deleted
  AFTER DELETE ON project_comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_project_comments();

-- Trigger pour les collaborateurs
CREATE OR REPLACE FUNCTION update_project_collaborators_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET collaborators_count = collaborators_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects
    SET collaborators_count = GREATEST(collaborators_count - 1, 0)
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_project_collaborator_added
  AFTER INSERT ON project_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_project_collaborators_count();

CREATE TRIGGER on_project_collaborator_removed
  AFTER DELETE ON project_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_project_collaborators_count();

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les projets populaires
CREATE OR REPLACE FUNCTION get_popular_projects(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  short_description VARCHAR,
  cover_image_url TEXT,
  author_name VARCHAR,
  author_avatar TEXT,
  likes_count INTEGER,
  views_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.short_description,
    p.cover_image_url,
    pr.display_name,
    pr.avatar_url,
    p.likes_count,
    p.views_count,
    p.created_at
  FROM projects p
  JOIN profiles pr ON p.author_id = pr.id
  WHERE p.visibility = 'public' AND p.status = 'active'
  ORDER BY (p.likes_count + p.views_count) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les projets par technologie
CREATE OR REPLACE FUNCTION get_projects_by_technology(tech_name VARCHAR, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  short_description VARCHAR,
  cover_image_url TEXT,
  author_name VARCHAR,
  likes_count INTEGER,
  views_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.short_description,
    p.cover_image_url,
    pr.display_name,
    p.likes_count,
    p.views_count
  FROM projects p
  JOIN profiles pr ON p.author_id = pr.id
  JOIN project_technologies pt ON p.id = pt.project_id
  WHERE p.visibility = 'public' 
    AND p.status = 'active'
    AND pt.technology ILIKE '%' || tech_name || '%'
  ORDER BY p.likes_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERMISSIONS
-- =====================================================

-- Permissions pour les tables (IMPORTANT: anon + authenticated)
GRANT SELECT ON projects TO anon, authenticated;
GRANT ALL ON projects TO authenticated;

GRANT ALL ON project_teams TO authenticated;
GRANT ALL ON project_team_members TO authenticated;
GRANT ALL ON project_collaborators TO authenticated;

GRANT SELECT ON project_technologies TO anon, authenticated;
GRANT ALL ON project_technologies TO authenticated;

GRANT SELECT ON project_tags TO anon, authenticated;
GRANT ALL ON project_tags TO authenticated;

GRANT ALL ON project_views TO anon, authenticated;
-- project_likes n'est plus utilisé, on utilise la table likes générique

GRANT SELECT ON project_comments TO anon, authenticated;
GRANT ALL ON project_comments TO authenticated;

GRANT ALL ON project_versions TO authenticated;
GRANT ALL ON project_submissions TO authenticated;

-- Permissions pour les fonctions
GRANT EXECUTE ON FUNCTION get_popular_projects(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_projects_by_technology(VARCHAR, INTEGER) TO anon, authenticated;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE projects IS 'Table principale des projets avec toutes les métadonnées';
COMMENT ON TABLE project_teams IS 'Équipes de projets pour la collaboration';
COMMENT ON TABLE project_team_members IS 'Membres des équipes de projets';
COMMENT ON TABLE project_collaborators IS 'Collaborateurs individuels sur les projets';
COMMENT ON TABLE project_technologies IS 'Technologies utilisées dans les projets';
COMMENT ON TABLE project_tags IS 'Tags pour catégoriser les projets';
COMMENT ON TABLE project_views IS 'Vues des projets pour les statistiques';
COMMENT ON TABLE project_likes IS 'Likes des projets';
COMMENT ON TABLE project_comments IS 'Commentaires sur les projets';
COMMENT ON TABLE project_versions IS 'Versions des projets';
COMMENT ON TABLE project_submissions IS 'Soumissions de projets pour les défis';
