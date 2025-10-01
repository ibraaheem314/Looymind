# 📋 INSTALLATION DE LA BASE DE DONNÉES LOOYMIND

## 🚀 Ordre d'exécution des scripts SQL

### **Pour une NOUVELLE installation :**

Exécutez les scripts dans cet ordre :

1. **`OPTIMIZED_DATABASE_SCHEMA.sql`** (Base de données complète)
   - Crée toutes les tables (profiles, articles, challenges, etc.)
   - Configure les RLS (Row Level Security)
   - Crée les triggers de base (updated_at, handle_new_user)
   - Configure le storage (avatars, datasets, etc.)

2. **`migrations/article_interactions_complete.sql`** (Système d'interactions)
   - Crée la table `article_views` (vues uniques)
   - Configure les triggers pour les likes
   - Configure les triggers pour les vues
   - Configure les triggers pour les commentaires

### **Pour une MIGRATION (base existante) :**

Si tu as déjà exécuté `OPTIMIZED_DATABASE_SCHEMA.sql`, exécute seulement :

- **`migrations/article_interactions_complete.sql`**

---

## 📂 Structure des fichiers

```
supabase/
├── OPTIMIZED_DATABASE_SCHEMA.sql          ← Schema principal (tables, RLS, etc.)
├── README_INSTALLATION.md                 ← Ce fichier
└── migrations/
    ├── article_interactions_complete.sql  ← Likes, vues, commentaires (COMPLET)
    ├── add_article_interactions.sql       ← OBSOLETE (ne plus utiliser)
    ├── add_missing_triggers.sql           ← OBSOLETE (ne plus utiliser)
    ├── fix_article_views_rls.sql          ← OBSOLETE (ne plus utiliser)
    ├── fix_views_like_comments.sql        ← OBSOLETE (ne plus utiliser)
    ├── simple_fix_views.sql               ← OBSOLETE (ne plus utiliser)
    ├── debug_and_fix_views.sql            ← OBSOLETE (ne plus utiliser)
    └── fix_likes_triggers_final.sql       ← OBSOLETE (ne plus utiliser)
```

---

## ✅ Vérification après installation

Après avoir exécuté les scripts, vérifie que tout fonctionne :

### 1️⃣ **Vérifier les tables**
Va dans **Supabase → Table Editor** et vérifie que ces tables existent :
- ✅ `profiles`
- ✅ `articles`
- ✅ `comments`
- ✅ `likes`
- ✅ `article_views` ← **Important pour les vues uniques**

### 2️⃣ **Vérifier les triggers**
Exécute cette requête dans **SQL Editor** :
```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE event_object_table IN ('likes', 'comments', 'article_views', 'profiles', 'articles')
ORDER BY event_object_table, trigger_name;
```

Tu devrais voir :
- ✅ `on_article_liked` (INSERT sur `likes`)
- ✅ `on_article_unliked` (DELETE sur `likes`)
- ✅ `on_article_viewed` (INSERT sur `article_views`)
- ✅ `on_article_commented` (INSERT sur `comments`)
- ✅ `on_article_comment_deleted` (DELETE sur `comments`)

### 3️⃣ **Tester sur le site**
1. Crée un article
2. Clique "J'aime" → Le compteur doit augmenter ✅
3. Rafraîchis la page → Le cœur reste rouge ✅
4. Ajoute un commentaire → Le compteur augmente ✅
5. Entre/sors de l'article → Les vues augmentent de 1 à chaque nouvelle visite ✅

---

## 🗑️ Fichiers obsolètes à supprimer

Une fois que tout fonctionne, tu peux **supprimer** ces fichiers :

```bash
supabase/migrations/add_article_interactions.sql
supabase/migrations/add_missing_triggers.sql
supabase/migrations/fix_article_views_rls.sql
supabase/migrations/fix_views_like_comments.sql
supabase/migrations/simple_fix_views.sql
supabase/migrations/debug_and_fix_views.sql
supabase/migrations/fix_likes_triggers_final.sql
```

**Garde uniquement :**
- ✅ `OPTIMIZED_DATABASE_SCHEMA.sql`
- ✅ `migrations/article_interactions_complete.sql`

---

## 🆘 En cas de problème

### Problème : "permission denied for table article_views"
**Solution :** Exécute à nouveau `article_interactions_complete.sql`

### Problème : Les likes ne s'incrémentent pas
**Solution :** Vérifie que les triggers existent avec la requête ci-dessus

### Problème : Les vues restent à 0
**Solution :** Vérifie que la table `article_views` existe et que les RLS sont bien configurés

---

## 📞 Support

Si tu rencontres un problème, vérifie dans l'ordre :
1. Les tables existent dans **Table Editor**
2. Les triggers existent (requête SQL ci-dessus)
3. Les RLS sont activés (onglet **Authentication → Policies**)
4. La console du navigateur (F12) pour voir les erreurs JavaScript

---

**🎉 Bonne installation !**
