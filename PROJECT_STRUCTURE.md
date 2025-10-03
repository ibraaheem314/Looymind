# 📁 Structure du Projet LooyMind

## 🎯 Vue d'ensemble
LooyMind est une plateforme communautaire pour l'écosystème IA du Sénégal, combinant compétitions de data science, ressources éducatives, articles et projets collaboratifs.

---

## 📂 Structure des Dossiers

### `/src/app` - Routes Next.js

#### **Pages Principales**
- `/` - Page d'accueil
- `/about` - À propos
- `/contact` - Contact
- `/help` - Aide
- `/privacy` - Politique de confidentialité
- `/unauthorized` - Page non autorisé

#### **Authentification** (`/auth`)
- `/auth/login` - Connexion
- `/auth/register` - Inscription (3 étapes)
- `/auth/callback` - Callback OAuth

#### **Articles** (`/articles`)
- `/articles` - Liste des articles
- `/articles/create` - Créer/Modifier un article
- `/articles/[slug]` - Détail d'un article

#### **Projets** (`/projects`)
- `/projects` - Liste des projets
- `/projects/create` - Créer/Modifier un projet
- `/projects/[slug]` - Détail d'un projet

#### **Compétitions** (`/competitions`)
- `/competitions` - Liste des compétitions
- `/competitions/create` - Créer une compétition
- `/competitions/[slug]` - Détail d'une compétition

#### **Ressources** (`/resources`)
- `/resources` - Liste des ressources (externe + locale)
- `/resources/create` - Ajouter une ressource
- `/resources/[slug]` - Détail d'une ressource

#### **Communauté**
- `/talents` - Annuaire des talents / Leaderboard
- `/dashboard` - Tableau de bord utilisateur
- `/profile` - Profil utilisateur
- `/check-email` - Vérification email

#### **Administration**
- `/admin/moderation` - Espace de modération

---

### `/src/components` - Composants React

#### **Articles**
- `article-card.tsx` - Carte d'article
- `comments-section.tsx` - Section commentaires

#### **Projets**
- `project-card.tsx` - Carte de projet
- `project-comments.tsx` - Commentaires de projet
- `project-filters.tsx` - Filtres de projets
- `project-stats.tsx` - Statistiques de projet

#### **Ressources**
- `resource-card.tsx` - Carte de ressource
- `resource-filters.tsx` - Filtres de ressources

#### **Compétitions**
- `submission-modal.tsx` - Modal de soumission

#### **Layout**
- `header.tsx` - En-tête de navigation
- `footer.tsx` - Pied de page

#### **Home**
- `hero-section.tsx` - Section hero (Kaggle+Zindi style)
- `features-section.tsx` - Section caractéristiques

#### **Auth**
- `auth-guard.tsx` - Protection des routes

#### **Modération**
- `moderation-dashboard.tsx` - Dashboard de modération
- `report-form.tsx` - Formulaire de signalement

#### **Profile**
- `user-stats.tsx` - Statistiques utilisateur

#### **UI** (Composants réutilisables)
- `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`
- `dialog.tsx`, `input.tsx`, `label.tsx`, `select.tsx`
- `tabs.tsx`, `textarea.tsx`

---

### `/src/hooks` - Hooks React Personnalisés

- `useAuth.ts` - Gestion de l'authentification
- `useArticles.ts` - Gestion des articles
- `useProjects.ts` - Gestion des projets
- `useResources.ts` - Gestion des ressources
- `useComments.ts` - Gestion des commentaires

---

### `/src/lib` - Utilitaires

- `supabase.ts` - Client Supabase principal
- `supabase-client.ts` - Client Supabase côté client
- `supabase-server.ts` - Client Supabase côté serveur
- `utils.ts` - Fonctions utilitaires

---

### `/supabase/migrations` - Scripts SQL

#### **Schéma Principal**
- `CURRENT_WORKING_SCHEMA.sql` - **SCHÉMA COMPLET ET ACTIF**
  - Tables: `profiles`, `articles`, `likes`, `comments`
  - RLS policies pour toutes les tables
  - Triggers pour compteurs automatiques

#### **Systèmes Spécialisés**
- `article_interactions_complete.sql` - Interactions articles (likes, views, comments)
- `projects_complete_schema.sql` - Système de projets complet
- `competitions_system.sql` - Système de compétitions
- `resources_hybrid_schema.sql` - Système de ressources hybride
- `resources_phase1_curation.sql` - 60+ ressources curées
- `resources_article_integration.sql` - Intégration articles ↔ ressources

---

## 🔑 Fonctionnalités Clés

### ✅ **Authentification & Profils**
- Inscription en 3 étapes (Info perso → Profil pro → Compétences)
- Connexion avec email/mot de passe
- Profils riches (bio, compétences, liens sociaux)
- Rôles: `member`, `mentor`, `org`, `admin`

### ✅ **Articles**
- Création avec Markdown
- Catégories (IA, ML, Data Science, etc.)
- Tags personnalisés
- Likes, vues, commentaires
- Option "Marquer comme ressource éducative"
- Suppression (auteur + admin)

### ✅ **Projets**
- Types: Web, Mobile, IA, Data, Recherche
- Technologies & Tags
- Liens: GitHub, Live URL, Demo
- Galerie d'images
- Collaborateurs
- Likes, vues, commentaires
- Visibilité: Public/Privé
- Suppression (auteur + admin)

### ✅ **Compétitions**
- Système de leaderboard
- Soumissions de fichiers (CSV)
- Métriques de performance
- Dates de début/fin
- Règles et prix

### ✅ **Ressources**
- Curation externe (Coursera, Fast.ai, Kaggle, YouTube)
- Contenu local (🇸🇳)
- Articles de la plateforme intégrés
- Filtres: Catégorie, Difficulté, Type
- Ratings, Bookmarks, Progression
- Gratuit/Payant, Certificat

### ✅ **Commentaires**
- Système hiérarchique (réponses)
- Édition/Suppression
- Likes sur les commentaires
- Affichage du rôle (admin, mentor)

---

## 🗄️ Base de Données (Supabase)

### **Tables Principales**
1. `profiles` - Utilisateurs
2. `articles` - Articles de la communauté
3. `projects` - Projets collaboratifs
4. `competitions` - Compétitions
5. `resources` - Ressources éducatives
6. `likes` - Table générique pour tous les likes
7. `comments` - Commentaires hiérarchiques
8. `article_views` - Vues uniques par article
9. `project_views` - Vues uniques par projet
10. `submissions` - Soumissions aux compétitions
11. `leaderboard` - Classements

### **Sécurité (RLS)**
- Toutes les tables ont des policies RLS
- Permissions basées sur `auth.uid()`
- Anonymous users: lecture publique uniquement
- Authenticated users: CRUD sur leur contenu
- Admins: gestion complète

### **Triggers Automatiques**
- `likes_count` - Mis à jour automatiquement
- `views_count` - Incrémenté sur vue unique
- `comments_count` - Mis à jour automatiquement
- `slug` - Généré automatiquement pour SEO

---

## 🎨 Design System

### **Couleurs**
- **Primary**: Cyan (#14b8a6) - Header, boutons principaux
- **Articles**: Blue (#3b82f6)
- **Projets**: Purple (#a855f7)
- **Ressources**: Green (#22c55e)
- **Compétitions**: Cyan (#06b6d4)
- **Talents**: Orange (#f97316)

### **Style**
- Inspiration: **Kaggle + Zindi**
- Layout: Alternance texte/image
- Typography: Sans-serif moderne
- Spacing: Compact mais aéré
- Emojis: Floating pour dynamisme
- Mockups: Interface previews réalistes

---

## 🚀 Commandes Principales

```bash
# Développement
npm run dev

# Build production
npm run build

# Start production
npm start

# Linter
npm run lint
```

---

## 📦 Dépendances Clés

- **Next.js 14** - Framework React
- **Supabase** - Backend & Auth
- **Tailwind CSS** - Styling
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes
- **React Markdown** - Rendu Markdown
- **date-fns** - Gestion des dates

---

## 🔄 Workflow de Développement

1. **Créer une branche** pour chaque feature
2. **Tester localement** sur localhost:3000
3. **Vérifier les RLS** dans Supabase
4. **Commit** avec messages clairs
5. **Push** et créer une PR

---

## 📝 Notes Importantes

### ⚠️ **Routes**
- `/auth/login` et `/auth/register` sont les routes officielles
- Les anciennes routes `/login` et `/register` ont été supprimées

### ⚠️ **Composants**
- Les composants `comments/` et `challenges/` ont été supprimés (obsolètes)
- Utiliser `articles/comments-section.tsx` pour les commentaires

### ⚠️ **SQL**
- Le fichier `CURRENT_WORKING_SCHEMA.sql` est le **schéma de référence**
- Les autres fichiers sont des **migrations additionnelles**
- Exécuter dans l'ordre: CURRENT → article_interactions → projects → competitions → resources_hybrid → resources_phase1 → resources_article_integration

---

## 🎯 Roadmap

### ✅ **Fait**
- Système d'authentification complet
- Articles avec commentaires
- Projets collaboratifs
- Compétitions de data science
- Ressources éducatives hybrides
- Intégration articles ↔ ressources

### 🔜 **À Venir**
- Système de messagerie privée
- Notifications en temps réel
- Gamification (badges, niveaux)
- Recherche full-text
- Système de mentorat
- API publique

---

**Dernière mise à jour:** Octobre 2025  
**Version:** 1.0.0  
**Auteur:** Équipe LooyMind

