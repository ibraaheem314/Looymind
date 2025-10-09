# 🏆 AUDIT COMPLET - SYSTÈME DE COMPÉTITIONS PALANTEER

**Date:** 9 octobre 2025  
**Status:** En cours de refonte  
**Objectif:** Identifier et corriger tous les problèmes du système de compétitions

---

## 📊 RÉSUMÉ EXÉCUTIF

### ❌ Problèmes Critiques Identifiés
1. **Leaderboard inaccessible** - Erreur "permission denied for table leaderboard"
2. **Incohérence des tables** - `leaderboard` existe en 2 versions différentes dans 2 scripts SQL
3. **Colonnes manquantes** - Conflit entre `competitions_system.sql` et `submissions_manual_evaluation.sql`
4. **RLS policies conflictuelles** - Policies mal configurées ou dupliquées
5. **Flux utilisateur brisé** - Impossible de voir le classement après soumission

### ✅ Points Forts du Système Actuel
1. ✅ Interface de création de compétitions complète
2. ✅ Formulaire de soumission fonctionnel (upload de fichiers)
3. ✅ Panel admin pour évaluation manuelle
4. ✅ Structure SQL bien organisée (mais incohérente)

---

## 🔍 DIAGNOSTIC DÉTAILLÉ

### 1️⃣ STRUCTURE SQL - TABLES

#### Table `competitions`
**Fichier:** `supabase/migrations/competitions_system.sql`
**Status:** ✅ **OK**

```sql
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category VARCHAR(50) NOT NULL DEFAULT 'data-science',
  difficulty VARCHAR(20) NOT NULL DEFAULT 'intermediate',
  dataset_description TEXT,
  dataset_url TEXT,
  metric_type VARCHAR(50) NOT NULL DEFAULT 'accuracy',
  metric_description TEXT,
  evaluation_criteria TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  prize_amount INTEGER,
  prize_description TEXT,
  rules TEXT,
  participants_count INTEGER DEFAULT 0,
  submissions_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**✅ Commentaire:** Structure complète et cohérente.

---

#### Table `submissions`
**Fichier:** `supabase/migrations/competitions_system.sql` (initial)  
**Modifiée par:** `supabase/migrations/submissions_manual_evaluation.sql`

**📌 PROBLÈME CRITIQUE:** Colonnes ajoutées dynamiquement par un script séparé !

**Colonnes initiales (competitions_system.sql):**
```sql
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES competitions(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  score FLOAT,  -- ⚠️ Peut être NULL
  metric_details JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP DEFAULT NOW(),
  scored_at TIMESTAMP
);
```

**Colonnes ajoutées par submissions_manual_evaluation.sql:**
```sql
ALTER TABLE submissions ADD COLUMN score DECIMAL(10, 6);  -- ⚠️ Redondance !
ALTER TABLE submissions ADD COLUMN evaluation_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE submissions ADD COLUMN evaluated_by UUID REFERENCES profiles(id);
ALTER TABLE submissions ADD COLUMN evaluated_at TIMESTAMP;
ALTER TABLE submissions ADD COLUMN feedback TEXT;
ALTER TABLE submissions ADD COLUMN rank INTEGER;
```

**❌ PROBLÈMES:**
- `score` existe déjà (FLOAT) mais est ré-ajouté (DECIMAL) !
- `status` existe déjà mais `evaluation_status` est ajouté en doublon !
- Confusion entre `scored_at` et `evaluated_at`

**✅ SOLUTION:**
Fusionner les deux définitions en une seule table cohérente.

---

#### Table `leaderboard`
**📌 PROBLÈME CRITIQUE:** Existe en **2 VERSIONS DIFFÉRENTES** !

**Version 1 (competitions_system.sql):**
```sql
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES competitions(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  best_score FLOAT NOT NULL,  -- ⚠️ FLOAT
  best_submission_id UUID REFERENCES submissions(id),
  submissions_count INTEGER DEFAULT 1,
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(competition_id, user_id)
);
```

**Version 2 (leaderboard_system.sql):**
```sql
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES competitions(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  submission_id UUID REFERENCES submissions(id),  -- ⚠️ Différent !
  score DECIMAL(10, 6) NOT NULL,  -- ⚠️ DECIMAL au lieu de FLOAT
  rank INTEGER,
  submission_count INTEGER DEFAULT 1,  -- ⚠️ Nom différent !
  best_score DECIMAL(10, 6),  -- ⚠️ Colonne supplémentaire
  last_improvement_at TIMESTAMP,  -- ⚠️ Colonne supplémentaire
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(competition_id, user_id)
);
```

**❌ PROBLÈMES:**
- **Conflit de colonnes :** `best_score` vs `score` + `best_score`
- **Types différents :** `FLOAT` vs `DECIMAL(10, 6)`
- **Noms différents :** `submissions_count` vs `submission_count`
- **Colonnes manquantes :** `last_improvement_at` seulement dans v2

**✅ SOLUTION:**
Supprimer `competitions_system.sql:leaderboard` et garder uniquement `leaderboard_system.sql` (version 2).

---

### 2️⃣ RLS POLICIES - PERMISSIONS

#### Policies actuelles sur `leaderboard`

**Fichier: leaderboard_system.sql (lignes 266-289)**
```sql
-- Policy 1: Lecture publique
CREATE POLICY "Leaderboards publics lisibles par tous"
  ON leaderboard FOR SELECT
  USING (true);  -- ✅ Permet à tout le monde de voir

-- Policy 2: Historique personnel
CREATE POLICY "Utilisateurs peuvent voir leur historique"
  ON leaderboard_history FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 3: Admins
CREATE POLICY "Admins peuvent tout voir"
  ON leaderboard FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**📌 PROBLÈME:** 
- La policy existe mais le système retourne "permission denied"
- Possible conflit avec d'autres policies ou grants manquants

**✅ SOLUTION (fix_leaderboard_rls.sql):**
1. Désactiver RLS temporairement
2. Supprimer **toutes** les policies existantes
3. Recréer des policies ultra-permissives
4. Ajouter les GRANT nécessaires

---

### 3️⃣ FLUX UTILISATEUR - ÉTAPES

#### Flux Actuel (Théorique)
```
1. User crée un compte ✅
2. User browse les compétitions ✅
3. User clique sur une compétition ✅
4. User voit les onglets: Vue d'ensemble, Règles, Données, Classement ✅
5. User clique sur "Soumettre une solution" ✅
6. User upload un fichier CSV ✅
7. Soumission enregistrée dans `submissions` avec status 'pending' ✅
8. Admin va sur /admin/submissions ✅
9. Admin voit la soumission en attente ✅
10. Admin entre un score (0 à 1) et évalue ✅
11. Fonction `evaluate_submission_manually` est appelée ✅
12. Fonction `upsert_leaderboard_score` met à jour le leaderboard ✅
13. Trigger `update_leaderboard_ranks` recalcule tous les rangs ✅
14. User retourne voir le classement ❌ ERREUR ICI !
```

**❌ PROBLÈME À L'ÉTAPE 14:**
```
Error: permission denied for table leaderboard
```

**🔍 CAUSE RACINE:**
- Le hook `useLeaderboard` fait un `SELECT` direct sur `leaderboard`
- La policy existe mais n'est peut-être pas appliquée correctement
- Possible conflit avec d'autres policies (policy admin peut bloquer)

---

### 4️⃣ FRONTEND - COMPOSANTS

#### Hook `useLeaderboard.ts`
**Fichier:** `src/hooks/useLeaderboard.ts`

**Code actuel:**
```typescript
const { data: leaderboardData, error: leaderboardError } = await supabase
  .from('leaderboard')
  .select(`
    *,
    profiles:user_id (
      display_name,
      avatar_url,
      bio,
      role
    )
  `)
  .eq('competition_id', competitionId)
  .order('rank', { ascending: true })
  .limit(100)
```

**✅ Code correct** mais les permissions RLS bloquent l'accès.

---

#### Composant `Leaderboard`
**Fichier:** `src/components/competitions/leaderboard.tsx`

**Status:** ✅ **OK** - Affiche bien les données si permissions OK.

---

#### Page Détail Compétition
**Fichier:** `src/app/competitions/[slug]/page.tsx`

**Onglet "Classement":**
```tsx
{activeTab === 'leaderboard' && (
  <div className="mt-8">
    <Leaderboard competitionId={competition.id} />
  </div>
)}
```

**✅ Intégration correcte** du composant.

---

### 5️⃣ ADMIN - ÉVALUATION

#### Page Admin Submissions
**Fichier:** `src/app/admin/submissions/page.tsx`

**Flux d'évaluation:**
```typescript
const handleEvaluate = async (status: 'evaluated' | 'rejected') => {
  const { data, error } = await supabase.rpc('evaluate_submission_manually', {
    p_submission_id: selectedSubmission.id,
    p_score: scoreValue,
    p_evaluator_id: user.id,
    p_feedback: feedback || null
  })
  
  if (error) throw error
  
  alert(`✅ Soumission évaluée avec succès !
    Score: ${scoreValue}
    Rang: #${data[0]?.leaderboard_rank || '?'}`)
}
```

**✅ Code correct** - La fonction RPC est bien appelée.

---

### 6️⃣ FONCTIONS SQL - LOGIQUE MÉTIER

#### Fonction `upsert_leaderboard_score`
**Fichier:** `leaderboard_system.sql` (lignes 155-230)

**Logique:**
1. Vérifie si l'utilisateur a déjà un score
2. Si oui, met à jour **uniquement si le nouveau score est meilleur**
3. Si non, insère un nouveau record
4. Retourne: rank, is_improvement, old_score, new_score

**✅ Logique correcte** - Fonction bien implémentée.

---

#### Fonction `evaluate_submission_manually`
**Fichier:** `submissions_manual_evaluation.sql` (lignes 80-139)

**Logique:**
1. Récupère `competition_id` et `user_id` de la soumission
2. Met à jour la soumission avec le score
3. Appelle `upsert_leaderboard_score`
4. Retourne le rang du leaderboard

**✅ Logique correcte** - Fonction bien implémentée.

---

#### Trigger `update_leaderboard_ranks`
**Fichier:** `leaderboard_system.sql` (lignes 83-118)

**Logique:**
```sql
WITH ranked AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY competition_id 
      ORDER BY score DESC, updated_at ASC
    ) AS new_rank
  FROM leaderboard
  WHERE competition_id = NEW.competition_id
)
UPDATE leaderboard l
SET 
  rank = r.new_rank,
  updated_at = NOW()
FROM ranked r
WHERE l.id = r.id;
```

**✅ Logique correcte** - Les rangs sont bien recalculés.

---

## 🎯 PLAN D'ACTION - CORRECTIONS

### ✅ ACTION 1: Exécuter le script de réparation RLS
**Fichier:** `supabase/migrations/fix_leaderboard_rls.sql`

**Ce script va:**
1. Désactiver RLS
2. Supprimer toutes les policies
3. Réactiver RLS
4. Créer des policies ultra-permissives
5. Ajouter les GRANT nécessaires

**Commande:** Exécuter dans l'éditeur SQL Supabase

---

### 🔧 ACTION 2: Fusionner les schémas SQL incohérents
**Problème:** 2 définitions différentes de `leaderboard` et `submissions`

**Solution:** Créer un script `CONSOLIDATED_COMPETITIONS_SCHEMA.sql` qui:
1. Supprime les anciennes tables
2. Recrée les tables avec une structure unifiée
3. Migre les données existantes (si nécessaire)

---

### 📝 ACTION 3: Mettre à jour la documentation
**Créer:**
1. `docs/COMPETITIONS_ARCHITECTURE.md` - Architecture complète
2. `docs/COMPETITIONS_USER_FLOW.md` - Flux utilisateur
3. `docs/COMPETITIONS_ADMIN_GUIDE.md` - Guide admin

---

### 🧪 ACTION 4: Tests de bout en bout
**Scénario de test:**
1. Créer une compétition
2. Soumettre une solution
3. Évaluer en tant qu'admin
4. Vérifier le classement en tant qu'utilisateur normal
5. Vérifier le classement en tant qu'utilisateur non connecté

---

## 📋 RECOMMANDATIONS FINALES

### 🚨 Urgent (à faire maintenant)
1. ✅ Exécuter `fix_leaderboard_rls.sql`
2. 🔄 Créer `CONSOLIDATED_COMPETITIONS_SCHEMA.sql`
3. 🧪 Tester le flux complet

### 🔜 Court terme (cette semaine)
1. Ajouter la gestion de datasets (upload/download)
2. Implémenter l'évaluation automatique (CSV parser)
3. Ajouter des notifications après évaluation

### 📈 Moyen terme (ce mois)
1. Système de teams/collaborateurs
2. Forum de discussion par compétition
3. API publique pour soumissions automatiques

---

## 🎉 CONCLUSION

Le système de compétitions est **bien conçu** mais souffre de:
1. ❌ Incohérences entre les scripts SQL
2. ❌ RLS policies mal configurées
3. ❌ Documentation manquante

**Après les corrections**, le système sera:
1. ✅ Fonctionnel de bout en bout
2. ✅ Scalable et performant
3. ✅ Facile à maintenir et étendre

---

**Prochaine étape:** Exécuter `fix_leaderboard_rls.sql` et tester ! 🚀

