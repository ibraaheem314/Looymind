# 📦 ARCHIVE - FONCTIONNALITÉS DORMANTES

## 🎯 Pourquoi cette archive ?

**Date d'archivage** : 10 janvier 2025

**Décision stratégique** : Palanteer se recentre sur **RESSOURCES ÉDUCATIVES + COMMUNAUTÉ** pour aider les jeunes talents sénégalais à accéder aux connaissances en IA.

Les fonctionnalités **Compétitions** et **Projets** sont **archivées** (non supprimées) pour une implémentation future.

---

## 📁 Contenu de l'archive

### `/competitions/` - Système de compétitions IA
**État** : 70% développé, backend complet
**Raison** : Trop complexe pour le MVP, nécessite infrastructure d'évaluation
**Futur** : Phase 3 (2026+)

**Contenu archivé** :
- Pages frontend (`/app/competitions/*`)
- Pages admin (`/app/admin/competitions/*`, `/app/admin/submissions/*`)
- Migrations SQL (`competitions_system.sql`, `datasets_system.sql`)
- Composants (`leaderboard.tsx`, `submission-modal.tsx`)
- Hooks (`useLeaderboard.ts`)

---

### `/projects/` - Système de projets collaboratifs
**État** : 60% développé, schema DB complet mais frontend basique
**Raison** : Nécessite réseau social complet (messaging, suivi, notifications)
**Futur** : Phase 2 (Q2 2026)

**Contenu archivé** :
- Pages frontend (`/app/projects/*`)
- Migrations SQL (`projects_complete_schema.sql`)
- Composants (`project-card.tsx`, `project-filters.tsx`, etc.)
- Hooks (`useProjects.ts`)

---

### `/docs/` - Documentation technique archivée
**Contenu** :
- Guides de développement compétitions
- Spécifications techniques projets
- Diagrammes d'architecture

---

## 🚀 Pour réactiver une fonctionnalité

### Étape 1 : Restaurer le code
```bash
# Exemple pour les compétitions
cp -r _archive/competitions/app/competitions src/app/
cp -r _archive/competitions/components src/components/
```

### Étape 2 : Restaurer les migrations SQL
```bash
# Exécuter dans Supabase SQL Editor
supabase/migrations/competitions_system.sql
```

### Étape 3 : Mettre à jour la navigation
- Ajouter les liens dans `src/components/layout/header.tsx`
- Ajouter les liens dans `src/components/layout/footer.tsx`
- Mettre à jour `src/app/page.tsx` (homepage)

---

## 📊 Estimations de réactivation

| Fonctionnalité | Temps de réactivation | Dépendances |
|----------------|----------------------|-------------|
| **Compétitions** | 2-3 semaines | Système d'évaluation auto, storage datasets |
| **Projets** | 1-2 semaines | Notifications, système de suivi |

---

## ⚠️ Notes importantes

1. **Code archivé = Code fonctionnel** : Tout ce qui est ici fonctionne et a été testé
2. **Ne pas supprimer cette archive** : C'est du travail de plusieurs semaines
3. **Migrations DB** : Les tables peuvent rester en DB (pas de conflit avec le MVP)
4. **Documentation préservée** : Toute la documentation technique est ici

---

## 🎯 Focus actuel du MVP (v1.0)

**Plateforme éducative IA pour le Sénégal**

### Fonctionnalités actives :
- ✅ **Articles** - Blog communautaire avec markdown
- ✅ **Ressources** - Curation de contenus IA (Coursera, YouTube, etc.)
- ✅ **Profils** - Annuaire des talents sénégalais en IA
- ✅ **Talents** - Leaderboard basé sur contributions
- ✅ **Authentification** - Inscription en 3 étapes
- ✅ **Commentaires** - Discussions sur articles
- ✅ **Modération** - Dashboard admin complet

### Supprimé du scope MVP :
- ⏸️ Compétitions IA (Zindi-like)
- ⏸️ Projets collaboratifs (GitHub-like)
- ⏸️ Messagerie privée
- ⏸️ Système de suivi (follow/unfollow)
- ⏸️ Notifications en temps réel

---

**Prochaine révision** : Q2 2026 (après validation du MVP)


