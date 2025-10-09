-- =====================================================
-- CREATE STORAGE BUCKET FOR COMPETITION SUBMISSIONS
-- =====================================================
-- Date: 9 octobre 2025
-- Description: Créer le bucket pour stocker les fichiers de soumission

-- 1. Créer le bucket (si pas déjà créé via l'interface)
INSERT INTO storage.buckets (id, name, public)
VALUES ('competition-submissions', 'competition-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permettre aux utilisateurs authentifiés d'uploader
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'competition-submissions');

-- 3. Permettre à tous de télécharger (lecture publique)
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'competition-submissions');

-- 4. Permettre aux utilisateurs de supprimer leurs propres fichiers
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'competition-submissions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Bucket "competition-submissions" créé avec succès !';
  RAISE NOTICE '📤 Les utilisateurs authentifiés peuvent uploader';
  RAISE NOTICE '📥 Tout le monde peut télécharger (public)';
  RAISE NOTICE '🗑️ Les utilisateurs peuvent supprimer leurs propres fichiers';
END $$;

