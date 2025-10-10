-- =====================================================
-- CREATE STORAGE BUCKET FOR COMPETITION DATASETS
-- =====================================================
-- Date: 9 octobre 2025
-- Description: Créer le bucket pour stocker les datasets de compétitions

-- 1. Créer le bucket (si pas déjà créé via l'interface)
INSERT INTO storage.buckets (id, name, public)
VALUES ('competition-datasets', 'competition-datasets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique d'upload : Admins uniquement
DROP POLICY IF EXISTS "Admins peuvent uploader des datasets" ON storage.objects;

CREATE POLICY "Admins peuvent uploader des datasets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'competition-datasets' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 3. Politique de lecture : Tous (datasets publics)
DROP POLICY IF EXISTS "Tout le monde peut télécharger les datasets" ON storage.objects;

CREATE POLICY "Tout le monde peut télécharger les datasets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'competition-datasets');

-- 4. Politique de suppression : Admins uniquement
DROP POLICY IF EXISTS "Admins peuvent supprimer des datasets" ON storage.objects;

CREATE POLICY "Admins peuvent supprimer des datasets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'competition-datasets' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Bucket "competition-datasets" créé avec succès !';
  RAISE NOTICE '📤 Seuls les admins peuvent uploader des datasets';
  RAISE NOTICE '📥 Tout le monde peut télécharger (public)';
  RAISE NOTICE '🗑️ Seuls les admins peuvent supprimer des datasets';
END $$;
