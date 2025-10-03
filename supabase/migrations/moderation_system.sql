-- =====================================================
-- SYSTÈME DE MODÉRATION COMPLET
-- Tables pour signalements, actions de modération, logs
-- =====================================================

-- 1. Table des signalements (reports)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'project', 'comment', 'profile', 'competition')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'spam',
    'harassment',
    'inappropriate_content',
    'misinformation',
    'copyright',
    'violence',
    'hate_speech',
    'sexual_content',
    'scam',
    'other'
  )),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'rejected')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des actions de modération
CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'delete_content',
    'hide_content',
    'warn_user',
    'suspend_user',
    'ban_user',
    'restore_content',
    'dismiss_report'
  )),
  target_type TEXT NOT NULL CHECK (target_type IN ('article', 'project', 'comment', 'profile', 'user')),
  target_id UUID NOT NULL,
  reason TEXT,
  duration_days INTEGER, -- Pour les suspensions temporaires
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des sanctions utilisateurs
CREATE TABLE IF NOT EXISTS public.user_sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sanction_type TEXT NOT NULL CHECK (sanction_type IN ('warning', 'suspension', 'ban')),
  reason TEXT NOT NULL,
  issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ, -- NULL pour les bans permanents
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ajouter un champ "status" dans profiles pour suivre les bans
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' 
CHECK (account_status IN ('active', 'warned', 'suspended', 'banned'));

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_content ON public.reports(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reports_created ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_moderator ON public.moderation_actions(moderator_id);
CREATE INDEX IF NOT EXISTS idx_user_sanctions_user ON public.user_sanctions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sanctions_active ON public.user_sanctions(active) WHERE active = true;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Reports: Les utilisateurs peuvent créer et voir leurs propres signalements
-- Les admins/moderators peuvent tout voir
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_reports ON public.reports;
CREATE POLICY select_own_reports ON public.reports
  FOR SELECT
  USING (
    auth.uid() = reporter_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS insert_reports ON public.reports;
CREATE POLICY insert_reports ON public.reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS update_reports_moderators ON public.reports;
CREATE POLICY update_reports_moderators ON public.reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

-- Moderation Actions: Seulement les admins/moderators
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_moderation_actions ON public.moderation_actions;
CREATE POLICY select_moderation_actions ON public.moderation_actions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS insert_moderation_actions ON public.moderation_actions;
CREATE POLICY insert_moderation_actions ON public.moderation_actions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

-- User Sanctions: Seulement les admins/moderators peuvent voir et créer
ALTER TABLE public.user_sanctions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_sanctions ON public.user_sanctions;
CREATE POLICY select_sanctions ON public.user_sanctions
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS insert_sanctions ON public.user_sanctions;
CREATE POLICY insert_sanctions ON public.user_sanctions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS update_sanctions ON public.user_sanctions;
CREATE POLICY update_sanctions ON public.user_sanctions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour le statut du compte utilisateur
CREATE OR REPLACE FUNCTION update_user_account_status()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si une nouvelle sanction active est créée, mettre à jour le profil
  IF NEW.active = true THEN
    UPDATE profiles
    SET account_status = 
      CASE 
        WHEN NEW.sanction_type = 'warning' THEN 'warned'
        WHEN NEW.sanction_type = 'suspension' THEN 'suspended'
        WHEN NEW.sanction_type = 'ban' THEN 'banned'
        ELSE account_status
      END
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour mettre à jour automatiquement le statut du compte
DROP TRIGGER IF EXISTS on_sanction_created ON public.user_sanctions;
CREATE TRIGGER on_sanction_created
AFTER INSERT ON public.user_sanctions
FOR EACH ROW
EXECUTE FUNCTION update_user_account_status();

-- Fonction pour désactiver automatiquement les sanctions expirées
CREATE OR REPLACE FUNCTION deactivate_expired_sanctions()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Désactiver les sanctions expirées
  UPDATE user_sanctions
  SET active = false
  WHERE active = true 
    AND end_date IS NOT NULL 
    AND end_date < NOW();
  
  -- Réactiver le compte des utilisateurs dont toutes les sanctions sont expirées
  UPDATE profiles
  SET account_status = 'active'
  WHERE account_status IN ('warned', 'suspended')
    AND id NOT IN (
      SELECT user_id FROM user_sanctions 
      WHERE active = true
    );
END;
$$;

-- =====================================================
-- PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.moderation_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_sanctions TO authenticated;

GRANT EXECUTE ON FUNCTION update_user_account_status() TO authenticated;
GRANT EXECUTE ON FUNCTION deactivate_expired_sanctions() TO authenticated;

-- =====================================================
-- NOTES D'UTILISATION
-- =====================================================

/*
USAGE:

1. Créer un signalement:
   INSERT INTO reports (reporter_id, content_type, content_id, reason, description)
   VALUES (auth.uid(), 'article', 'article-uuid', 'spam', 'Cet article est du spam');

2. Modérer un signalement:
   UPDATE reports
   SET status = 'resolved', 
       reviewed_by = auth.uid(), 
       reviewed_at = NOW(),
       resolution_note = 'Contenu supprimé'
   WHERE id = 'report-uuid';

3. Créer une action de modération:
   INSERT INTO moderation_actions (moderator_id, report_id, action_type, target_type, target_id, reason)
   VALUES (auth.uid(), 'report-uuid', 'delete_content', 'article', 'article-uuid', 'Spam confirmé');

4. Bannir un utilisateur:
   INSERT INTO user_sanctions (user_id, sanction_type, reason, issued_by)
   VALUES ('user-uuid', 'ban', 'Spam répété', auth.uid());

5. Nettoyer les sanctions expirées (à exécuter périodiquement):
   SELECT deactivate_expired_sanctions();
*/

