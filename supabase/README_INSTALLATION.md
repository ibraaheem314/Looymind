# 📚 GUIDE D'INSTALLATION DE LA BASE DE DONNÉES LOOYMIND

## 🎯 FICHIERS SQL DISPONIBLES

### **✅ FICHIERS À UTILISER :**

1. **`OPTIMIZED_DATABASE_SCHEMA.sql`** ⭐ **NOUVELLE INSTALLATION**
   - **Utilité :** Schéma complet optimisé pour une nouvelle installation
   - **Quand l'utiliser :** Lors de la création initiale de la base de données
   - **Contenu :**
     - ✅ Toutes les tables (profiles, challenges, projects, articles, etc.)
     - ✅ Indexes optimisés pour les performances
     - ✅ Triggers automatiques (création de profil, mise à jour timestamps)
     - ✅ Policies RLS correctement configurées
     - ✅ Fonctions utilitaires (classements, statistiques)

2. **`RESET_AND_FIX_PROFILES.sql`** 🔧 **RÉPARATION**
   - **Utilité :** Réparer les problèmes de profils existants
   - **Quand l'utiliser :** Si tu as l'erreur "permission denied for table profiles"
   - **Contenu :**
     - ✅ Correction des policies RLS pour `profiles`
     - ✅ Recréation du trigger `handle_new_user()`
     - ✅ Création des profils manquants pour les utilisateurs existants
     - ✅ Vérifications et diagnostics

### **❌ FICHIERS SUPPRIMÉS (obsolètes) :**
- ~~`FIX_PROFILES_RLS_POLICIES.sql`~~ → Contenu fusionné dans `RESET_AND_FIX_PROFILES.sql`
- ~~`TEST_OPTIMIZED_SCHEMA.sql`~~ → Version de test, remplacée par la version finale
- ~~`MIGRATION_TO_OPTIMIZED.sql`~~ → Pour migration depuis ancien schéma, non nécessaire

---

## 🚀 PROCÉDURE D'INSTALLATION

### **SCÉNARIO 1 : NOUVELLE INSTALLATION (Base de données vide)**

#### **Étape 1 : Préparer Supabase**
1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet **Looymind**
3. Va dans **SQL Editor** (menu gauche)

#### **Étape 2 : Exécuter le schéma complet**
1. Clique sur **"New Query"**
2. Copie-colle le contenu de **`OPTIMIZED_DATABASE_SCHEMA.sql`**
3. Clique sur **"Run"** (ou Ctrl+Enter)
4. ⏱️ Attends quelques secondes (le script est long)
5. ✅ Tu devrais voir "Success. No rows returned"

#### **Étape 3 : Vérifier l'installation**
```sql
-- Vérifier que les tables sont créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les policies RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Vérifier les triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
ORDER BY trigger_name;
```

**Résultats attendus :**
- ✅ Tables : `profiles`, `challenges`, `submissions`, `projects`, `articles`, etc.
- ✅ Policies : 4 policies pour `profiles` (select, insert, update, delete)
- ✅ Trigger : `on_auth_user_created` sur `auth.users`

---

### **SCÉNARIO 2 : BASE EXISTANTE AVEC PROBLÈMES**

Si tu as déjà une base de données mais que tu rencontres des erreurs :

#### **Symptômes :**
- ❌ "permission denied for table profiles"
- ❌ "Profil non trouvé" après inscription
- ❌ Les utilisateurs existent dans `auth.users` mais pas dans `profiles`

#### **Solution : Exécuter le script de réparation**

1. Va dans **SQL Editor** dans Supabase
2. Copie-colle le contenu de **`RESET_AND_FIX_PROFILES.sql`**
3. Clique sur **"Run"**
4. ✅ Le script va :
   - Supprimer et recréer les policies RLS
   - Recréer le trigger avec gestion d'erreurs
   - Créer les profils manquants pour tous les utilisateurs existants
   - Afficher un rapport de vérification

#### **Vérification après réparation**
```sql
-- Comparer le nombre d'utilisateurs et de profils
SELECT 'Utilisateurs' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Profils' as type, COUNT(*) as count FROM profiles;
```

**Les deux nombres doivent être identiques !**

---

## 📋 CHECKLIST POST-INSTALLATION

### **✅ VÉRIFICATIONS OBLIGATOIRES**

- [ ] **Tables créées**
  ```sql
  SELECT COUNT(*) FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
  Résultat attendu : Au moins 15 tables

- [ ] **RLS activé sur profiles**
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename = 'profiles';
  ```
  Résultat : `rowsecurity = true`

- [ ] **Policies RLS créées**
  ```sql
  SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles';
  ```
  Résultat : 4 policies

- [ ] **Trigger actif**
  ```sql
  SELECT trigger_name 
  FROM information_schema.triggers 
  WHERE event_object_table = 'users' AND event_object_schema = 'auth';
  ```
  Résultat : `on_auth_user_created`

- [ ] **Test d'inscription**
  - Crée un nouveau compte sur http://localhost:3000/register
  - Vérifie que le profil est créé automatiquement
  ```sql
  SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;
  ```

---

## 🔧 DÉPANNAGE

### **Problème : "relation does not exist"**
**Cause :** Les tables n'ont pas été créées
**Solution :** Exécute `OPTIMIZED_DATABASE_SCHEMA.sql`

### **Problème : "permission denied for table profiles"**
**Cause :** Policies RLS incorrectes ou manquantes
**Solution :** Exécute `RESET_AND_FIX_PROFILES.sql`

### **Problème : "Profil non trouvé" après inscription**
**Cause :** Le trigger ne s'est pas exécuté
**Solution :** 
1. Vérifie que le trigger existe
2. Exécute `RESET_AND_FIX_PROFILES.sql`
3. Crée manuellement le profil :
```sql
SELECT handle_new_user() 
FROM auth.users 
WHERE email = 'ton-email@example.com';
```

### **Problème : Profils manquants pour utilisateurs existants**
**Cause :** Le trigger n'était pas actif lors de l'inscription
**Solution :** Exécute `RESET_AND_FIX_PROFILES.sql`

---

## 📊 COMMANDES UTILES

### **Voir tous les profils**
```sql
SELECT id, email, display_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

### **Voir les utilisateurs sans profil**
```sql
SELECT u.id, u.email, u.created_at
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);
```

### **Supprimer TOUTES les données (⚠️ DANGEREUX)**
```sql
-- Supprimer toutes les données mais garder la structure
TRUNCATE profiles, challenges, submissions, projects, 
         articles, comments, notifications, user_stats CASCADE;

-- OU supprimer complètement les tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### **Réinitialiser uniquement les profils**
```sql
-- Supprimer tous les profils
TRUNCATE profiles CASCADE;

-- Recréer à partir de auth.users
-- (Utilise le contenu de RESET_AND_FIX_PROFILES.sql)
```

---

## 🎯 RECOMMANDATIONS

### **Pour un nouveau projet :**
1. ✅ Exécute **`OPTIMIZED_DATABASE_SCHEMA.sql`** une seule fois
2. ✅ Ne touche plus aux scripts après
3. ✅ Tous les changements futurs via migrations

### **Pour un projet existant avec problèmes :**
1. ✅ Exécute **`RESET_AND_FIX_PROFILES.sql`**
2. ✅ Vérifie que tout fonctionne
3. ✅ Si toujours des problèmes, contacte-moi avec les logs

### **Bonnes pratiques :**
- 🔒 Ne jamais modifier `auth.users` manuellement
- 📊 Toujours vérifier les policies RLS avant de mettre en production
- 🧪 Tester avec un utilisateur de test avant le déploiement
- 📝 Garder une copie de backup avant les modifications SQL

---

## 📞 SUPPORT

Si tu rencontres des problèmes :
1. Vérifie les logs dans **Supabase Dashboard > Logs**
2. Exécute les commandes de vérification ci-dessus
3. Note les messages d'erreur exacts
4. Contacte-moi avec :
   - Le message d'erreur
   - Les résultats des vérifications
   - Les logs Supabase

---

**✅ Avec ces 2 scripts, tu es paré pour toutes les situations !**
