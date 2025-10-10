-- Vérifier si les ressources ont les nouvelles colonnes
SELECT 
  id, 
  title, 
  level, 
  domains, 
  lang, 
  duration_minutes, 
  quality_score 
FROM resources 
WHERE level IS NOT NULL 
  AND domains IS NOT NULL 
  AND lang IS NOT NULL
LIMIT 10;

-- Compter combien de ressources ont les nouvelles colonnes
SELECT 
  COUNT(*) as total_resources,
  COUNT(level) as with_level,
  COUNT(domains) as with_domains,
  COUNT(lang) as with_lang
FROM resources;

