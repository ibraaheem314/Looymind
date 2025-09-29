# 🗄️ **GESTION SUPABASE - LOOYMIND**

## 📁 **STRUCTURE ORGANISÉE**

```
supabase/
├── migrations/           # Migrations officielles Supabase
│   └── 001_initial_schema.sql
├── setup/               # Scripts de configuration initiale
│   ├── 001_complete_setup.sql
│   ├── 002_test_setup.sql
│   └── 003_storage_setup.sql
├── fixes/               # Scripts de correction
│   ├── 001_fix_profiles_articles.sql
│   └── 002_fix_profiles_columns.sql
└── docs/                # Documentation
    ├── README.md
    ├── profiles_update.md
    ├── articles_setup.md
    └── correction_guide.md
```

## 🚀 **ORDRE D'EXÉCUTION RECOMMANDÉ**

### **1. CONFIGURATION INITIALE** (Première fois)
```sql
-- Exécuter dans l'ordre :
1. supabase/setup/001_complete_setup.sql
2. supabase/setup/002_test_setup.sql
3. supabase/setup/003_storage_setup.sql
```

### **2. CORRECTIONS** (Si problèmes)
```sql
-- Exécuter selon les besoins :
1. supabase/fixes/001_fix_profiles_articles.sql
2. supabase/fixes/002_fix_profiles_columns.sql
```

## 📋 **DESCRIPTION DES SCRIPTS**

### **SETUP (Configuration initiale)**
- **`001_complete_setup.sql`** : Configuration complète (tables, RLS, fonctions)
- **`002_test_setup.sql`** : Données de test
- **`003_storage_setup.sql`** : Configuration du stockage

### **FIXES (Corrections)**
- **`001_fix_profiles_articles.sql`** : Corrige profiles + crée articles
- **`002_fix_profiles_columns.sql`** : Ajoute colonnes manquantes profiles

## ⚠️ **IMPORTANT**

1. **Toujours sauvegarder** avant d'exécuter des scripts
2. **Exécuter dans l'ordre** recommandé
3. **Vérifier les erreurs** après chaque script
4. **Ne pas exécuter plusieurs fois** le même script

## 🔧 **EN CAS DE PROBLÈME**

1. Vérifier les logs Supabase
2. Consulter `docs/correction_guide.md`
3. Utiliser les scripts de `fixes/` selon le problème
