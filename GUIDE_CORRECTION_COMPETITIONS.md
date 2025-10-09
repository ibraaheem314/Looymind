# 🚀 GUIDE DE CORRECTION - SYSTÈME DE COMPÉTITIONS

**Date:** 9 octobre 2025  
**Objectif:** Corriger tous les problèmes du système de compétitions en 3 étapes simples

---

## 📋 PRÉPARATION

### Documents à lire
1. ✅ `AUDIT_SYSTEME_COMPETITIONS.md` - Diagnostic complet
2. ✅ `fix_leaderboard_rls.sql` - Script de réparation RLS
3. ✅ `CONSOLIDATED_COMPETITIONS_SCHEMA.sql` - Script de consolidation

### Outils nécessaires
- Accès à Supabase Dashboard (SQL Editor)
- Accès au code frontend (pour tests)

---

## 🎯 ÉTAPE 1: RÉPARER LES PERMISSIONS RLS

### 1.1 Ouvrir Supabase Dashboard
1. Aller sur [votre projet Supabase](https://supabase.com/dashboard)
2. Cliquer sur "SQL Editor" dans le menu de gauche

### 1.2 Exécuter le script `fix_leaderboard_rls.sql`
1. Créer une nouvelle query
2. Copier-coller **tout le contenu** de `supabase/migrations/fix_leaderboard_rls.sql`
3. Cliquer sur "Run" (ou F5)

### 1.3 Vérifier le résultat
Vous devriez voir des messages comme:
```
✅ RLS Policies réparées avec succès !
📊 Policies actives sur leaderboard:
```

Et un tableau listant les policies actives.

### 1.4 Tester immédiatement
1. Ouvrir votre application: `http://localhost:3000/competitions/detection-fraude-mobile-money/leaderboard`
2. **Si l'erreur "permission denied" a disparu**, passez à l'étape 2
3. **Si l'erreur persiste**, vérifiez:
   - Que toutes les lignes SQL ont été exécutées
   - Qu'il n'y a pas d'erreur dans la console SQL
   - Que vous avez bien rafraîchi la page (Ctrl+F5)

---

## 🎯 ÉTAPE 2: CONSOLIDER LE SCHÉMA SQL (OPTIONNEL)

⚠️ **Cette étape est OPTIONNELLE** et recommandée seulement si:
- Vous voulez repartir sur une base propre
- Vous rencontrez encore des problèmes après l'étape 1
- Vous voulez unifier les définitions de `submissions`

### 2.1 Sauvegarder vos données existantes (si importantes)
```sql
-- Sauvegarder les soumissions existantes
CREATE TABLE submissions_backup AS SELECT * FROM submissions;

-- Sauvegarder le leaderboard existant
CREATE TABLE leaderboard_backup AS SELECT * FROM leaderboard;
```

### 2.2 Exécuter le script consolidé
1. Dans SQL Editor Supabase
2. Copier-coller **tout le contenu** de `supabase/migrations/CONSOLIDATED_COMPETITIONS_SCHEMA.sql`
3. Cliquer sur "Run"

### 2.3 Vérifier le résultat
Vous devriez voir:
```
✅ Schéma consolidé des compétitions créé avec succès !
📊 Tables: competitions, submissions (consolidée), leaderboard
```

### 2.4 Restaurer les données (si sauvegardées)
```sql
-- Restaurer les soumissions
INSERT INTO submissions 
SELECT * FROM submissions_backup
ON CONFLICT (id) DO NOTHING;

-- Restaurer le leaderboard (si besoin)
INSERT INTO leaderboard 
SELECT * FROM leaderboard_backup
ON CONFLICT (competition_id, user_id) DO UPDATE
SET 
  score = EXCLUDED.score,
  rank = EXCLUDED.rank,
  updated_at = NOW();
```

---

## 🎯 ÉTAPE 3: TESTER LE FLUX COMPLET

### 3.1 Test en tant qu'utilisateur normal

#### 3.1.1 Créer un compte (si pas déjà fait)
1. Aller sur `http://localhost:3000/auth/register`
2. Créer un compte de test
3. Se connecter

#### 3.1.2 Voir les compétitions
1. Aller sur `http://localhost:3000/competitions`
2. Vérifier que les compétitions s'affichent

#### 3.1.3 Voir les détails d'une compétition
1. Cliquer sur une compétition (ex: "Détection de Fraude Mobile Money")
2. Vérifier les 4 onglets:
   - ✅ Vue d'ensemble
   - ✅ Règles
   - ✅ Données
   - ✅ **Classement** (devrait maintenant s'afficher sans erreur !)

#### 3.1.4 Soumettre une solution
1. Cliquer sur "Soumettre une solution"
2. Uploader un fichier CSV (n'importe quel CSV pour le test)
3. Vérifier que la soumission est enregistrée
4. Vérifier le message de succès

---

### 3.2 Test en tant qu'admin

#### 3.2.1 Se connecter en tant qu'admin
1. Se déconnecter de l'utilisateur normal
2. Se connecter avec votre compte admin

#### 3.2.2 Aller sur la page d'évaluation
1. Aller sur `http://localhost:3000/admin/submissions`
2. Vérifier que les soumissions en attente s'affichent

#### 3.2.3 Évaluer une soumission
1. Cliquer sur "Évaluer" sur une soumission
2. Entrer un score (ex: 0.85)
3. Ajouter un feedback optionnel (ex: "Bon travail !")
4. Cliquer sur "Évaluer et valider"
5. Vérifier le message de succès avec le rang

#### 3.2.4 Vérifier le leaderboard
1. Retourner sur la page de la compétition
2. Aller dans l'onglet "Classement"
3. **Vérifier que l'utilisateur apparaît dans le leaderboard avec son score et son rang !**

---

### 3.3 Test en tant qu'utilisateur non connecté

#### 3.3.1 Se déconnecter
1. Cliquer sur votre profil en haut à droite
2. Cliquer sur "Se déconnecter"

#### 3.3.2 Voir les compétitions
1. Aller sur `http://localhost:3000/competitions`
2. Cliquer sur une compétition

#### 3.3.3 Voir le classement
1. Aller dans l'onglet "Classement"
2. **Vérifier que le classement s'affiche même sans être connecté !**
3. Vérifier que les noms, scores et rangs sont visibles

---

## ✅ VÉRIFICATION FINALE

### Checklist de validation

#### Fonctionnalités de base
- [ ] Les compétitions s'affichent correctement
- [ ] Les détails d'une compétition sont complets
- [ ] Les 4 onglets (Vue d'ensemble, Règles, Données, Classement) fonctionnent

#### Soumissions
- [ ] Un utilisateur connecté peut soumettre une solution
- [ ] La soumission apparaît dans `/admin/submissions`
- [ ] Un admin peut évaluer la soumission
- [ ] Le score est enregistré correctement

#### Leaderboard
- [ ] Le classement s'affiche **sans erreur "permission denied"**
- [ ] Le classement est visible **même pour les utilisateurs non connectés**
- [ ] Les rangs sont calculés correctement (ordre décroissant de score)
- [ ] Les informations utilisateur s'affichent (nom, avatar)

#### Edge cases
- [ ] Si un utilisateur soumet plusieurs fois, seul le meilleur score compte
- [ ] Les rangs se mettent à jour automatiquement après chaque évaluation
- [ ] Les statistiques (nombre de participants, soumissions) sont correctes

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### Problème 1: Erreur "permission denied" persiste

**Cause possible:** Les policies RLS n'ont pas été appliquées correctement

**Solution:**
1. Vérifier que le script `fix_leaderboard_rls.sql` a été **entièrement** exécuté
2. Vérifier dans Supabase Dashboard > Authentication > Policies que les policies existent:
   - `allow_public_read_leaderboard` sur `leaderboard`
3. Essayer de désactiver complètement RLS (temporairement):
   ```sql
   ALTER TABLE leaderboard DISABLE ROW LEVEL SECURITY;
   ```
4. Si ça fonctionne, le problème est bien les policies. Les recréer manuellement.

---

### Problème 2: Le leaderboard est vide

**Cause possible:** Aucune soumission n'a été évaluée

**Solution:**
1. Vérifier qu'il y a des soumissions: `SELECT * FROM submissions;`
2. Vérifier qu'elles ont été évaluées: `SELECT * FROM submissions WHERE evaluation_status = 'evaluated';`
3. Vérifier que le leaderboard a été mis à jour: `SELECT * FROM leaderboard;`
4. Si le leaderboard est vide, appeler manuellement la fonction:
   ```sql
   SELECT * FROM evaluate_submission_manually(
     '<submission_id>',
     0.85,
     '<admin_user_id>',
     'Test'
   );
   ```

---

### Problème 3: Les rangs ne sont pas corrects

**Cause possible:** Le trigger de calcul des rangs ne fonctionne pas

**Solution:**
1. Recalculer manuellement les rangs:
   ```sql
   WITH ranked AS (
     SELECT 
       id,
       ROW_NUMBER() OVER (
         PARTITION BY competition_id 
         ORDER BY score DESC, updated_at ASC
       ) AS new_rank
     FROM leaderboard
   )
   UPDATE leaderboard l
   SET rank = r.new_rank
   FROM ranked r
   WHERE l.id = r.id;
   ```

2. Vérifier que le trigger existe:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_update_leaderboard_ranks';
   ```

---

### Problème 4: Erreur "function upsert_leaderboard_score does not exist"

**Cause possible:** Le script `leaderboard_system.sql` n'a pas été exécuté

**Solution:**
1. Exécuter entièrement `supabase/migrations/leaderboard_system.sql`
2. Vérifier que la fonction existe:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'upsert_leaderboard_score';
   ```

---

## 📞 SUPPORT

Si après toutes ces étapes, le problème persiste:

1. **Vérifier les logs Supabase:**
   - Dashboard > Logs > Postgres Logs
   - Chercher les erreurs récentes

2. **Vérifier les logs frontend:**
   - Console du navigateur (F12)
   - Chercher les erreurs rouges

3. **Fournir les informations suivantes:**
   - Message d'erreur complet
   - Étape où l'erreur se produit
   - Résultat des requêtes SQL de vérification

---

## 🎉 FÉLICITATIONS !

Si tous les tests passent, **votre système de compétitions est maintenant pleinement fonctionnel !** 🚀

**Prochaines étapes suggérées:**
1. Ajouter la gestion de datasets (upload/download)
2. Implémenter l'évaluation automatique (CSV parser)
3. Ajouter des notifications après évaluation
4. Créer une page de statistiques avancées

---

**Bon courage et bonne correction !** 💪

