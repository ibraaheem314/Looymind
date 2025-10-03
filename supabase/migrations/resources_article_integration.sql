-- =====================================================
-- INTÉGRATION ARTICLES ↔ RESSOURCES
-- Permet aux articles internes d'être affichés comme ressources éducatives
-- =====================================================

-- 1. Ajouter la colonne article_id à la table resources
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS article_id UUID REFERENCES articles(id) ON DELETE CASCADE;

-- 2. Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_resources_article_id ON resources(article_id);

-- 3. Fonction pour synchroniser automatiquement un article → ressource
CREATE OR REPLACE FUNCTION sync_article_to_resource()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  resource_slug TEXT;
  resource_category TEXT;
  resource_difficulty TEXT;
BEGIN
  -- Synchroniser TOUS les articles publiés (pas seulement certaines catégories)
  IF NEW.status = 'published' THEN
    
    -- Générer un slug unique pour la ressource
    resource_slug := 'article-' || NEW.slug;
    
    -- Mapper la catégorie d'article vers une catégorie de ressource
    resource_category := CASE 
      WHEN NEW.category = 'Tutorial' THEN 'ia'
      WHEN NEW.category = 'Guide' THEN 'data-science'
      WHEN NEW.category = 'Documentation' THEN 'dev'
      ELSE 'other'
    END;
    
    -- Définir une difficulté par défaut
    resource_difficulty := 'beginner';
    
    -- Insérer ou mettre à jour la ressource
    INSERT INTO resources (
      article_id,
      title,
      slug,
      description,
      type,
      url,
      source,
      is_local,
      category,
      tags,
      difficulty,
      is_free,
      has_certificate,
      language,
      status,
      visibility,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.title,
      resource_slug,
      NEW.excerpt,
      'article',
      '/articles/' || NEW.slug, -- URL interne
      'LooyMind Community',
      true, -- Article local
      resource_category,
      ARRAY[]::TEXT[], -- Tags vides par défaut
      resource_difficulty,
      true, -- Gratuit
      false,
      'fr',
      'published',
      'public',
      NEW.author_id,
      NEW.created_at,
      NEW.updated_at
    )
    ON CONFLICT (article_id) 
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      url = EXCLUDED.url,
      updated_at = EXCLUDED.updated_at,
      status = EXCLUDED.status;
      
  ELSIF OLD.status = 'published' AND NEW.status != 'published' THEN
    -- Si l'article n'est plus publié, archiver la ressource
    UPDATE resources 
    SET status = 'archived', updated_at = NOW()
    WHERE article_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Créer le trigger pour synchronisation automatique
DROP TRIGGER IF EXISTS trigger_sync_article_to_resource ON articles;
CREATE TRIGGER trigger_sync_article_to_resource
AFTER INSERT OR UPDATE OF status, title, excerpt, slug
ON articles
FOR EACH ROW
EXECUTE FUNCTION sync_article_to_resource();

-- 5. Ajouter une contrainte UNIQUE sur article_id (un article = une ressource max)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_article_resource'
  ) THEN
    ALTER TABLE resources ADD CONSTRAINT unique_article_resource UNIQUE (article_id);
  END IF;
END $$;

-- 6. Fonction pour récupérer tous les articles publiés qui ne sont pas encore des ressources
CREATE OR REPLACE FUNCTION get_articles_not_in_resources()
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  category TEXT,
  author_id UUID,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.category,
    a.author_id,
    a.created_at
  FROM articles a
  LEFT JOIN resources r ON r.article_id = a.id
  WHERE 
    a.status = 'published'
    AND r.id IS NULL
  ORDER BY a.created_at DESC;
END;
$$;

-- 7. Fonction pour obtenir les stats des ressources par type
CREATE OR REPLACE FUNCTION get_resources_stats()
RETURNS TABLE (
  resource_type TEXT,
  total_count BIGINT,
  internal_count BIGINT,
  external_count BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT 
    type::TEXT as resource_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_local = true) as internal_count,
    COUNT(*) FILTER (WHERE is_local = false) as external_count
  FROM resources
  WHERE status = 'published' AND visibility = 'public'
  GROUP BY type
  ORDER BY total_count DESC;
$$;

-- 8. Synchroniser les articles existants (one-time migration)
-- Cette fonction sera exécutée manuellement après le déploiement
CREATE OR REPLACE FUNCTION sync_existing_articles_to_resources()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  articles_synced INTEGER := 0;
  article_record RECORD;
  resource_slug TEXT;
  resource_category TEXT;
BEGIN
  FOR article_record IN 
    SELECT * FROM articles 
    WHERE status = 'published'
  LOOP
    -- Générer un slug unique
    resource_slug := 'article-' || article_record.slug;
    
    -- Mapper la catégorie (utiliser 'other' par défaut)
    resource_category := 'other';
    
    -- Insérer ou mettre à jour la ressource
    INSERT INTO resources (
      article_id,
      title,
      slug,
      description,
      type,
      url,
      source,
      is_local,
      category,
      tags,
      difficulty,
      is_free,
      has_certificate,
      language,
      status,
      visibility,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      article_record.id,
      article_record.title,
      resource_slug,
      article_record.excerpt,
      'article',
      '/articles/' || article_record.slug,
      'LooyMind Community',
      true,
      resource_category,
      article_record.tags,
      'beginner',
      true,
      false,
      'fr',
      'published',
      'public',
      article_record.author_id,
      article_record.created_at,
      article_record.updated_at
    )
    ON CONFLICT (article_id) 
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      url = EXCLUDED.url,
      updated_at = EXCLUDED.updated_at;
      
    articles_synced := articles_synced + 1;
  END LOOP;
  
  RETURN articles_synced;
END;
$$;

-- 9. Permissions
GRANT EXECUTE ON FUNCTION sync_article_to_resource() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_articles_not_in_resources() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_resources_stats() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION sync_existing_articles_to_resources() TO authenticated;

-- 10. Commentaires pour documentation
COMMENT ON COLUMN resources.article_id IS 'Référence optionnelle à un article interne de la plateforme';
COMMENT ON FUNCTION sync_article_to_resource() IS 'Synchronise automatiquement les articles éducatifs publiés vers la section Ressources';
COMMENT ON FUNCTION get_articles_not_in_resources() IS 'Retourne les articles éducatifs qui ne sont pas encore listés comme ressources';
COMMENT ON FUNCTION get_resources_stats() IS 'Statistiques sur les ressources par type (internes vs externes)';

-- =====================================================
-- NOTES D'UTILISATION :
-- 
-- 1. TOUS les articles publiés sont automatiquement synchronisés comme ressources
-- 
-- 2. Pour synchroniser les articles existants (après installation) :
--    SELECT sync_existing_articles_to_resources();
--    -- Retourne le nombre d'articles synchronisés
-- 
-- 3. Pour voir les articles non synchronisés :
--    SELECT * FROM get_articles_not_in_resources();
-- 
-- 4. Pour voir les statistiques :
--    SELECT * FROM get_resources_stats();
-- 
-- 5. Pour voir combien d'articles sont déjà synchronisés :
--    SELECT COUNT(*) FROM resources WHERE article_id IS NOT NULL;
-- 
-- 6. Pour voir les articles en tant que ressources :
--    SELECT r.title, r.url, r.source, a.category as article_category
--    FROM resources r
--    JOIN articles a ON a.id = r.article_id
--    WHERE r.type = 'article';
-- =====================================================

