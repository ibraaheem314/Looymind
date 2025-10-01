-- =====================================================
-- LOOYMIND - SYSTEME COMPLET D'INTERACTIONS ARTICLES
-- Gestion des likes, vues et commentaires
-- =====================================================

-- =====================================================
-- TABLE: ARTICLE VIEWS (Vues uniques)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, user_id)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_user_id ON article_views(user_id);

-- RLS pour article_views
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enable_read_access_for_all" ON article_views;
CREATE POLICY "enable_read_access_for_all"
  ON article_views FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "enable_insert_access_for_all" ON article_views;
CREATE POLICY "enable_insert_access_for_all"
  ON article_views FOR INSERT
  WITH CHECK (true);

-- Permissions
GRANT ALL ON article_views TO anon, authenticated, service_role;

-- =====================================================
-- TRIGGERS: INCREMENT/DECREMENT LIKES
-- =====================================================

-- Fonction pour incrementer les likes d'articles
DROP FUNCTION IF EXISTS increment_article_likes() CASCADE;
CREATE OR REPLACE FUNCTION increment_article_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.article_id IS NOT NULL THEN
    UPDATE articles
    SET likes_count = likes_count + 1
    WHERE id = NEW.article_id;
    
    RAISE NOTICE 'Article % likes incremented', NEW.article_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour decrementer les likes d'articles
DROP FUNCTION IF EXISTS decrement_article_likes() CASCADE;
CREATE OR REPLACE FUNCTION decrement_article_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.article_id IS NOT NULL THEN
    UPDATE articles
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.article_id;
    
    RAISE NOTICE 'Article % likes decremented', OLD.article_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour likes
DROP TRIGGER IF EXISTS on_article_liked ON likes;
CREATE TRIGGER on_article_liked
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_article_likes();

DROP TRIGGER IF EXISTS on_article_unliked ON likes;
CREATE TRIGGER on_article_unliked
  AFTER DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_article_likes();

-- =====================================================
-- TRIGGERS: INCREMENT/DECREMENT VIEWS
-- =====================================================

-- Fonction pour incrementer les vues
DROP FUNCTION IF EXISTS increment_article_views() CASCADE;
CREATE OR REPLACE FUNCTION increment_article_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE articles
  SET views_count = views_count + 1
  WHERE id = NEW.article_id;
  
  RAISE NOTICE 'Article % views incremented', NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vues
DROP TRIGGER IF EXISTS on_article_viewed ON article_views;
CREATE TRIGGER on_article_viewed
  AFTER INSERT ON article_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_article_views();

-- =====================================================
-- TRIGGERS: INCREMENT/DECREMENT COMMENTS
-- =====================================================

-- Fonction pour incrementer les commentaires
DROP FUNCTION IF EXISTS increment_article_comments() CASCADE;
CREATE OR REPLACE FUNCTION increment_article_comments()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.article_id IS NOT NULL THEN
    UPDATE articles
    SET comments_count = comments_count + 1
    WHERE id = NEW.article_id;
    
    RAISE NOTICE 'Article % comments incremented', NEW.article_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour decrementer les commentaires
DROP FUNCTION IF EXISTS decrement_article_comments() CASCADE;
CREATE OR REPLACE FUNCTION decrement_article_comments()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.article_id IS NOT NULL THEN
    UPDATE articles
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.article_id;
    
    RAISE NOTICE 'Article % comments decremented', OLD.article_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour commentaires
DROP TRIGGER IF EXISTS on_article_commented ON comments;
CREATE TRIGGER on_article_commented
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_article_comments();

DROP TRIGGER IF EXISTS on_article_comment_deleted ON comments;
CREATE TRIGGER on_article_comment_deleted
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_article_comments();

-- =====================================================
-- VERIFICATION DES TRIGGERS
-- =====================================================

-- Afficher tous les triggers crees
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('likes', 'comments', 'article_views')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- FIN DU FICHIER
-- =====================================================

