# 🔥 Configuration Supabase - Looymind

## 📋 Étapes de Configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Nom du projet : `looymind`
6. Mot de passe de base de données : générez un mot de passe fort
7. Région : choisissez la plus proche (Europe West pour l'Afrique)
8. Cliquez sur "Create new project"

### 2. Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Copiez les valeurs suivantes :
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Créer les tables de base de données

Allez dans **SQL Editor** dans votre projet Supabase et exécutez ce script :

```sql
-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'mentor', 'org', 'admin')),
  location TEXT,
  bio TEXT,
  skills TEXT[],
  github TEXT,
  linkedin TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des défis
CREATE TABLE challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'debutant' CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')),
  category TEXT NOT NULL,
  metric TEXT NOT NULL,
  dataset_url TEXT NOT NULL,
  rules TEXT,
  prize_xof INTEGER DEFAULT 0,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'a_venir' CHECK (status IN ('a_venir', 'en_cours', 'termine')),
  org_id UUID REFERENCES profiles(id),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des soumissions
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  score DECIMAL,
  rank INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scored', 'error')),
  error_msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  demo_url TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'paused')),
  category TEXT NOT NULL,
  founder_id UUID REFERENCES profiles(id),
  image_url TEXT,
  members INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des membres de projets
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Table des mentors
CREATE TABLE mentors (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  domains TEXT[],
  availability TEXT,
  description TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des demandes de mentorat
CREATE TABLE mentor_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  level TEXT CHECK (level IN ('debutant', 'intermediaire', 'avance')),
  domains TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'completed', 'cancelled')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ressources
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('course', 'article', 'tool', 'dataset', 'video', 'book')),
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'debutant' CHECK (difficulty IN ('debutant', 'intermediaire', 'avance')),
  author_id UUID REFERENCES profiles(id),
  author_name TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  duration TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les profils
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques RLS pour les défis
CREATE POLICY "Challenges are viewable by everyone" ON challenges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create challenges" ON challenges FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques RLS pour les soumissions
CREATE POLICY "Users can view their own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour les projets
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques RLS pour les ressources
CREATE POLICY "Resources are viewable by everyone" ON resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create resources" ON resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, NEW.email, 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Configurer le Storage

1. Allez dans **Storage** dans votre projet Supabase
2. Créez un bucket nommé `submissions`
3. Configurez les politiques de sécurité :

```sql
-- Politique pour les soumissions
CREATE POLICY "Users can upload their own submissions" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Users can view their own submissions" ON storage.objects
FOR SELECT USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[2]);
```

### 6. Tester la configuration

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Allez sur http://localhost:3000/register
3. Créez un compte de test
4. Vérifiez que vous êtes redirigé vers le dashboard
5. Vérifiez que votre profil apparaît dans la table `profiles`

### 7. Données de test (optionnel)

Vous pouvez ajouter des données de test en exécutant ce script dans l'éditeur SQL :

```sql
-- Insérer des défis de test
INSERT INTO challenges (title, slug, description, difficulty, category, metric, dataset_url, prize_xof, ends_at) VALUES
('Prédiction des Prix du Riz au Sénégal', 'prediction-prix-riz-senegal', 'Développez un modèle de machine learning pour prédire les fluctuations des prix du riz sur les marchés sénégalais.', 'intermediaire', 'Agriculture', 'RMSE', 'https://example.com/dataset.csv', 500000, NOW() + INTERVAL '30 days'),
('Classification d''Images Médicales', 'classification-images-medicales', 'Créez un système de classification automatique pour détecter des anomalies dans des radiographies pulmonaires.', 'avance', 'Santé', 'Accuracy', 'https://example.com/medical.csv', 750000, NOW() + INTERVAL '45 days');

-- Insérer des ressources de test
INSERT INTO resources (title, slug, description, type, category, difficulty, author_name, url, rating, downloads) VALUES
('Introduction au Machine Learning avec Python', 'intro-ml-python', 'Un cours complet pour les débutants couvrant les bases du Machine Learning.', 'course', 'Machine Learning', 'debutant', 'Looymind Academy', 'https://example.com/course', 4.8, 1200),
('Guide Complet de l''Analyse de Données avec Pandas', 'guide-pandas', 'Un article détaillé sur l''utilisation de la bibliothèque Pandas.', 'article', 'Data Science', 'intermediaire', 'Data Analyst Pro', 'https://example.com/article', 4.9, 2500);
```

## ✅ Vérification

Une fois configuré, vous devriez pouvoir :
- ✅ Créer un compte utilisateur
- ✅ Se connecter/déconnecter
- ✅ Voir votre profil dans le header
- ✅ Accéder au dashboard
- ✅ Voir les défis et ressources depuis la base de données

## 🚨 Dépannage

Si vous rencontrez des erreurs :

1. **Vérifiez les variables d'environnement** dans `.env.local`
2. **Redémarrez le serveur** après modification des variables
3. **Vérifiez les politiques RLS** dans Supabase
4. **Consultez les logs** dans la console Supabase

## 📞 Support

- Documentation Supabase : https://supabase.com/docs
- Discord Supabase : https://discord.supabase.com
- GitHub Looymind : [Votre repo]
