-- =====================================================
-- MIGRATION PHASE 1 : Recommandations rule-based
-- Date: 2025-01-10
-- Objectif: Enrichir resources + tracking interactions
-- =====================================================

-- 1) Enrichir table resources (métadonnées pour recos)
-- =====================================================

-- Ajouter colonnes si elles n'existent pas déjà
ALTER TABLE public.resources 
  ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  ADD COLUMN IF NOT EXISTS domains TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prerequisites TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS duration_minutes INT,
  ADD COLUMN IF NOT EXISTS lang TEXT CHECK (lang IN ('FR', 'EN', 'Both')) DEFAULT 'FR',
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS quality_score REAL DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 1);

-- Index pour améliorer les performances des filtres
CREATE INDEX IF NOT EXISTS idx_resources_level ON public.resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_lang ON public.resources(lang);
CREATE INDEX IF NOT EXISTS idx_resources_published_at ON public.resources(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_quality_score ON public.resources(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_resources_domains ON public.resources USING GIN(domains);

-- Commentaires pour documentation
COMMENT ON COLUMN public.resources.level IS 'Niveau de difficulté: Beginner, Intermediate, Advanced';
COMMENT ON COLUMN public.resources.domains IS 'Domaines IA: [Python, ML, DL, LLMs, MLOps, Data, Vision, NLP, Maths, Éthique]';
COMMENT ON COLUMN public.resources.prerequisites IS 'Liste des prérequis (texte libre)';
COMMENT ON COLUMN public.resources.duration_minutes IS 'Durée estimée en minutes';
COMMENT ON COLUMN public.resources.lang IS 'Langue principale: FR, EN, Both';
COMMENT ON COLUMN public.resources.published_at IS 'Date de publication/création du contenu';
COMMENT ON COLUMN public.resources.quality_score IS 'Score de qualité 0-1 (heuristique)';


-- 2) Enrichir table profiles (préférences utilisateur)
-- =====================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  ADD COLUMN IF NOT EXISTS goals TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS langs TEXT[] DEFAULT '{"FR"}',
  ADD COLUMN IF NOT EXISTS time_per_week INT DEFAULT 5;

-- Index
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_goals ON public.profiles USING GIN(goals);

-- Commentaires
COMMENT ON COLUMN public.profiles.level IS 'Niveau actuel utilisateur';
COMMENT ON COLUMN public.profiles.goals IS 'Objectifs d''apprentissage: [Bases IA, ML Engineer, LLMs, Data & Analytics, MLOps, Vision, NLP]';
COMMENT ON COLUMN public.profiles.langs IS 'Langues préférées: FR et/ou EN';
COMMENT ON COLUMN public.profiles.time_per_week IS 'Temps dispo par semaine (heures)';


-- 3) Table interactions (tracking événements)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  event TEXT NOT NULL CHECK (event IN ('view', 'click', 'like', 'bookmark', 'complete', 'rating', 'bounce')),
  value REAL, -- dwell_time (sec), rating 1-5, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_interactions_user ON public.interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_resource ON public.interactions(resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_event ON public.interactions(event);

-- Commentaires
COMMENT ON TABLE public.interactions IS 'Événements utilisateur pour améliorer les recommandations';
COMMENT ON COLUMN public.interactions.event IS 'Type: view, click, like, bookmark, complete, rating, bounce';
COMMENT ON COLUMN public.interactions.value IS 'Valeur associée (dwell_time en sec, rating 1-5, etc.)';


-- 4) RLS (Row Level Security) pour interactions
-- =====================================================

ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres interactions
CREATE POLICY "Users can view own interactions"
  ON public.interactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres interactions
CREATE POLICY "Users can create own interactions"
  ON public.interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins can view all interactions"
  ON public.interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );


-- 5) Fonction helper: calculer quality_score (heuristique simple)
-- =====================================================

CREATE OR REPLACE FUNCTION public.compute_quality_score(
  p_published_at TIMESTAMPTZ,
  p_lang TEXT,
  p_source TEXT,
  p_views_count INT DEFAULT 0,
  p_likes_count INT DEFAULT 0,
  p_completion_rate REAL DEFAULT 0
)
RETURNS REAL
LANGUAGE plpgsql
AS $$
DECLARE
  score REAL := 0.0;
  months_old INT;
BEGIN
  -- Récence (max 0.3)
  months_old := EXTRACT(MONTH FROM AGE(NOW(), p_published_at));
  IF months_old < 6 THEN
    score := score + 0.3;
  ELSIF months_old < 18 THEN
    score := score + 0.15;
  ELSE
    score := score + 0.05;
  END IF;

  -- Langue FR (bonus local) (max 0.2)
  IF p_lang IN ('FR', 'Both') THEN
    score := score + 0.2;
  END IF;

  -- Source fiable (max 0.2) - liste blanche basique
  IF p_source IN ('Coursera', 'edX', 'Kaggle', 'HuggingFace', 'Fast.ai', 'DeepLearning.AI') THEN
    score := score + 0.2;
  END IF;

  -- Signaux d'usage (max 0.3)
  IF p_views_count > 100 THEN
    score := score + 0.1;
  END IF;
  IF p_likes_count > 10 THEN
    score := score + 0.1;
  END IF;
  IF p_completion_rate > 0.5 THEN
    score := score + 0.1;
  END IF;

  -- Normaliser entre 0 et 1
  RETURN LEAST(score, 1.0);
END;
$$;

COMMENT ON FUNCTION public.compute_quality_score IS 'Calcule quality_score heuristique (0-1) basé sur récence, langue, source, usage';


-- 6) Fonction trigger: auto-update quality_score à la création
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_compute_quality_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.quality_score := public.compute_quality_score(
    NEW.published_at,
    NEW.lang,
    NEW.source,
    0, 0, 0 -- au départ, pas de métriques d'usage
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_quality_score ON public.resources;
CREATE TRIGGER trigger_auto_quality_score
  BEFORE INSERT ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_compute_quality_score();


-- 7) Vue helper: ressources avec métriques agrégées (pour recos avancées)
-- =====================================================

CREATE OR REPLACE VIEW public.resources_with_metrics AS
SELECT 
  r.id,
  r.title,
  r.url,
  r.description,
  r.source,
  r.type,
  r.category,
  r.difficulty,
  r.tags,
  r.is_local,
  r.created_by,
  r.created_at,
  r.updated_at,
  r.level,
  r.domains,
  r.prerequisites,
  r.duration_minutes,
  r.lang,
  r.published_at,
  r.quality_score,
  COUNT(DISTINCT CASE WHEN i.event = 'view' THEN i.user_id END) AS metric_views_count,
  COUNT(DISTINCT CASE WHEN i.event = 'like' THEN i.user_id END) AS metric_likes_count,
  COUNT(DISTINCT CASE WHEN i.event = 'complete' THEN i.user_id END) AS metric_completions_count,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN i.event = 'view' THEN i.user_id END) > 0
    THEN COUNT(DISTINCT CASE WHEN i.event = 'complete' THEN i.user_id END)::REAL / 
         COUNT(DISTINCT CASE WHEN i.event = 'view' THEN i.user_id END)::REAL
    ELSE 0
  END AS metric_completion_rate
FROM public.resources r
LEFT JOIN public.interactions i ON i.resource_id = r.id
GROUP BY r.id, r.title, r.url, r.description, r.source, r.type, r.category, r.difficulty, r.tags, r.is_local, r.created_by, r.created_at, r.updated_at, r.level, r.domains, r.prerequisites, r.duration_minutes, r.lang, r.published_at, r.quality_score;

COMMENT ON VIEW public.resources_with_metrics IS 'Ressources enrichies avec métriques d''usage agrégées';


-- 8) Seed data exemple (optionnel - à adapter selon tes besoins)
-- =====================================================

-- Mettre à jour quelques ressources existantes avec les nouvelles colonnes
-- (À adapter selon tes données réelles)

-- UPDATE public.resources
-- SET 
--   level = 'Beginner',
--   domains = ARRAY['Python', 'ML'],
--   prerequisites = ARRAY['Aucun'],
--   duration_minutes = 120,
--   lang = 'FR',
--   published_at = '2024-06-01'::TIMESTAMPTZ
-- WHERE title ILIKE '%python%' AND level IS NULL;


-- =====================================================
-- FIN MIGRATION PHASE 1
-- =====================================================

