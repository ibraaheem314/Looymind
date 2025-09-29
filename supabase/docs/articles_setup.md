# Configuration Supabase pour les Articles

## 1. Création de la table articles

```sql
-- Créer la table articles
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Créer un index sur le slug pour les recherches rapides
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Créer une fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET views = views + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;
```

## 2. Politiques RLS (Row Level Security)

```sql
-- Activer RLS sur la table articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Politique pour lire les articles publiés (tous les utilisateurs)
CREATE POLICY "Articles publiés sont visibles par tous" ON articles
  FOR SELECT USING (status = 'published');

-- Politique pour que les auteurs puissent voir leurs propres articles
CREATE POLICY "Auteurs peuvent voir leurs articles" ON articles
  FOR SELECT USING (auth.uid() = author_id);

-- Politique pour créer des articles (utilisateurs connectés)
CREATE POLICY "Utilisateurs connectés peuvent créer des articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Politique pour modifier ses propres articles
CREATE POLICY "Auteurs peuvent modifier leurs articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Politique pour supprimer ses propres articles
CREATE POLICY "Auteurs peuvent supprimer leurs articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);
```

## 3. Données de test

```sql
-- Insérer des articles de test
INSERT INTO articles (title, content, excerpt, slug, author_id, status, category, tags, featured) VALUES
(
  'L''IA au Sénégal : État des lieux et perspectives',
  '# Introduction

L''intelligence artificielle connaît un essor remarquable au Sénégal, avec de nombreuses initiatives portées par des acteurs locaux et internationaux.

## L''écosystème actuel

### Universités et recherche
- UCAD : Laboratoire d''IA et Data Science
- ESP : Formation en ingénierie IA
- UGB : Programme de master en IA

### Entreprises et startups
- Orange Sénégal : Solutions IA pour les télécommunications
- JokkoSanté : IA pour la santé
- DataTech : Solutions IA pour l''agriculture

## Défis et opportunités

### Défis
- Manque de données de qualité
- Ressources humaines limitées
- Infrastructure technologique

### Opportunités
- Marché local en croissance
- Soutien gouvernemental
- Partenariats internationaux

## Conclusion

L''IA au Sénégal présente un potentiel énorme avec des défis à relever et des opportunités à saisir.',
  'Une analyse complète de l''écosystème IA sénégalais, des défis aux opportunités.',
  'ia-senegal-etat-lieux-perspectives',
  (SELECT id FROM auth.users LIMIT 1),
  'published',
  'IA',
  ARRAY['IA', 'Sénégal', 'Écosystème', 'Analyse'],
  true
),
(
  'Interview : Comment devenir Data Scientist au Sénégal',
  '# Rencontre avec Fatou Sarr

Fatou Sarr, Data Scientist chez Orange Sénégal, partage son parcours et ses conseils pour devenir Data Scientist au Sénégal.

## Son parcours

### Formation
- Master en Mathématiques à l''UCAD
- Formation en Data Science en ligne
- Certifications en Machine Learning

### Expérience professionnelle
- 3 ans chez Orange Sénégal
- Projets de prédiction de churn
- Modèles de recommandation

## Conseils pour les débutants

### Compétences techniques
- Python et R
- SQL et bases de données
- Machine Learning
- Statistiques

### Compétences soft
- Communication
- Résolution de problèmes
- Travail en équipe

## Ressources recommandées

- Cours en ligne (Coursera, edX)
- Communautés locales (Looymind)
- Projets personnels
- Stages et formations',
  'Rencontre avec Fatou Sarr, Data Scientist chez Orange Sénégal, qui partage son parcours.',
  'interview-devenir-data-scientist-senegal',
  (SELECT id FROM auth.users LIMIT 1),
  'published',
  'Interview',
  ARRAY['Carrière', 'Data Science', 'Parcours', 'Interview'],
  false
),
(
  'Projet IA : Prédiction des récoltes au Sénégal',
  '# Étude de cas : Projet AgriPredict

Un projet d''IA agricole développé par des étudiants de l''UCAD pour prédire les rendements des cultures.

## Contexte du projet

### Problématique
- Variabilité des rendements agricoles
- Impact du changement climatique
- Besoin d''optimisation des ressources

### Objectifs
- Prédire les rendements par culture
- Optimiser l''utilisation des engrais
- Réduire les pertes agricoles

## Méthodologie

### Données utilisées
- Données météorologiques historiques
- Types de sols
- Variétés de cultures
- Rendements passés

### Modèles utilisés
- Régression linéaire
- Random Forest
- Réseaux de neurones

## Résultats

### Performance du modèle
- Précision de 85% sur les prédictions
- Réduction de 20% des coûts d''engrais
- Amélioration des rendements de 15%

### Impact
- 50 agriculteurs bénéficiaires
- Économies de 2M FCFA par saison
- Modèle déployé dans 3 régions

## Leçons apprises

### Défis techniques
- Qualité des données
- Intégration des données météo
- Validation des prédictions

### Défis organisationnels
- Adoption par les agriculteurs
- Formation des utilisateurs
- Maintenance du système

## Perspectives

### Améliorations prévues
- Intégration de données satellites
- Prédictions en temps réel
- Extension à d''autres cultures

### Déploiement
- Expansion à 5 nouvelles régions
- Partenariat avec le ministère de l''Agriculture
- Modèle open source',
  'Étude de cas sur un projet d''IA agricole développé par des étudiants de l''UCAD.',
  'projet-ia-prediction-recoltes-senegal',
  (SELECT id FROM auth.users LIMIT 1),
  'published',
  'Projet',
  ARRAY['Agriculture', 'IA', 'Projet', 'Étude de cas'],
  true
);
```

## 4. Mise à jour des types TypeScript

Ajoutez ces types à votre fichier `src/lib/supabase.ts` :

```typescript
export interface Article {
  id: string
  title: string
  content: string
  excerpt: string | null
  slug: string
  author_id: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  category: string
  image_url: string | null
  views: number
  likes: number
  created_at: string
  updated_at: string
  published_at: string | null
  profiles?: {
    display_name: string
    avatar_url: string | null
  }
}
```

## 5. Instructions d'installation

1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet "SQL Editor"
3. Exécutez le script SQL de création de table
4. Exécutez le script des politiques RLS
5. Exécutez le script d'insertion des données de test
6. Vérifiez que tout fonctionne en consultant la table `articles`

## 6. Vérification

Après avoir exécuté ces scripts, vous devriez avoir :
- Une table `articles` avec les bonnes colonnes
- Des politiques RLS activées
- Des articles de test insérés
- Une fonction `increment_article_views` créée
