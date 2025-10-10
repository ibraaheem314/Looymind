# 🎨 Refonte UX — Page Ressources

**Date**: 10 octobre 2025  
**Objectif**: Intégrer les recommandations personnalisées et les parcours guidés directement dans `/resources` pour une meilleure expérience utilisateur.

---

## 🎯 Problème identifié

- La page `/plan` était isolée et peu découvrable
- Les utilisateurs ne voyaient pas immédiatement les bénéfices de la personnalisation
- Navigation fragmentée (Ressources / Mon plan / Parcours séparés)

---

## ✨ Solution implémentée

**Architecture hiérarchique inspirée de Coursera, edX, DataCamp :**

### 1. **Hero + Search** (inchangé)
- Titre accrocheur avec stats
- Barre de recherche centrale
- Design moderne avec gradients subtils

### 2. **🌟 Section "Recommandé pour toi"** (NOUVEAU)
**Si utilisateur connecté ET onboarding complété :**
- Affichage de 6 ressources personnalisées
- Cartes avec badge cyan "Pour toi"
- Tooltip "Pourquoi ?" sur chaque carte
- Bouton "Ajuster mes préférences" pour modifier le profil

**Sinon (mode invité ou pas d'onboarding) :**
- CTA élégant avec bénéfices clairs
- Boutons "Se connecter" ou "Commencer (2 min)"
- Design cohérent avec gradient cyan/bleu

**Fonctionnalités:**
- ✅ Fetch `/api/recommendations` automatique
- ✅ Loading state avec spinner
- ✅ Empty state si 0 recommandations
- ✅ Badges niveau/durée/langue/domaines
- ✅ Explainability sur chaque reco

### 3. **📚 Section "Parcours guidés"** (NOUVEAU - mis en avant)
- 3 tracks présentés en cartes (Débutant, Intermédiaire, Avancé)
- Icônes visuelles (🌱, 🚀, 🤖)
- Liste des modules inclus avec checkmarks
- Bouton "Voir tous les parcours" vers `/resources/paths`
- Design cohérent avec couleurs par niveau (vert, bleu, violet)

**Tracks présentés:**
1. 🌱 **Débuter en IA/ML** (Beginner)
   - Python & NumPy
   - Algorithmes de base
   - Projet pratique

2. 🚀 **Data Scientist Junior** (Intermediate)
   - Pandas & Scikit-learn
   - Modèles supervisés
   - Projets portfolio

3. 🤖 **NLP & LLMs** (Advanced)
   - Transformers & BERT
   - GPT & Fine-tuning
   - Applications réelles

### 4. **📖 Bibliothèque complète** (amélioré)
- Titre clair "Bibliothèque complète"
- Filtres sidebar (catégorie, difficulté, type)
- Tri (récent, populaire, vues)
- Filtres actifs affichés
- Grid responsive (1/2/3 colonnes)
- Empty states élégants
- CTA admin "Ajouter une ressource" (si autorisé)

---

## 🎨 Design System

### Couleurs par section
- **Recommandations** : Cyan/Bleu (#06b6d4, #3b82f6)
- **Parcours** : Vert/Emerald (#10b981, #059669)
- **Bibliothèque** : Slate/Gris (#475569, #1e293b)

### Composants visuels
- **Icons en gradients** : w-10 h-10, rounded-xl, gradient from-to
- **Badges distincts** : Couleurs thématiques pour chaque section
- **Cards hover** : border-2, transition-all, hover:shadow-xl
- **CTAs proéminents** : Boutons clairs avec icônes

### Hiérarchie visuelle
1. Hero (grand, accrocheur)
2. Recommandations (si applicable, cyan proéminent)
3. Parcours (vert, 3 cartes égales)
4. Bibliothèque (grid, dense)

---

## 📊 Flux utilisateur

### Scénario A : Utilisateur invité
1. Arrive sur `/resources`
2. Voit le hero + search
3. Voit le CTA "Obtiens des recommandations personnalisées"
4. Peut se connecter ou explorer directement
5. Voit les parcours guidés
6. Peut filtrer la bibliothèque

### Scénario B : Utilisateur connecté sans onboarding
1. Arrive sur `/resources`
2. Voit le CTA "Réponds à 4 questions rapides"
3. Clique → va sur `/onboarding`
4. Complète → retour sur `/resources` avec recommandations

### Scénario C : Utilisateur avec onboarding complété
1. Arrive sur `/resources`
2. Voit immédiatement 6 recommandations personnalisées
3. Peut cliquer "Commencer" sur une reco
4. Peut ajuster ses préférences
5. Explore les parcours guidés
6. Filtre la bibliothèque selon ses besoins

---

## 🔧 Changements techniques

### Fichiers modifiés
- ✅ `src/app/resources/page.tsx` : Nouvelle architecture complète
- ✅ `src/components/layout/header.tsx` : Retiré "Mon plan"
- ✅ `src/components/layout/footer.tsx` : Retiré "Mon plan d'apprentissage"

### Fichiers archivés
- ✅ `_archive/plan-standalone/page.tsx` : Ancienne page `/plan`
- ✅ `src/app/resources/page-old.tsx.bak` : Backup ancienne page resources

### APIs utilisées
- `GET /api/recommendations?user_id={id}&limit=6` : Fetch des recos
- Hook `useAuth()` : Détection user/profile
- Hook `useResources()` : Liste des ressources avec filtres

### Dépendances
- Aucune nouvelle dépendance
- Composants existants réutilisés (Button, Card, Badge, etc.)

---

## ✅ Critères d'acceptation

- [x] Section "Recommandé pour toi" affichée si user connecté + onboarding
- [x] CTA élégant si user invité ou pas d'onboarding
- [x] Section "Parcours guidés" avec 3 tracks
- [x] Bibliothèque complète avec filtres fonctionnels
- [x] 0 erreurs lints/TypeScript
- [x] Responsive (mobile/tablet/desktop)
- [x] Performance OK (pas de lag)
- [x] Navigation cohérente (header/footer à jour)

---

## 🎯 Bénéfices UX

### ✅ Découvrabilité
- Les recommandations sont **immédiatement visibles**
- Les parcours guidés sont **mis en avant**
- L'onboarding est **contextualisé** (CTA clair)

### ✅ Cohérence
- Tout est centralisé sur `/resources`
- Navigation simplifiée (1 page au lieu de 3)
- Design system unifié

### ✅ Guidance
- Les utilisateurs voient clairement les options :
  1. Recommandations personnalisées (si onboarding)
  2. Parcours guidés (pour tous)
  3. Bibliothèque libre (exploration)

### ✅ Engagement
- CTA clairs et attractifs
- Explainability sur les recos ("Pourquoi ?")
- Progression visible (tracks avec modules)

---

## 📈 KPIs à surveiller (après déploiement)

- **Taux de complétion de l'onboarding** (depuis le CTA sur `/resources`)
- **% d'utilisateurs qui cliquent sur une reco** (vs bibliothèque)
- **% d'utilisateurs qui explorent les parcours**
- **Temps moyen sur la page `/resources`**
- **Taux de rebond** (devrait diminuer)

---

## 🚀 Prochaines améliorations possibles

1. **Progress tracking pour les parcours**
   - Afficher % de complétion
   - Badge "En cours" sur les tracks commencés

2. **Filtres avancés pour les recos**
   - Toggle "Durée courte/longue"
   - Toggle "Vidéo uniquement" / "Texte uniquement"

3. **Collections personnalisées**
   - "Mes favoris"
   - "À voir plus tard"
   - "Complétées"

4. **Gamification**
   - Badges "5 ressources complétées"
   - Streak "7 jours consécutifs"

5. **Social proof**
   - "125 personnes ont aimé cette ressource"
   - "Populaire au Sénégal cette semaine"

---

## 📚 Inspirations

**Plateformes analysées :**
- **Coursera** : Recommandations en haut, parcours mis en avant
- **edX** : Sections claires, CTAs personnalisés
- **DataCamp** : Parcours guidés avec progression
- **Khan Academy** : Hiérarchie visuelle excellente
- **Udemy** : Filtres puissants, découvrabilité

**Adaptations pour Palanteer :**
- Focus sur l'éducation IA/ML (niche claire)
- Langue française prioritaire (Sénégal)
- Gratuit 100% (pas de paywall)
- Communauté locale (stats régionales futures)

---

## ✅ Validation

**Design :** ✅ Moderne, cohérent, responsive  
**UX :** ✅ Intuitif, guidé, découvrable  
**Performance :** ✅ Rapide, pas de lag  
**Accessibilité :** ✅ Contrastes OK, navigation clavier  
**Code quality :** ✅ 0 erreurs lints, TypeScript strict  

---

**🎉 La refonte UX de `/resources` est complète et prête à tester !**

**Test recommandé :**
1. Déconnecté → voir le CTA "Obtiens des recommandations"
2. Se connecter → voir le CTA "Réponds à 4 questions"
3. Compléter onboarding → voir les 6 recos personnalisées
4. Explorer les parcours guidés
5. Filtrer la bibliothèque complète

**Prochaine étape :** Phase 2 du `PLAN.md` (enrichissement, embeddings, cron) 🚀

