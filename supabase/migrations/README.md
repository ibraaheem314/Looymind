# 📋 Scripts SQL - Palanteer

## Scripts Actifs (à utiliser dans l'ordre)

### 1. **Structure de base**
- `competitions_system.sql` - Tables des compétitions
- `projects_complete_schema.sql` - Tables des projets
- `article_interactions_complete.sql` - Tables des articles et interactions
- `moderation_system.sql` - Système de modération

### 2. **Ressources**
- `resources_hybrid_schema.sql` - Schéma des ressources
- `resources_phase1_curation.sql` - Ressources curées
- `resources_article_integration.sql` - Intégration articles → ressources

### 3. **Compétitions & Évaluation**
- `FINAL_FIX_EVALUATION_v2.sql` - **IMPORTANT** : Système d'évaluation (SANS triggers récursifs)
- `create_storage_bucket.sql` - Bucket pour les soumissions CSV

### 4. **Schema actuel**
- `CURRENT_WORKING_SCHEMA.sql` - Vue d'ensemble du schéma complet

---

## ⚠️ Scripts Obsolètes (Supprimés)

Ces scripts ont été supprimés car remplacés par des versions plus récentes :

- ❌ `fix_recursive_triggers.sql` → Remplacé par `FINAL_FIX_EVALUATION_v2.sql`
- ❌ `fix_leaderboard_rls.sql` → Intégré dans `FINAL_FIX_EVALUATION_v2.sql`
- ❌ `fix_submissions_rls.sql` → Intégré dans `FINAL_FIX_EVALUATION_v2.sql`
- ❌ `submissions_manual_evaluation.sql` → Remplacé par `FINAL_FIX_EVALUATION_v2.sql`
- ❌ `leaderboard_system.sql` → Remplacé par `FINAL_FIX_EVALUATION_v2.sql`
- ❌ `CONSOLIDATED_COMPETITIONS_SCHEMA.sql` → Jamais utilisé
- ❌ `DIAGNOSTIC_SUBMISSIONS.sql` → Outil de debug temporaire
- ❌ `update_bucket_to_public.sql` → Action ponctuelle déjà exécutée

---

## 🚀 Installation d'une nouvelle base de données

Pour installer Palanteer sur une nouvelle base Supabase :

1. Exécutez les scripts dans l'ordre ci-dessus (section "Scripts Actifs")
2. **Important** : Exécutez `FINAL_FIX_EVALUATION_v2.sql` en dernier pour éviter les conflits de triggers

---

## 📝 Notes

- **FINAL_FIX_EVALUATION_v2.sql** supprime TOUS les triggers récursifs et implémente un système d'évaluation manuel simple
- Les RLS policies sont définies dans chaque script respectif
- Les fonctions PostgreSQL sont définies avec `SECURITY DEFINER` pour les permissions admin

---

**Dernière mise à jour** : 9 octobre 2025

