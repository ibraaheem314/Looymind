# 📚 Parcours d'apprentissage dynamiques

**Date**: 10 octobre 2025  
**Objectif**: Créer des pages dédiées pour chaque parcours avec contenu structuré et suivi de progression.

---

## 🎯 Problème résolu

**Avant :**
- Les 3 tracks (Débutant, Intermédiaire, Avancé) pointaient tous vers `/resources/paths`
- Aucune distinction entre les parcours
- Contenu générique, pas de détail par parcours

**Après :**
- **3 pages dédiées** avec routes dynamiques :
  - `/resources/paths/debutant-ia-ml`
  - `/resources/paths/data-scientist-junior`
  - `/resources/paths/nlp-llms`
- **Contenu spécifique** pour chaque parcours
- **Suivi de progression** avec localStorage

---

## 🏗️ Architecture

### Routes dynamiques
```
src/app/resources/paths/[slug]/page.tsx
```

**Slugs disponibles :**
- `debutant-ia-ml` → Débuter en IA/ML 🌱
- `data-scientist-junior` → Data Scientist Junior 🚀
- `nlp-llms` → NLP & LLMs 🤖

### Structure de données (TRACKS)

Chaque parcours contient :
```typescript
{
  id: string
  title: string
  emoji: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  duration: string
  objectives: string[]
  modules: Module[]
}
```

Chaque module contient :
```typescript
{
  id: number
  title: string
  duration: string
  lessons: Lesson[]
}
```

Chaque leçon contient :
```typescript
{
  title: string
  type: 'video' | 'article' | 'code' | 'quiz' | 'project'
  duration: number // en minutes
}
```

---

## 📖 Contenu des parcours

### 🌱 Débuter en IA/ML (Beginner)

**Durée :** 8-12 semaines  
**Modules :** 4

1. **Introduction à l'IA et au ML** (1 semaine)
   - Qu'est-ce que l'IA ?
   - ML vs DL vs IA : différences
   - Applications concrètes
   - Quiz de compréhension

2. **Python pour la Data Science** (3 semaines)
   - Bases de Python
   - NumPy : calcul numérique
   - Pandas : manipulation de données
   - Matplotlib & Seaborn : visualisation
   - Projet : Analyser un dataset

3. **Algorithmes de Machine Learning** (3 semaines)
   - Régression linéaire
   - Classification avec k-NN
   - Arbres de décision
   - Évaluation des modèles
   - Projet : Prédiction de prix

4. **Projet Final** (2 semaines)
   - Choix du projet
   - Collecte et nettoyage des données
   - Entraînement et optimisation
   - Présentation et déploiement

**Total :** 15 leçons

---

### 🚀 Data Scientist Junior (Intermediate)

**Durée :** 12-16 semaines  
**Modules :** 5

1. **Data Wrangling Avancé** (2 semaines)
   - Nettoyage de données réelles
   - Feature Engineering
   - Gestion des données manquantes
   - Projet : Pipeline ETL

2. **Modèles Supervisés** (4 semaines)
   - Régression avancée (Ridge, Lasso)
   - Classification (SVM, Random Forest)
   - Gradient Boosting (XGBoost, LightGBM)
   - Hyperparameter tuning
   - Projet : Prédiction de churn

3. **Modèles Non-Supervisés** (3 semaines)
   - Clustering (K-Means, DBSCAN)
   - Réduction de dimensionnalité (PCA, t-SNE)
   - Détection d'anomalies
   - Projet : Segmentation clients

4. **Visualisation & Communication** (2 semaines)
   - Plotly & dashboards interactifs
   - Storytelling avec les données
   - Présenter à des non-techniques
   - Projet : Dashboard analytique

5. **Projet Portfolio** (3 semaines)
   - Définir un problème métier
   - Analyse exploratoire complète
   - Modélisation et optimisation
   - Déploiement et présentation

**Total :** 20 leçons

---

### 🤖 NLP & LLMs (Advanced)

**Durée :** 10-14 semaines  
**Modules :** 5

1. **Fondamentaux du NLP** (2 semaines)
   - Tokenization & preprocessing
   - Word embeddings (Word2Vec, GloVe)
   - RNN et LSTM
   - Projet : Classification de textes

2. **Transformers & Attention** (3 semaines)
   - Architecture Transformer
   - Self-attention mechanism
   - BERT : comprendre et utiliser
   - GPT : génération de texte
   - Projet : Chatbot simple

3. **Fine-tuning de LLMs** (3 semaines)
   - Transfer learning pour NLP
   - Fine-tuner BERT sur une tâche
   - LoRA et PEFT
   - Évaluation de modèles NLP
   - Projet : Analyse de sentiment

4. **LLMs en Production** (2 semaines)
   - Optimisation et quantization
   - API avec FastAPI
   - Déploiement cloud (Hugging Face, AWS)
   - Monitoring et A/B testing

5. **Projet Avancé** (3 semaines)
   - Concevoir une application LLM
   - RAG (Retrieval-Augmented Generation)
   - Fine-tuning et optimisation
   - Déploiement et présentation

**Total :** 19 leçons

---

## ✨ Fonctionnalités

### 1. **Suivi de progression**
- Chaque leçon peut être cochée comme "complétée"
- Progression sauvegardée dans `localStorage`
- Barre de progression visuelle (%)
- Compteur "X / Y leçons complétées"

### 2. **Types de leçons**
Chaque leçon a un type avec icône et couleur :
- 🎥 **Video** (rouge) : Cours vidéo
- 📄 **Article** (bleu) : Article ou tutoriel
- 💻 **Code** (vert) : Exercice pratique
- 🎯 **Quiz** (violet) : Test de connaissances
- ✨ **Project** (orange) : Projet pratique

### 3. **Design adaptatif par niveau**
- **Beginner** : Vert (#10b981)
- **Intermediate** : Bleu (#3b82f6)
- **Advanced** : Violet (#a855f7)

Couleurs appliquées sur :
- Badges de niveau
- Progress bar
- Header background
- Icons des modules

### 4. **Navigation fluide**
- Bouton "Retour" en haut
- Lien vers ressources en bas
- Bouton "Réinitialiser la progression" si commencé

### 5. **Responsive**
- Adapté mobile/tablet/desktop
- Cards empilées sur mobile
- Grid fluide sur desktop

---

## 🎨 Design System

### Header du parcours
- Background coloré selon le niveau
- Emoji géant (5xl)
- Badge de niveau
- Titre + description
- Stats (durée, modules, leçons)
- Progress bar
- Card "Objectifs du parcours"

### Modules
- Numérotation visuelle (1, 2, 3...)
- Badge coloré avec le numéro du module
- Titre + durée + nombre de leçons
- Liste des leçons avec checkboxes

### Leçons
- Checkbox (cercle vide / check vert)
- Icône du type (video, article, code, quiz, project)
- Titre de la leçon
- Durée (en minutes)
- Hover effect
- Background vert si complétée

### Footer
- CTA adapté selon la progression :
  - 0% : "Lance-toi dans ce parcours"
  - 1-99% : "Continue ton parcours"
  - 100% : "🎉 Félicitations !"
- Boutons d'action

---

## 🔧 Code technique

### Fichiers créés
- ✅ `src/app/resources/paths/[slug]/page.tsx` — Page dynamique des parcours

### Fichiers modifiés
- ✅ `src/app/resources/page.tsx` — Liens mis à jour vers les slugs spécifiques

### localStorage
Clé : `track-progress-{slug}`  
Format : `["1-Titre Leçon 1", "2-Titre Leçon 2", ...]`

### Fonction de progression
```typescript
const toggleLesson = (moduleId: number, lessonTitle: string) => {
  const lessonId = `${moduleId}-${lessonTitle}`
  const newCompleted = completedLessons.includes(lessonId)
    ? completedLessons.filter(id => id !== lessonId)
    : [...completedLessons, lessonId]
  
  setCompletedLessons(newCompleted)
  localStorage.setItem(`track-progress-${slug}`, JSON.stringify(newCompleted))
}
```

---

## 📊 Statistiques des parcours

| Parcours | Niveau | Durée | Modules | Leçons | Total (min) |
|----------|--------|-------|---------|--------|-------------|
| Débuter en IA/ML | Beginner | 8-12 sem | 4 | 15 | ~1350 min |
| Data Scientist Jr | Intermediate | 12-16 sem | 5 | 20 | ~2355 min |
| NLP & LLMs | Advanced | 10-14 sem | 5 | 19 | ~2340 min |

---

## 🚀 Prochaines améliorations

1. **Backend Supabase**
   - Stocker les parcours dans une table `tracks`
   - Stocker la progression dans `user_track_progress`
   - Sync cloud au lieu de localStorage

2. **Liens vers ressources réelles**
   - Lier chaque leçon à une ressource concrète
   - Ouvrir la ressource au clic

3. **Certificats**
   - Générer un certificat PDF à 100%
   - Badge "Complété" sur le profil

4. **Gamification**
   - Points par leçon complétée
   - Badges "3 jours consécutifs"
   - Leaderboard communautaire

5. **Recommendations intégrées**
   - Suggérer le parcours selon l'onboarding
   - Badge "Recommandé pour toi" sur un track

---

## ✅ Tests

### Scénarios à tester

1. **Navigation**
   - Depuis `/resources` → cliquer sur un track → arriver sur la page dédiée

2. **Progression**
   - Cocher une leçon → voir la progress bar augmenter
   - Recharger la page → voir la progression sauvegardée
   - Cocher toutes les leçons → voir "100% complété"

3. **Réinitialisation**
   - Cocher quelques leçons
   - Cliquer "Réinitialiser la progression"
   - Voir toutes les leçons redevenir non cochées

4. **Page introuvable**
   - Aller sur `/resources/paths/inexistant`
   - Voir le message "Parcours introuvable"
   - Cliquer "Retour" → revenir sur `/resources`

---

## ✅ Validation

- ✅ 3 parcours avec contenu structuré
- ✅ Pages dynamiques avec slug
- ✅ Suivi de progression fonctionnel
- ✅ Design adaptatif par niveau
- ✅ Types de leçons variés avec icônes
- ✅ 0 erreurs lints/TypeScript
- ✅ Responsive
- ✅ Navigation fluide

---

**🎉 Les parcours dynamiques sont prêts !**

**Prochaine étape :** Lier les leçons à des ressources réelles de Supabase 🚀

