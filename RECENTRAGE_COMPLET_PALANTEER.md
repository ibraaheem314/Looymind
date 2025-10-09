# 🎯 RECENTRAGE COMPLET - PALANTEER
**Date :** 9 octobre 2025  
**Objectif :** Transformer Palanteer en une vraie plateforme de compétitions IA

---

## 🚀 **PLAN D'ACTION**

### **PHASE 1 : Ajouter les Features Critiques (3-5 jours)**

#### **1.1 Système de Scoring Automatique**
**Fichiers à créer :**
```
supabase/migrations/
├── leaderboard_system.sql         # Tables + triggers pour le leaderboard
src/
├── lib/
│   └── scoring.ts                  # Logique de calcul des scores
├── hooks/
│   └── useLeaderboard.ts           # Hook pour récupérer le leaderboard
└── components/
    └── competitions/
        └── leaderboard.tsx         # Composant d'affichage
```

**Schéma SQL :**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id),
  score DECIMAL(10, 6) NOT NULL,
  rank INTEGER,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(competition_id, user_id)
);

-- Trigger pour calculer le rang automatiquement
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY competition_id 
        ORDER BY score DESC
      ) AS new_rank
    FROM leaderboard
    WHERE competition_id = NEW.competition_id
  )
  UPDATE leaderboard l
  SET rank = r.new_rank
  FROM ranked r
  WHERE l.id = r.id AND l.competition_id = NEW.competition_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### **1.2 Évaluation des Soumissions**
**Fichiers à créer :**
```
src/
├── app/
│   └── api/
│       └── evaluate/
│           └── route.ts            # API pour évaluer les soumissions
├── lib/
│   └── metrics.ts                  # Calcul des métriques (RMSE, MAE, Accuracy, F1)
└── components/
    └── competitions/
        └── submission-results.tsx  # Affichage des résultats
```

**Métriques supportées :**
- Classification : Accuracy, Precision, Recall, F1-Score
- Régression : RMSE, MAE, R²
- Ranking : NDCG, MAP

#### **1.3 Gestion de Datasets**
**Fichiers à créer :**
```
supabase/migrations/
├── datasets_system.sql             # Tables pour les datasets
src/
├── app/
│   └── api/
│       └── datasets/
│           ├── upload/
│           │   └── route.ts        # Upload de datasets
│           └── download/
│               └── route.ts        # Download de datasets
└── components/
    └── competitions/
        └── dataset-manager.tsx     # Interface de gestion
```

**Schéma SQL :**
```sql
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,          -- Chemin dans Supabase Storage
  file_size BIGINT,
  file_type VARCHAR(50),             -- train, test, sample
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Datasets publics lisibles par tous"
  ON datasets FOR SELECT
  USING (is_public = true);

CREATE POLICY "Créateurs peuvent gérer leurs datasets"
  ON datasets FOR ALL
  USING (auth.uid() = created_by);
```

---

### **PHASE 2 : Simplifier les Features Existantes (1-2 jours)**

#### **2.1 Simplifier la Modération**
**Actions :**
- ❌ Supprimer 5 pages : `users`, `content`, `competitions`, `resources`, `submissions`
- ✅ Garder uniquement : `reports` + dashboard simple
- ✅ Créer un modal de modération rapide depuis chaque page

**Fichiers à modifier/supprimer :**
```
src/app/admin/moderation/
├── page.tsx                        # Simplifier : juste stats + lien vers reports
├── reports/
│   └── page.tsx                    # Garder
├── users/                          # ❌ SUPPRIMER
├── content/                        # ❌ SUPPRIMER
├── competitions/                   # ❌ SUPPRIMER
├── resources/                      # ❌ SUPPRIMER
└── submissions/                    # ❌ SUPPRIMER
```

#### **2.2 Renommer "Articles" en "Tutoriels & Analyses"**
**Actions :**
- ✅ Renommer la navigation : "Articles" → "Tutoriels"
- ✅ Ajouter des catégories spécifiques IA :
  - Tutoriels (How-to)
  - Analyses de compétitions
  - Retours d'expérience
  - Best practices
- ✅ Lier les articles aux compétitions

**Fichiers à modifier :**
```
src/
├── components/layout/header.tsx    # Navigation
├── app/articles/                   # Renommer en /tutorials ?
│   ├── create/page.tsx             # Ajouter catégories spécifiques
│   └── page.tsx                    # Filtres par catégorie
```

#### **2.3 Simplifier "Talents"**
**Actions :**
- ❌ Supprimer l'annuaire complet
- ✅ Garder uniquement : "Top Contributeurs" dans le dashboard
- ✅ Afficher :
  - Top 10 par score de compétitions
  - Top 10 par contributions (articles, projets)
  - Top 10 par entraide (likes, comments)

**Fichiers à modifier :**
```
src/
├── app/
│   └── talents/
│       └── page.tsx                # Simplifier drastiquement
└── components/
    └── dashboard/
        └── top-contributors.tsx    # Nouveau composant
```

---

### **PHASE 3 : Améliorer l'UX des Compétitions (1 jour)**

#### **3.1 Page Compétition Améliorée**
**Sections à ajouter :**
- ✅ **Overview** : Description, dates, prize
- ✅ **Datasets** : Download train/test
- ✅ **Leaderboard** : Classement en temps réel
- ✅ **Submit** : Upload + évaluation automatique
- ✅ **Discussion** : Forum dédié (ou réutiliser les comments)
- ✅ **Rules** : Règles détaillées

**Fichiers à modifier :**
```
src/app/competitions/[slug]/
├── page.tsx                        # Refonte complète avec tabs
└── components/
    ├── overview-tab.tsx
    ├── datasets-tab.tsx
    ├── leaderboard-tab.tsx
    ├── submit-tab.tsx
    ├── discussion-tab.tsx
    └── rules-tab.tsx
```

---

## 📊 **STRUCTURE SQL FINALE**

### **Tables Principales :**
```
Compétitions:
├── competitions                    # ✅ Existe déjà
├── submissions                     # ✅ Existe déjà
├── leaderboard                     # 🆕 À créer
└── datasets                        # 🆕 À créer

Communauté:
├── articles                        # ✅ Renommer en tutorials
├── projects                        # ✅ Garder tel quel
├── resources                       # ✅ Garder tel quel
└── comments                        # ✅ Garder tel quel

Modération:
├── reports                         # ✅ Garder
├── moderation_actions              # ✅ Garder
└── user_sanctions                  # ✅ Garder

Utilisateurs:
├── profiles                        # ✅ Garder
└── likes                           # ✅ Garder
```

---

## 🎯 **PRIORITÉS PAR ORDRE**

### **🔴 URGENT (Cette semaine)**
1. ✅ **Leaderboard System** - CRITIQUE pour les compétitions
2. ✅ **Datasets Manager** - Nécessaire pour uploader les données
3. ✅ **Submission Evaluation** - Cœur du système

### **🟠 IMPORTANT (Semaine prochaine)**
4. ✅ **Simplifier Modération** - Réduire la complexité
5. ✅ **Renommer Articles** - Recentrer sur l'IA
6. ✅ **Simplifier Talents** - Moins de features, plus de focus

### **🟡 SOUHAITABLE (Plus tard)**
7. ⏳ **Améliorer UX Compétitions** - Tabs, forum, etc.
8. ⏳ **Ajouter Analytics** - Tracking des performances
9. ⏳ **Notifications Real-time** - WebSockets

---

## 📝 **CHECKLIST DE RECENTRAGE**

### **Features Critiques à Ajouter**
- [ ] Système de scoring automatique
- [ ] Évaluation des soumissions (métriques)
- [ ] Gestion de datasets (upload/download)
- [ ] Leaderboard en temps réel

### **Features à Simplifier**
- [ ] Modération (5 pages → 1 page)
- [ ] Articles → Tutoriels (catégories IA)
- [ ] Talents → Top Contributeurs uniquement

### **UX à Améliorer**
- [ ] Page compétition avec tabs
- [ ] Forum/discussion par compétition
- [ ] Dashboard avec stats pertinentes

---

## 🚀 **TIMELINE ESTIMÉE**

**Total : 5-8 jours de développement**

- **Jour 1-2 :** Leaderboard + Scoring
- **Jour 3 :** Datasets Manager
- **Jour 4 :** Submission Evaluation
- **Jour 5 :** Simplification (Modération, Articles, Talents)
- **Jour 6-8 :** UX Compétitions + Tests

---

## 💡 **RÉSULTAT ATTENDU**

### **Avant (Actuel)**
- ❌ Plateforme générique avec beaucoup de features
- ❌ Compétitions sans vrai système de classement
- ❌ Modération trop complexe
- ❌ Articles génériques

### **Après (Recentré)**
- ✅ Plateforme de compétitions IA professionnelle
- ✅ Leaderboard en temps réel avec métriques
- ✅ Upload/download de datasets facile
- ✅ Tutoriels spécifiques IA
- ✅ Interface simple et focalisée

---

**Par où commencer ?**

**Je recommande de commencer par le Leaderboard System (Feature #1) car c'est le plus critique.**

Voulez-vous que je commence maintenant ? 🚀
