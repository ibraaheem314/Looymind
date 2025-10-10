# 🔄 GUIDE DE RESTAURATION - Fonctionnalités Archivées

**Date d'archivage** : 10 janvier 2025  
**Archivé par** : Équipe Palanteer

---

## 📦 COMMENT RÉACTIVER UNE FONCTIONNALITÉ

### **Option A : Compétitions IA**

**Temps estimé** : 2-3 semaines  
**Complexité** : Élevée  
**Dépendances** : Système d'évaluation automatique, Storage datasets, Paiements Mobile Money

#### **Étape 1 : Restaurer le code frontend**
```powershell
# Depuis la racine du projet
robocopy "_archive\competitions\app\competitions" "src\app\competitions" /E
robocopy "_archive\competitions\app\admin\competitions" "src\app\admin\competitions" /E
robocopy "_archive\competitions\app\admin\submissions" "src\app\admin\submissions" /E
```

#### **Étape 2 : Restaurer les composants**
```powershell
robocopy "_archive\competitions\components" "src\components\competitions" /E
```

#### **Étape 3 : Restaurer les migrations SQL**
```powershell
# Exécuter dans Supabase SQL Editor (dans l'ordre) :
1. _archive/competitions/competitions_system.sql
2. _archive/competitions/datasets_system.sql
3. _archive/competitions/create_datasets_bucket.sql
```

#### **Étape 4 : Mettre à jour la navigation**

**Header** (`src/components/layout/header.tsx`) :
```typescript
const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Compétitions', href: '/competitions' }, // AJOUTER
  { name: 'Ressources', href: '/resources' },
  { name: 'Articles', href: '/articles' },
  { name: 'Talents', href: '/talents' },
]
```

**Footer** (`src/components/layout/footer.tsx`) :
```typescript
<Link href="/competitions">Compétitions</Link> // AJOUTER
```

#### **Étape 5 : Mettre à jour Homepage**

Ajouter section "Prochaines compétitions" (voir `_archive/docs/homepage_competitions_section.txt`)

#### **Étape 6 : Développements additionnels nécessaires**
- [ ] Système d'évaluation automatique (scoring)
- [ ] Intégration Mobile Money (Wave, Orange Money)
- [ ] Upload et gestion des datasets
- [ ] Système de leaderboard en temps réel
- [ ] Notifications pour soumissions/résultats

---

### **Option B : Projets Collaboratifs**

**Temps estimé** : 1-2 semaines  
**Complexité** : Moyenne  
**Dépendances** : Système de notifications, Messaging (optionnel)

#### **Étape 1 : Restaurer le code frontend**
```powershell
robocopy "_archive\projects\app\projects" "src\app\projects" /E
```

#### **Étape 2 : Restaurer les composants**
```powershell
robocopy "_archive\projects\components" "src\components\projects" /E
```

#### **Étape 3 : Restaurer les migrations SQL**
```powershell
# Exécuter dans Supabase SQL Editor :
_archive/projects/projects_complete_schema.sql
```

#### **Étape 4 : Mettre à jour la navigation**

**Header** :
```typescript
{ 
  name: 'Communauté', 
  href: '/talents',
  submenu: [
    { name: 'Talents', href: '/talents' },
    { name: 'Projets', href: '/projects' }, // AJOUTER
    { name: 'Articles', href: '/articles' },
  ]
}
```

#### **Étape 5 : Développements additionnels nécessaires**
- [ ] Système de collaborateurs (invitations)
- [ ] Gestion des versions de projets
- [ ] Intégration GitHub (webhooks)
- [ ] Notifications pour collaborations
- [ ] Upload galerie d'images

---

## ⚠️ POINTS D'ATTENTION

### **Migrations SQL**
- Les tables archivées peuvent rester en DB sans impact
- Pas de conflit avec les tables actives
- Vérifier que les foreign keys sont correctes

### **RLS Policies**
- Toutes les policies sont définies dans les migrations
- Tester l'accès avec différents rôles (anon, authenticated, admin)

### **Storage Buckets**
- Créer les buckets nécessaires :
  - `datasets` (pour compétitions)
  - `project-images` (pour projets)

### **API Routes**
- Vérifier que les routes `/api/*` existent
- Ajouter routes manquantes si nécessaire

---

## 📊 CHECKLIST DE RESTAURATION

### **Avant de réactiver**
- [ ] Lire ce guide complètement
- [ ] Vérifier que le MVP actuel est stable
- [ ] Planifier le temps nécessaire (2-3 semaines)
- [ ] Préparer les tests utilisateurs

### **Pendant la restauration**
- [ ] Restaurer le code frontend
- [ ] Restaurer les composants
- [ ] Exécuter les migrations SQL
- [ ] Mettre à jour la navigation
- [ ] Tester les routes
- [ ] Vérifier les permissions RLS

### **Après la restauration**
- [ ] Tester le flux complet utilisateur
- [ ] Vérifier qu'il n'y a pas de régression sur MVP
- [ ] Mettre à jour la documentation
- [ ] Annoncer la nouvelle fonctionnalité

---

## 🧪 TESTS À EFFECTUER

### **Compétitions**
- [ ] Créer une compétition (admin)
- [ ] Voir la liste des compétitions
- [ ] Voir le détail d'une compétition
- [ ] Soumettre un fichier CSV
- [ ] Voir le leaderboard
- [ ] Télécharger les datasets

### **Projets**
- [ ] Créer un projet
- [ ] Voir la liste des projets
- [ ] Voir le détail d'un projet
- [ ] Ajouter un commentaire
- [ ] Liker un projet
- [ ] Inviter un collaborateur

---

## 📞 SUPPORT

Si vous rencontrez des difficultés lors de la restauration :
- **Email** : dev@palanteer.com
- **Discord** : #dev-support

---

**Dernière mise à jour** : 10 janvier 2025


