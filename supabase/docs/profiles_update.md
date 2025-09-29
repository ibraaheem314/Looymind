# Mise à jour du schéma de la table profiles

## Problème
La colonne `experience_level` n'existe pas dans la table `profiles`, ce qui cause l'erreur lors de l'inscription.

## Solution
Exécutez ce script SQL dans votre dashboard Supabase pour ajouter les colonnes manquantes :

```sql
-- Ajouter les colonnes manquantes à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20) DEFAULT 'debutant',
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS current_position VARCHAR(200),
ADD COLUMN IF NOT EXISTS company VARCHAR(200),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Mettre à jour la contrainte CHECK pour experience_level
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('debutant', 'intermediaire', 'avance', 'expert'));

-- Mettre à jour la contrainte CHECK pour role
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('member', 'mentor', 'org', 'admin'));

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON profiles USING GIN(interests);
```

## Vérification
Après avoir exécuté ce script, vérifiez que la table `profiles` contient bien toutes les colonnes :

```sql
-- Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

## Instructions
1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet "SQL Editor"
3. Exécutez le script SQL ci-dessus
4. Vérifiez que l'erreur est résolue en testant l'inscription
