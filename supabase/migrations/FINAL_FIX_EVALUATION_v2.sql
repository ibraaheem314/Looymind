-- =====================================================
-- FIX FINAL v2: Correction de leaderboard_history
-- =====================================================
-- Date: 9 octobre 2025

-- 1. SUPPRIMER TOUS LES TRIGGERS (au cas où)
DROP TRIGGER IF EXISTS trigger_update_leaderboard_ranks ON submissions CASCADE;
DROP TRIGGER IF EXISTS trigger_save_leaderboard_history ON submissions CASCADE;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_score_change ON leaderboard CASCADE;
DROP TRIGGER IF EXISTS after_submission_update ON submissions CASCADE;
DROP TRIGGER IF EXISTS after_leaderboard_update ON leaderboard CASCADE;

-- 2. SUPPRIMER TOUTES LES FONCTIONS LIÉES
DROP FUNCTION IF EXISTS update_leaderboard_ranks CASCADE;
DROP FUNCTION IF EXISTS save_leaderboard_history CASCADE;
DROP FUNCTION IF EXISTS upsert_leaderboard_score CASCADE;
DROP FUNCTION IF EXISTS evaluate_submission_manually CASCADE;

-- 3. CRÉER LA FONCTION CORRECTE (avec les bonnes colonnes)
CREATE OR REPLACE FUNCTION evaluate_submission_manually(
  p_submission_id UUID,
  p_score DECIMAL(10, 6),
  p_evaluator_id UUID,
  p_feedback TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_competition_id UUID;
  v_user_id UUID;
  v_rank INTEGER;
  v_is_best BOOLEAN := false;
  v_previous_score DECIMAL(10, 6);
BEGIN
  -- 1. Récupérer les infos de la soumission
  SELECT competition_id, user_id 
  INTO v_competition_id, v_user_id
  FROM submissions
  WHERE id = p_submission_id;

  IF v_competition_id IS NULL THEN
    RAISE EXCEPTION 'Soumission introuvable';
  END IF;

  -- 2. Récupérer le score précédent s'il existe
  SELECT score INTO v_previous_score
  FROM leaderboard
  WHERE competition_id = v_competition_id 
    AND user_id = v_user_id;

  -- 3. Mettre à jour la soumission
  UPDATE submissions
  SET 
    score = p_score,
    evaluation_status = 'evaluated',
    evaluated_by = p_evaluator_id,
    evaluated_at = NOW(),
    feedback = p_feedback
  WHERE id = p_submission_id;

  -- 4. Gérer le leaderboard (UPSERT simple)
  INSERT INTO leaderboard (
    competition_id,
    user_id,
    submission_id,
    score,
    best_score,
    submission_count,
    last_improvement_at,
    rank
  ) VALUES (
    v_competition_id,
    v_user_id,
    p_submission_id,
    p_score,
    p_score,
    1,
    NOW(),
    999 -- Temporaire, sera recalculé
  )
  ON CONFLICT (competition_id, user_id) 
  DO UPDATE SET
    score = GREATEST(leaderboard.score, p_score),
    submission_id = CASE 
      WHEN p_score > leaderboard.score THEN p_submission_id
      ELSE leaderboard.submission_id
    END,
    best_score = GREATEST(leaderboard.best_score, p_score),
    submission_count = leaderboard.submission_count + 1,
    last_improvement_at = CASE 
      WHEN p_score > leaderboard.score THEN NOW()
      ELSE leaderboard.last_improvement_at
    END,
    updated_at = NOW();

  -- 5. Recalculer TOUS les rangs
  WITH ranked AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY score DESC, last_improvement_at ASC) as new_rank
    FROM leaderboard
    WHERE competition_id = v_competition_id
  )
  UPDATE leaderboard l
  SET rank = r.new_rank
  FROM ranked r
  WHERE l.user_id = r.user_id
    AND l.competition_id = v_competition_id;

  -- 6. Récupérer le rang final
  SELECT rank, (score = best_score) 
  INTO v_rank, v_is_best
  FROM leaderboard
  WHERE competition_id = v_competition_id 
    AND user_id = v_user_id;

  -- 7. Sauvegarder dans l'historique (AVEC LES BONNES COLONNES)
  INSERT INTO leaderboard_history (
    competition_id,
    user_id,
    submission_id,
    score,
    rank,
    previous_score,
    improvement,
    created_at
  ) VALUES (
    v_competition_id,
    v_user_id,
    p_submission_id,
    p_score,
    v_rank,
    v_previous_score,
    CASE 
      WHEN v_previous_score IS NOT NULL THEN p_score - v_previous_score
      ELSE NULL
    END,
    NOW()
  );

  -- 8. Retourner le résultat
  RETURN json_build_object(
    'submission_id', p_submission_id,
    'rank', v_rank,
    'score', p_score,
    'is_best_score', v_is_best,
    'previous_score', v_previous_score,
    'improvement', CASE 
      WHEN v_previous_score IS NOT NULL THEN p_score - v_previous_score
      ELSE NULL
    END,
    'success', true
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erreur évaluation: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ACCORDER LES PERMISSIONS
GRANT EXECUTE ON FUNCTION evaluate_submission_manually TO authenticated;
GRANT EXECUTE ON FUNCTION evaluate_submission_manually TO service_role;
GRANT EXECUTE ON FUNCTION evaluate_submission_manually TO anon;

-- 5. VÉRIFIER
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Fonction evaluate_submission_manually v2 créée';
  RAISE NOTICE '✅ Utilise les bonnes colonnes de leaderboard_history';
  RAISE NOTICE '✅ competition_id, user_id, submission_id, score, rank';
  RAISE NOTICE '========================================';
END $$;

