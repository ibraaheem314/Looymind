# Guide de correction complète de Supabase

## 🚨 Problèmes identifiés
1. **Colonnes manquantes** dans la table `profiles`
2. **Politiques RLS incorrectes** empêchant la création de profils
3. **Table articles manquante**

## 🔧 Solution complète

### Étape 1 : Exécuter le script principal
1. Connectez-vous à votre dashboard Supabase
2. Allez dans l'onglet "SQL Editor"
3. Copiez et exécutez le contenu du fichier `SUPABASE_COMPLETE_SETUP.sql`
4. Attendez que l'exécution se termine

### Étape 2 : Vérifier la configuration
1. Exécutez le contenu du fichier `test-supabase-setup.sql`
2. Vérifiez que toutes les colonnes sont présentes
3. Vérifiez que les politiques RLS sont créées

### Étape 3 : Tester l'inscription
1. Allez sur `http://localhost:3000/register`
2. Remplissez le formulaire d'inscription
3. Vérifiez que l'inscription fonctionne sans erreur

## 📋 Ce que fait le script

### Tables mises à jour :
- ✅ **profiles** - Ajout des colonnes manquantes
- ✅ **articles** - Création complète de la table
- ✅ **challenges, submissions, projects, resources** - Vérification des politiques

### Politiques RLS créées :
- ✅ **Profiles** - Lecture publique, écriture par le propriétaire
- ✅ **Articles** - Lecture publique des articles publiés, gestion par l'auteur
- ✅ **Autres tables** - Politiques de sécurité appropriées

### Fonctions créées :
- ✅ **increment_article_views** - Pour compter les vues d'articles

## 🧪 Tests à effectuer

### Test 1 : Inscription
```bash
# Allez sur http://localhost:3000/register
# Créez un compte avec des informations complètes
# Vérifiez que vous êtes redirigé vers le dashboard
```

### Test 2 : Connexion
```bash
# Allez sur http://localhost:3000/login
# Connectez-vous avec vos identifiants
# Vérifiez l'accès au dashboard
```

### Test 3 : Profil
```bash
# Allez sur http://localhost:3000/profile
# Vérifiez que vos informations sont affichées
# Testez la modification du profil
```

## 🚨 En cas d'erreur

### Erreur "RLS policy violation"
- Vérifiez que les politiques RLS sont bien créées
- Vérifiez que l'utilisateur est bien authentifié

### Erreur "Column not found"
- Vérifiez que toutes les colonnes sont ajoutées
- Relancez le script de configuration

### Erreur "Permission denied"
- Vérifiez que l'utilisateur a les bonnes permissions
- Vérifiez que RLS est activé sur les tables

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs dans le dashboard Supabase
3. Exécutez le script de test pour diagnostiquer

## ✅ Validation finale

Après avoir exécuté tous les scripts, vous devriez avoir :
- ✅ Inscription fonctionnelle
- ✅ Connexion fonctionnelle
- ✅ Profils utilisateurs complets
- ✅ Système d'articles opérationnel
- ✅ Sécurité RLS appropriée
