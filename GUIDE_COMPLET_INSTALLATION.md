# 🚀 GUIDE COMPLET D'INSTALLATION - LOOYMIND

## 📁 STRUCTURE DES FICHIERS SQL

### **✅ FICHIERS ACTIFS (à utiliser)**

```
supabase/
├── OPTIMIZED_DATABASE_SCHEMA.sql    ⭐ INSTALLATION COMPLÈTE
├── RESET_AND_FIX_PROFILES.sql       🔧 RÉPARATION
└── README_INSTALLATION.md            📖 DOCUMENTATION
```

### **❌ FICHIERS SUPPRIMÉS (obsolètes)**
- ~~FIX_PROFILES_RLS_POLICIES.sql~~ → Fusionné dans RESET_AND_FIX_PROFILES.sql
- ~~TEST_OPTIMIZED_SCHEMA.sql~~ → Version de test obsolète
- ~~MIGRATION_TO_OPTIMIZED.sql~~ → Pour migration, non nécessaire

---

## 🎯 QUELLE PROCÉDURE SUIVRE ?

### **OPTION A : NOUVELLE INSTALLATION (recommandé)**

**Tu dois faire ça si :**
- ✅ C'est la première fois que tu installes la base de données
- ✅ Tu veux repartir de zéro avec un schéma propre
- ✅ Tu n'as pas encore de données importantes

**📋 ÉTAPES :**

#### **1. Nettoyer la base de données actuelle (si nécessaire)**

Va dans **Supabase Dashboard > SQL Editor** et exécute :

```sql
-- Supprimer le schéma public et le recréer
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

#### **2. Installer le schéma complet**

Copie-colle **`supabase/OPTIMIZED_DATABASE_SCHEMA.sql`** dans le SQL Editor et exécute.

#### **3. Vérifier l'installation**

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Vérifier les policies
SELECT tablename, policyname FROM pg_policies 
WHERE tablename = 'profiles';

-- Vérifier le trigger
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users' AND event_object_schema = 'auth';
```

**✅ Résultat attendu :**
- Tables : `profiles`, `challenges`, `projects`, `articles`, etc.
- 4 policies pour `profiles`
- Trigger `on_auth_user_created`

---

### **OPTION B : RÉPARATION (si problèmes)**

**Tu dois faire ça si :**
- ❌ Tu as l'erreur "permission denied for table profiles"
- ❌ Message "Profil non trouvé" sur `/profile`
- ❌ Les profils ne se créent pas automatiquement
- ❌ Tu as déjà des utilisateurs mais pas leurs profils

**📋 ÉTAPES :**

#### **1. Exécuter le script de réparation**

Copie-colle **`supabase/RESET_AND_FIX_PROFILES.sql`** dans le SQL Editor et exécute.

#### **2. Vérifier la réparation**

Le script affiche automatiquement :
- ✅ Nombre de profils créés
- ✅ Nombre d'utilisateurs auth.users
- ✅ Nombre de user_stats
- ✅ Liste des policies actives

#### **3. Tester**

1. Va sur http://localhost:3000/profile
2. Actualise (F5)
3. Ton profil devrait s'afficher !

---

## 🔍 DIAGNOSTIC : QUEL EST TON PROBLÈME ?

### **❓ Comment savoir quelle option choisir ?**

**Exécute ce diagnostic dans Supabase SQL Editor :**

```sql
-- Diagnostic complet
SELECT 
  'auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'profiles' as table_name,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'profiles sans utilisateur' as table_name,
  COUNT(*) as count
FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id)
UNION ALL
SELECT 
  'utilisateurs sans profil' as table_name,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);
```

**📊 INTERPRÉTATION :**

| Résultat | Signification | Action |
|----------|---------------|--------|
| `auth.users = 0, profiles = 0` | Base vide | **OPTION A** |
| `auth.users > 0, profiles = 0` | Profils manquants | **OPTION B** |
| `auth.users = profiles` | Tout va bien | Aucune action |
| `utilisateurs sans profil > 0` | Profils manquants | **OPTION B** |

---

## ✅ PROCÉDURE RECOMMANDÉE POUR TOI

**Basé sur tes erreurs actuelles, voici ce que tu dois faire :**

### **🎯 SOLUTION IMMÉDIATE**

**ÉTAPE 1 : Exécute le script de réparation**

```sql
-- Copie-colle ce SQL dans Supabase SQL Editor

-- 1. Supprimer anciennes policies
DROP POLICY IF EXISTS "Profils visibles par tous" ON profiles;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leur profil" ON profiles;
DROP POLICY IF EXISTS "Utilisateurs peuvent créer leur profil" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

-- 2. Créer nouvelles policies
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- 3. Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Créer profils manquants
INSERT INTO public.profiles (
  id, email, full_name, first_name, last_name, display_name, 
  role, experience_level, location, current_position, company, bio,
  github_url, linkedin_url, website_url, phone, interests, skills
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'role', 'member'),
  COALESCE(u.raw_user_meta_data->>'experience_level', 'debutant'),
  COALESCE(u.raw_user_meta_data->>'location', ''),
  COALESCE(u.raw_user_meta_data->>'current_position', ''),
  COALESCE(u.raw_user_meta_data->>'company', ''),
  COALESCE(u.raw_user_meta_data->>'bio', ''),
  COALESCE(u.raw_user_meta_data->>'github_url', ''),
  COALESCE(u.raw_user_meta_data->>'linkedin_url', ''),
  COALESCE(u.raw_user_meta_data->>'website_url', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  COALESCE(ARRAY(SELECT jsonb_array_elements_text(u.raw_user_meta_data->'interests')), '{}'),
  COALESCE(ARRAY(SELECT jsonb_array_elements_text(u.raw_user_meta_data->'skills')), '{}')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  experience_level = EXCLUDED.experience_level,
  location = EXCLUDED.location,
  current_position = EXCLUDED.current_position,
  company = EXCLUDED.company,
  bio = EXCLUDED.bio,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  website_url = EXCLUDED.website_url,
  phone = EXCLUDED.phone,
  interests = EXCLUDED.interests,
  skills = EXCLUDED.skills,
  updated_at = now();

-- 5. Vérification
SELECT 'auth.users' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'profiles' as type, COUNT(*) as count FROM profiles;
```

**ÉTAPE 2 : Tester**

1. Va sur http://localhost:3000/profile
2. Appuie sur F5 (actualiser)
3. **Ton profil devrait maintenant s'afficher !**

---

## 📝 RÉCAPITULATIF FINAL

### **✅ CE QUE TU DOIS FAIRE MAINTENANT :**

1. **Copie le SQL ci-dessus** (ÉTAPE 1)
2. **Va dans Supabase Dashboard > SQL Editor**
3. **Colle et exécute le SQL**
4. **Attends le message "Success"**
5. **Retourne sur ton application et actualise**

### **📁 FICHIERS À GARDER :**

```
supabase/
├── OPTIMIZED_DATABASE_SCHEMA.sql    ⭐ Pour nouvelle installation
├── RESET_AND_FIX_PROFILES.sql       🔧 Pour réparation (CE QUE TU UTILISES)
└── README_INSTALLATION.md            📖 Documentation
```

### **❌ FICHIERS SUPPRIMÉS :**
- ~~FIX_PROFILES_RLS_POLICIES.sql~~
- ~~TEST_OPTIMIZED_SCHEMA.sql~~
- ~~MIGRATION_TO_OPTIMIZED.sql~~

---

## 🎉 APRÈS L'EXÉCUTION

**Tu devrais voir :**
- ✅ Policies créées (4 pour profiles)
- ✅ Profils créés pour tous les utilisateurs
- ✅ Message de vérification avec le compte

**Sur ton application :**
- ✅ Page `/profile` fonctionne
- ✅ Profil complet affiché
- ✅ Modification possible
- ✅ Dashboard fonctionne

---

**🚀 EXÉCUTE LE SQL CI-DESSUS ET DIS-MOI CE QUI SE PASSE !**
