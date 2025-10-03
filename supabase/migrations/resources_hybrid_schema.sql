-- ============================================================================
-- LOOYMIND - SYSTÈME DE RESSOURCES ÉDUCATIVES HYBRIDE
-- ============================================================================
-- Approche: Curation de ressources externes + Contenu local (profs sénégalais)
-- ============================================================================

-- Table resources (ressources externes + locales)
DROP TABLE IF EXISTS public.resources CASCADE;
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL, -- Description en français (même pour ressources anglaises)
  type TEXT NOT NULL CHECK (type IN ('external_course', 'local_course', 'tool', 'article', 'video', 'documentation', 'tutorial')),
  
  -- Contenu externe ou local
  url TEXT, -- URL externe (Coursera, YouTube, etc.) OU null si contenu local
  source TEXT, -- "Coursera", "YouTube", "Prof. Diallo (UCAD)", "edX", "Kaggle", etc.
  is_local BOOLEAN DEFAULT false, -- true si créé par un prof/membre sénégalais
  local_content TEXT, -- Contenu markdown/texte si ressource locale
  file_url TEXT, -- URL du fichier si contenu local (PDF, video hébergée)
  
  -- Métadonnées
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'wolof', 'other')),
  category TEXT NOT NULL CHECK (category IN ('ia', 'data-science', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'big-data', 'cloud', 'dev', 'mathematics', 'statistics', 'python', 'r', 'other')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  duration_hours INTEGER, -- Durée estimée en heures (peut être null)
  
  -- Attributs de valeur
  is_free BOOLEAN DEFAULT true,
  has_certificate BOOLEAN DEFAULT false,
  price_fcfa INTEGER, -- Prix en FCFA si payant
  
  -- Auteur/créateur
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- null si admin/système, id si prof local
  curator_notes TEXT, -- Notes du curateur (pourquoi cette ressource est recommandée)
  
  -- Engagement
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0.0, -- Moyenne des notes (0.00 - 5.00)
  rating_count INTEGER DEFAULT 0,
  
  -- Statut
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  featured BOOLEAN DEFAULT false, -- Ressource mise en avant
  
  -- Métadonnées temporelles
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour resources
CREATE INDEX idx_resources_slug ON public.resources(slug);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_difficulty ON public.resources(difficulty);
CREATE INDEX idx_resources_is_local ON public.resources(is_local);
CREATE INDEX idx_resources_created_by ON public.resources(created_by);
CREATE INDEX idx_resources_status ON public.resources(status);
CREATE INDEX idx_resources_featured ON public.resources(featured);

-- RLS pour resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public resources are viewable" ON public.resources;
CREATE POLICY "Public resources are viewable" 
  ON public.resources FOR SELECT 
  USING (status = 'published' AND visibility = 'public');

DROP POLICY IF EXISTS "Admins and mentors can create resources" ON public.resources;
CREATE POLICY "Admins and mentors can create resources" 
  ON public.resources FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'mentor')
    )
  );

DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
CREATE POLICY "Users can update own resources" 
  ON public.resources FOR UPDATE 
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins can update all resources" ON public.resources;
CREATE POLICY "Admins can update all resources" 
  ON public.resources FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO authenticated;

-- ============================================================================
-- Table resource_ratings (notes/avis des utilisateurs)
-- ============================================================================

DROP TABLE IF EXISTS public.resource_ratings CASCADE;
CREATE TABLE public.resource_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  is_completed BOOLEAN DEFAULT false, -- L'utilisateur a-t-il terminé la ressource ?
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

CREATE INDEX idx_resource_ratings_resource ON public.resource_ratings(resource_id);
CREATE INDEX idx_resource_ratings_user ON public.resource_ratings(user_id);

ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view ratings" ON public.resource_ratings;
CREATE POLICY "Anyone can view ratings" 
  ON public.resource_ratings FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Users can create own ratings" ON public.resource_ratings;
CREATE POLICY "Users can create own ratings" 
  ON public.resource_ratings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ratings" ON public.resource_ratings;
CREATE POLICY "Users can update own ratings" 
  ON public.resource_ratings FOR UPDATE 
  USING (auth.uid() = user_id);

GRANT SELECT ON public.resource_ratings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.resource_ratings TO authenticated;

-- Fonction pour mettre à jour la moyenne des notes
CREATE OR REPLACE FUNCTION public.update_resource_rating()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.resources
  SET 
    rating_avg = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.resource_ratings 
      WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM public.resource_ratings 
      WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id)
    )
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_resource_rating_change ON public.resource_ratings;
CREATE TRIGGER on_resource_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON public.resource_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_resource_rating();

GRANT EXECUTE ON FUNCTION public.update_resource_rating() TO authenticated;

-- ============================================================================
-- Table resource_bookmarks (favoris)
-- ============================================================================

DROP TABLE IF EXISTS public.resource_bookmarks CASCADE;
CREATE TABLE public.resource_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  notes TEXT, -- Notes personnelles de l'utilisateur
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

CREATE INDEX idx_resource_bookmarks_resource ON public.resource_bookmarks(resource_id);
CREATE INDEX idx_resource_bookmarks_user ON public.resource_bookmarks(user_id);

ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Users can view own bookmarks" 
  ON public.resource_bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Users can create own bookmarks" 
  ON public.resource_bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.resource_bookmarks;
CREATE POLICY "Users can delete own bookmarks" 
  ON public.resource_bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.resource_bookmarks TO authenticated;

-- Fonction pour mettre à jour le compteur de bookmarks
CREATE OR REPLACE FUNCTION public.update_resource_bookmarks_count()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.resources 
    SET bookmarks_count = bookmarks_count + 1 
    WHERE id = NEW.resource_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.resources 
    SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
    WHERE id = OLD.resource_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_resource_bookmark_change ON public.resource_bookmarks;
CREATE TRIGGER on_resource_bookmark_change
  AFTER INSERT OR DELETE ON public.resource_bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.update_resource_bookmarks_count();

GRANT EXECUTE ON FUNCTION public.update_resource_bookmarks_count() TO authenticated;

-- ============================================================================
-- Table resource_views (vues uniques)
-- ============================================================================

DROP TABLE IF EXISTS public.resource_views CASCADE;
CREATE TABLE public.resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id, ip_address)
);

CREATE INDEX idx_resource_views_resource ON public.resource_views(resource_id);

ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view resource_views" ON public.resource_views;
CREATE POLICY "Anyone can view resource_views" 
  ON public.resource_views FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert resource_views" ON public.resource_views;
CREATE POLICY "Anyone can insert resource_views" 
  ON public.resource_views FOR INSERT 
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.resource_views TO anon, authenticated;

-- ============================================================================
-- Table resource_progress (suivi de progression pour les cours)
-- ============================================================================

DROP TABLE IF EXISTS public.resource_progress CASCADE;
CREATE TABLE public.resource_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  completed BOOLEAN DEFAULT false,
  time_spent_hours DECIMAL(5,1) DEFAULT 0, -- Temps passé en heures
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

CREATE INDEX idx_resource_progress_user ON public.resource_progress(user_id);
CREATE INDEX idx_resource_progress_resource ON public.resource_progress(resource_id);

ALTER TABLE public.resource_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.resource_progress;
CREATE POLICY "Users can view own progress" 
  ON public.resource_progress FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own progress" ON public.resource_progress;
CREATE POLICY "Users can manage own progress" 
  ON public.resource_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.resource_progress TO authenticated;

-- ============================================================================
-- Fonctions utilitaires
-- ============================================================================

-- Fonction pour obtenir les ressources les plus populaires
CREATE OR REPLACE FUNCTION public.get_popular_resources(
  limit_count INTEGER DEFAULT 10,
  category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  source TEXT,
  is_local BOOLEAN,
  category TEXT,
  difficulty TEXT,
  rating_avg DECIMAL,
  rating_count INTEGER,
  views_count INTEGER,
  likes_count INTEGER
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    r.id, r.title, r.description, r.type, r.source, r.is_local,
    r.category, r.difficulty, r.rating_avg, r.rating_count, 
    r.views_count, r.likes_count
  FROM public.resources r
  WHERE 
    r.status = 'published' 
    AND r.visibility = 'public'
    AND (category_filter IS NULL OR r.category = category_filter)
  ORDER BY 
    (r.views_count * 0.3 + r.likes_count * 0.5 + r.rating_avg * r.rating_count * 0.2) DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_popular_resources TO anon, authenticated;

-- ============================================================================
-- Données de démonstration (ressources curées)
-- ============================================================================

-- Vous pouvez insérer des ressources initiales ici
-- Exemple commenté:

/*
INSERT INTO public.resources (
  title, slug, description, type, url, source, is_local,
  language, category, difficulty, is_free, has_certificate,
  duration_hours, tags, curator_notes, featured
) VALUES 
(
  'Machine Learning Specialization',
  'ml-specialization-coursera-andrew-ng',
  'Cours de référence en Machine Learning par Andrew Ng. Couvre les fondamentaux : régression, classification, réseaux de neurones. Parfait pour débuter en ML avec une approche pratique et des exercices concrets.',
  'external_course',
  'https://www.coursera.org/specializations/machine-learning-introduction',
  'Coursera',
  false,
  'en',
  'machine-learning',
  'beginner',
  true,
  true,
  60,
  ARRAY['Python', 'ML', 'Andrew Ng', 'Stanford'],
  'Meilleur cours pour débuter en ML. Très pédagogique, même si en anglais.',
  true
),
(
  'Fast.ai Practical Deep Learning',
  'fastai-practical-deep-learning',
  'Formation pratique en Deep Learning par Jeremy Howard. Approche top-down : vous construisez des modèles dès le premier cours. Idéal pour les développeurs qui veulent passer rapidement à la pratique.',
  'external_course',
  'https://course.fast.ai/',
  'Fast.ai',
  false,
  'en',
  'deep-learning',
  'intermediate',
  true,
  false,
  40,
  ARRAY['PyTorch', 'Deep Learning', 'Computer Vision', 'NLP'],
  'Approche très pratique et moderne. Recommandé après avoir fait du ML de base.',
  true
);
*/

-- ============================================================================
-- FIN DU SCHÉMA RESSOURCES
-- ============================================================================

