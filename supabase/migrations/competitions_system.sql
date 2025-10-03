-- =====================================================
-- SYSTÈME DE COMPÉTITIONS - LOOYMIND
-- =====================================================
-- Inspiré de Zindi/Kaggle pour l'Afrique
-- =====================================================

-- =====================================================
-- TABLE: COMPETITIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  
  -- Images et médias
  cover_image_url TEXT,
  
  -- Type et catégorie
  category VARCHAR(50) NOT NULL DEFAULT 'data-science', -- data-science, nlp, computer-vision, prediction, other
  difficulty VARCHAR(20) NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
  
  -- Dataset
  dataset_description TEXT,
  dataset_url TEXT,
  dataset_size VARCHAR(50), -- ex: "100MB", "1GB"
  
  -- Métriques et évaluation
  metric_type VARCHAR(50) NOT NULL DEFAULT 'accuracy', -- accuracy, f1, rmse, mae, auc, custom
  metric_description TEXT,
  evaluation_criteria TEXT,
  
  -- Dates importantes
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming', -- upcoming, active, completed, cancelled
  visibility VARCHAR(20) NOT NULL DEFAULT 'public', -- public, private
  
  -- Récompenses (optionnel)
  prize_description TEXT,
  prize_amount INTEGER, -- en FCFA
  
  -- Règles et ressources
  rules TEXT,
  resources_urls TEXT[], -- Array d'URLs de ressources
  
  -- Statistiques
  participants_count INTEGER DEFAULT 0,
  submissions_count INTEGER DEFAULT 0,
  
  -- Métadonnées
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_category CHECK (category IN ('data-science', 'nlp', 'computer-vision', 'prediction', 'other')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  CONSTRAINT valid_status CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private')),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_category ON competitions(category);
CREATE INDEX IF NOT EXISTS idx_competitions_start_date ON competitions(start_date);
CREATE INDEX IF NOT EXISTS idx_competitions_end_date ON competitions(end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_slug ON competitions(slug);

-- =====================================================
-- TABLE: SUBMISSIONS (Soumissions)
-- =====================================================

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Fichier soumis
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER, -- en bytes
  
  -- Score et évaluation
  score FLOAT,
  metric_details JSONB, -- Détails des métriques (precision, recall, etc.)
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, scored, error
  error_message TEXT,
  
  -- Métadonnées
  description TEXT, -- Description optionnelle de la soumission
  is_public BOOLEAN DEFAULT false, -- Rendre la soumission publique
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scored_at TIMESTAMP WITH TIME ZONE,
  
  -- Contraintes
  CONSTRAINT valid_submission_status CHECK (status IN ('pending', 'processing', 'scored', 'error')),
  UNIQUE(competition_id, user_id, submitted_at) -- Un utilisateur peut soumettre plusieurs fois
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_submissions_competition ON submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(score DESC);

-- =====================================================
-- TABLE: LEADERBOARD (Classement)
-- =====================================================

CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Meilleur score
  best_score FLOAT NOT NULL,
  best_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  
  -- Statistiques
  submissions_count INTEGER DEFAULT 1,
  rank INTEGER,
  
  -- Métadonnées
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(competition_id, user_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_leaderboard_competition ON leaderboard(competition_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON leaderboard(competition_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(competition_id, best_score DESC);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Competitions
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_public_competitions" ON competitions;
CREATE POLICY "select_public_competitions" ON competitions
  FOR SELECT 
  USING (visibility = 'public' OR created_by = auth.uid());

DROP POLICY IF EXISTS "insert_competitions" ON competitions;
CREATE POLICY "insert_competitions" ON competitions
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "update_own_competitions" ON competitions;
CREATE POLICY "update_own_competitions" ON competitions
  FOR UPDATE 
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "delete_own_competitions" ON competitions;
CREATE POLICY "delete_own_competitions" ON competitions
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_submissions" ON submissions;
CREATE POLICY "select_submissions" ON submissions
  FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR is_public = true
  );

DROP POLICY IF EXISTS "insert_own_submissions" ON submissions;
CREATE POLICY "insert_own_submissions" ON submissions
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_submissions" ON submissions;
CREATE POLICY "update_own_submissions" ON submissions
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_submissions" ON submissions;
CREATE POLICY "delete_own_submissions" ON submissions
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Leaderboard
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_leaderboard" ON leaderboard;
CREATE POLICY "select_leaderboard" ON leaderboard
  FOR SELECT 
  USING (true); -- Tout le monde peut voir le classement

-- =====================================================
-- TRIGGERS POUR LES COMPTEURS
-- =====================================================

-- Fonction pour mettre à jour le leaderboard après une soumission
CREATE OR REPLACE FUNCTION update_leaderboard_on_submission()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Seulement si la soumission a un score
  IF NEW.score IS NOT NULL AND NEW.status = 'scored' THEN
    -- Insérer ou mettre à jour le leaderboard
    INSERT INTO leaderboard (competition_id, user_id, best_score, best_submission_id, submissions_count)
    VALUES (NEW.competition_id, NEW.user_id, NEW.score, NEW.id, 1)
    ON CONFLICT (competition_id, user_id) 
    DO UPDATE SET
      best_score = CASE 
        WHEN EXCLUDED.best_score > leaderboard.best_score 
        THEN EXCLUDED.best_score 
        ELSE leaderboard.best_score 
      END,
      best_submission_id = CASE 
        WHEN EXCLUDED.best_score > leaderboard.best_score 
        THEN EXCLUDED.best_submission_id 
        ELSE leaderboard.best_submission_id 
      END,
      submissions_count = leaderboard.submissions_count + 1,
      updated_at = NOW();
    
    -- Recalculer les rangs
    PERFORM update_leaderboard_ranks(NEW.competition_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fonction pour recalculer les rangs
CREATE OR REPLACE FUNCTION update_leaderboard_ranks(comp_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY best_score DESC) as new_rank
    FROM leaderboard
    WHERE competition_id = comp_id
  )
  UPDATE leaderboard l
  SET rank = r.new_rank
  FROM ranked r
  WHERE l.id = r.id;
END;
$$;

-- Fonction pour incrémenter le compteur de participants
CREATE OR REPLACE FUNCTION increment_competition_participants()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE competitions
  SET participants_count = participants_count + 1
  WHERE id = NEW.competition_id;
  
  RETURN NEW;
END;
$$;

-- Fonction pour incrémenter le compteur de soumissions
CREATE OR REPLACE FUNCTION increment_competition_submissions()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE competitions
  SET submissions_count = submissions_count + 1
  WHERE id = NEW.competition_id;
  
  RETURN NEW;
END;
$$;

-- Triggers
DROP TRIGGER IF EXISTS on_submission_scored ON submissions;
CREATE TRIGGER on_submission_scored
  AFTER INSERT OR UPDATE ON submissions
  FOR EACH ROW
  WHEN (NEW.status = 'scored')
  EXECUTE FUNCTION update_leaderboard_on_submission();

DROP TRIGGER IF EXISTS on_first_submission ON leaderboard;
CREATE TRIGGER on_first_submission
  AFTER INSERT ON leaderboard
  FOR EACH ROW
  EXECUTE FUNCTION increment_competition_participants();

DROP TRIGGER IF EXISTS on_submission_created ON submissions;
CREATE TRIGGER on_submission_created
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION increment_competition_submissions();

-- =====================================================
-- PERMISSIONS
-- =====================================================

GRANT SELECT ON competitions TO anon, authenticated;
GRANT ALL ON competitions TO authenticated;

GRANT SELECT ON submissions TO anon, authenticated;
GRANT ALL ON submissions TO authenticated;

GRANT SELECT ON leaderboard TO anon, authenticated;

GRANT EXECUTE ON FUNCTION update_leaderboard_on_submission() TO authenticated;
GRANT EXECUTE ON FUNCTION update_leaderboard_ranks(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_competition_participants() TO authenticated;
GRANT EXECUTE ON FUNCTION increment_competition_submissions() TO authenticated;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE competitions IS 'Compétitions de data science avec datasets et classements';
COMMENT ON TABLE submissions IS 'Soumissions des participants aux compétitions';
COMMENT ON TABLE leaderboard IS 'Classement des participants par compétition';

