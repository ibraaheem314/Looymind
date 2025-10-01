# Instructions pour la migration SQL

## 🚀 Comment appliquer les améliorations

### **Étape 1 : Ouvrir Supabase**
1. Va sur [https://supabase.com](https://supabase.com)
2. Connecte-toi à ton projet **Looymind**
3. Clique sur **SQL Editor** dans la barre latérale gauche

### **Étape 2 : Exécuter le script**
1. Clique sur **New query**
2. Copie **tout le contenu** du fichier `supabase/migrations/add_article_interactions.sql`
3. Colle-le dans l'éditeur SQL
4. Clique sur **Run** (ou appuie sur `Ctrl + Enter`)

### **Étape 3 : Vérifier**
Si tout fonctionne correctement, tu devrais voir :
- ✅ "Success. No rows returned"
- Ou un message indiquant que les tables ont été créées

### **❌ En cas d'erreur**
Si tu vois une erreur du type "already exists", c'est normal ! Cela signifie que certaines tables existent déjà. Continue quand même, les autres commandes seront appliquées.

---

## 📊 Ce que ce script fait

### **1. Tables créées**

#### `article_likes`
- Stocke les likes des utilisateurs sur les articles
- **Contrainte UNIQUE** : Un utilisateur ne peut liker un article qu'une seule fois
- **Trigger automatique** : Met à jour `articles.likes_count` automatiquement

#### `article_views`
- Stocke les vues uniques des articles
- **Contrainte UNIQUE** : Une vue par utilisateur par article
- **Trigger automatique** : Met à jour `articles.views_count` automatiquement

### **2. Sécurité (RLS)**
- ✅ Tout le monde peut voir les likes et vues
- ✅ Seuls les utilisateurs connectés peuvent liker
- ✅ Un utilisateur peut seulement supprimer ses propres likes
- ✅ Tout le monde peut enregistrer une vue (même les visiteurs)

### **3. Triggers**
- **`on_article_liked`** : Incrémente le compteur de likes
- **`on_article_unliked`** : Décrémente le compteur de likes
- **`on_article_viewed`** : Incrémente le compteur de vues

---

## 🧪 Comment tester après la migration

### **Test 1 : Vues uniques**
1. Ouvre un article publié
2. Rafraîchis la page plusieurs fois
3. ✅ Le compteur de vues ne doit augmenter que la **première fois**

### **Test 2 : Likes persistants**
1. Connecte-toi
2. Like un article
3. Rafraîchis la page
4. ✅ Le like doit **rester** (cœur rempli)
5. Quitte l'article et reviens
6. ✅ Le like doit **toujours être là**

### **Test 3 : Commentaires**
1. Connecte-toi
2. Écris un commentaire sur un article
3. Clique sur "Publier"
4. ✅ Le commentaire doit apparaître immédiatement
5. Clique sur "Répondre" à un commentaire
6. ✅ La réponse doit s'afficher sous le commentaire parent

---

## 🔍 Vérifier les données dans Supabase

### Voir les likes
```sql
SELECT * FROM article_likes
ORDER BY created_at DESC
LIMIT 10;
```

### Voir les vues
```sql
SELECT * FROM article_views
ORDER BY created_at DESC
LIMIT 10;
```

### Voir les commentaires
```sql
SELECT 
  c.*,
  p.display_name as author_name
FROM comments c
LEFT JOIN profiles p ON c.author_id = p.id
WHERE c.article_id = 'TON_ARTICLE_ID'
ORDER BY c.created_at DESC;
```

---

## 📌 Notes importantes

- Les **vues anonymes** sont possibles (sans `user_id`)
- Les **likes** nécessitent une connexion
- Les **commentaires** nécessitent une connexion
- Tous les compteurs sont mis à jour **automatiquement** par les triggers
- Les suppressions en cascade sont activées (supprimer un article supprime ses likes/vues/commentaires)

---

## ✅ Checklist finale

- [ ] Script SQL exécuté sans erreur
- [ ] Tables `article_likes` et `article_views` visibles dans Supabase
- [ ] Les vues uniques fonctionnent (1 vue par utilisateur)
- [ ] Les likes sont persistants (restent après refresh)
- [ ] Les commentaires s'affichent correctement
- [ ] Les réponses aux commentaires fonctionnent
- [ ] On peut éditer/supprimer ses propres commentaires
