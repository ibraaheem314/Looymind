-- =====================================================
-- SYSTÈME DE DATASETS POUR COMPÉTITIONS
-- =====================================================
-- Date: 2025-10-09
-- Description: Gestion des fichiers de données pour les compétitions
-- =====================================================

-- Table: competition_datasets
CREATE TABLE IF NOT EXISTS competition_datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  
  -- Informations sur le fichier
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('train', 'test', 'sample_submission', 'solution', 'other')),
  file_size BIGINT NOT NULL, -- en bytes
  file_url TEXT NOT NULL, -- URL Supabase Storage
  
  -- Métadonnées
  description TEXT,
  columns_info JSONB, -- Exemple: [{"name": "id", "type": "int", "description": "..."}, ...]
  row_count INTEGER,
  
  -- Contrôle d'accès
  is_public BOOLEAN DEFAULT true, -- false si visible uniquement après inscription
  download_count INTEGER DEFAULT 0,
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_datasets_competition ON competition_datasets(competition_id);
CREATE INDEX IF NOT EXISTS idx_datasets_type ON competition_datasets(file_type);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_dataset_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_dataset_timestamp
BEFORE UPDATE ON competition_datasets
FOR EACH ROW
EXECUTE FUNCTION update_dataset_updated_at();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE competition_datasets ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les datasets publics
CREATE POLICY "Datasets publics visibles par tous"
ON competition_datasets FOR SELECT
USING (is_public = true);

-- Les participants peuvent voir les datasets de leurs compétitions
CREATE POLICY "Participants voient les datasets de leurs compétitions"
ON competition_datasets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM submissions
    WHERE submissions.competition_id = competition_datasets.competition_id
    AND submissions.user_id = auth.uid()
  )
);

-- Les admins peuvent tout voir
CREATE POLICY "Admins voient tous les datasets"
ON competition_datasets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Seuls les admins peuvent insérer/modifier/supprimer
CREATE POLICY "Admins gèrent les datasets"
ON competition_datasets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- FONCTION : Incrémenter le compteur de téléchargements
-- =====================================================

CREATE OR REPLACE FUNCTION increment_dataset_downloads(dataset_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE competition_datasets
  SET download_count = download_count + 1
  WHERE id = dataset_id;
END;
$$;

-- =====================================================
-- BUCKET SUPABASE STORAGE : competition-datasets
-- =====================================================

-- À exécuter dans Supabase Dashboard > Storage ou via SQL:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('competition-datasets', 'competition-datasets', true);

-- Politique d'upload : Admins uniquement
-- CREATE POLICY "Admins peuvent uploader des datasets"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'competition-datasets' AND
--   (auth.jwt() ->> 'role') = 'admin'
-- );

-- Politique de lecture : Tous
-- CREATE POLICY "Tout le monde peut télécharger les datasets"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'competition-datasets');

-- =====================================================
-- VUE : Datasets avec infos compétition
-- =====================================================

CREATE OR REPLACE VIEW competition_datasets_view AS
SELECT 
  cd.*,
  c.title as competition_title,
  c.slug as competition_slug,
  c.status as competition_status,
  p.display_name as uploaded_by_name
FROM competition_datasets cd
LEFT JOIN competitions c ON c.id = cd.competition_id
LEFT JOIN profiles p ON p.id = cd.uploaded_by;

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Exemple pour ajouter un dataset à une compétition existante:
/*
INSERT INTO competition_datasets (
  competition_id,
  file_name,
  file_type,
  file_size,
  file_url,
  description,
  columns_info,
  row_count,
  is_public,
  uploaded_by
) VALUES (
  (SELECT id FROM competitions LIMIT 1), -- Prendre la première compétition
  'train.csv',
  'train',
  1048576, -- 1MB
  'https://your-supabase-url/storage/v1/object/public/competition-datasets/train.csv',
  'Données d''entraînement pour la compétition',
  '[
    {"name": "id", "type": "int", "description": "Identifiant unique"},
    {"name": "feature1", "type": "float", "description": "Première feature"},
    {"name": "target", "type": "int", "description": "Variable cible"}
  ]'::jsonb,
  10000,
  true,
  (SELECT id FROM auth.users WHERE email = 'admin@example.com')
);
*/

-- =====================================================
-- RÉSUMÉ
-- =====================================================

/*
TABLES CRÉÉES:
- competition_datasets : Stockage des métadonnées des fichiers

FONCTIONS:
- increment_dataset_downloads(dataset_id) : Incrémenter téléchargements

VUES:
- competition_datasets_view : Datasets avec infos complètes

RLS POLICIES:
- Lecture publique pour datasets publics
- Lecture pour participants de la compétition
- Gestion complète pour admins

BUCKET STORAGE:
- competition-datasets (à créer manuellement dans Supabase)

PROCHAINES ÉTAPES:
1. Créer le bucket dans Supabase Dashboard
2. Créer l'interface d'upload admin
3. Créer la page de téléchargement pour participants
*/

