# 🚀 Guide de Configuration - Looymind

## 📋 Étapes pour configurer l'authentification

### 1. **Créer un projet Supabase**

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub
4. Cliquez sur "New Project"
5. Choisissez votre organisation
6. Nom du projet : `looymind`
7. Mot de passe de base de données : (générez un mot de passe fort)
8. Région : `West Africa (af-south-1)` ou `Europe West (eu-west-1)`
9. Cliquez sur "Create new project"

### 2. **Récupérer les clés Supabase**

Une fois le projet créé :

1. Allez dans **Settings** > **API**
2. Copiez :
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. **Configurer les variables d'environnement**

Ouvrez le fichier `.env.local` et remplacez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. **Créer les tables dans Supabase**

1. Allez dans **SQL Editor** dans votre dashboard Supabase
2. Copiez et exécutez le contenu du fichier `supabase/migrations/001_initial_schema.sql`
3. Cliquez sur **Run** pour exécuter les requêtes

### 5. **Configurer l'authentification**

1. Allez dans **Authentication** > **Settings**
2. **Site URL** : `http://localhost:3000` (pour le développement)
3. **Redirect URLs** : Ajoutez `http://localhost:3000/dashboard`
4. **Email** : Activez "Enable email confirmations" si vous le souhaitez

### 6. **Tester la connexion**

1. Redémarrez votre serveur de développement :
```bash
npm run dev
```

2. Allez sur `http://localhost:3000/register`
3. Créez un compte de test
4. Vérifiez que vous êtes redirigé vers le dashboard

## 🔧 Configuration avancée

### **Row Level Security (RLS)**

Les tables sont protégées par RLS. Pour les désactiver temporairement :

```sql
-- Désactiver RLS pour les tests
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;
-- etc...
```

### **Storage Buckets**

Pour les uploads de fichiers :

1. Allez dans **Storage**
2. Créez un bucket nommé `looymind-storage`
3. Configurez les politiques d'accès

### **Edge Functions**

Pour le scoring automatique :

1. Allez dans **Edge Functions**
2. Créez une nouvelle fonction
3. Déployez le code de scoring

## 🚨 Dépannage

### **Erreur "Invalid API key"**
- Vérifiez que les clés dans `.env.local` sont correctes
- Redémarrez le serveur après modification

### **Erreur "Table doesn't exist"**
- Vérifiez que les migrations SQL ont été exécutées
- Vérifiez que les noms de tables correspondent

### **Erreur de connexion**
- Vérifiez que l'URL Supabase est correcte
- Vérifiez votre connexion internet
- Vérifiez que le projet Supabase est actif

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Supabase dans le dashboard
3. Consultez la [documentation Supabase](https://supabase.com/docs)

---

**Une fois configuré, votre authentification Looymind sera pleinement fonctionnelle !** 🎉
