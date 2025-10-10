# 🎨 SYSTÈME DE BOUTONS PREMIUM - PALANTEER

## 📊 RÉSUMÉ

Refonte complète du système de boutons de la homepage avec **6 classes utilitaires réutilisables** pour assurer cohérence et maintenabilité.

---

## 🎯 CLASSES DE BOUTONS

### **1. `.btn-primary` - Bouton Principal**
**Usage :** Actions primaires (inscription, CTA principal)

**Style :**
- Gradient cyan-bleu (`from-cyan-500 to-blue-600`)
- Shadow glow cyan (`shadow-cyan-500/30`)
- Hover : Gradient plus clair + shadow intensifié
- Translate-y -1 au hover
- Font-weight: semibold

**Exemple :**
```tsx
<Button size="lg" className="btn-primary text-lg px-10 py-6 group" asChild>
  <Link href="/auth/register">
    <Zap className="h-5 w-5 mr-2 btn-primary-icon" />
    Commencer gratuitement
  </Link>
</Button>
```

---

### **2. `.btn-secondary` - Bouton Secondaire (Fond clair)**
**Usage :** Actions secondaires sur fond clair

**Style :**
- Transparent avec bordure cyan (`border-cyan-400/50`)
- Texte cyan (`text-cyan-600`)
- Hover : Fond cyan semi-transparent + shadow
- Translate-y -0.5 au hover

**Exemple :**
```tsx
<Button variant="outline" size="lg" className="btn-secondary text-lg px-10 py-6 group" asChild>
  <Link href="/competitions">
    <Trophy className="h-5 w-5 mr-2 btn-primary-icon" />
    Voir les compétitions
  </Link>
</Button>
```

---

### **3. `.btn-secondary-dark` - Bouton Secondaire (Fond sombre)**
**Usage :** Actions secondaires sur fond sombre (Hero)

**Style :**
- Transparent avec bordure cyan (`border-cyan-400/40`)
- Texte clair (`text-slate-100`)
- Hover : Fond cyan semi-transparent + shadow
- Translate-y -0.5 au hover

**Exemple :**
```tsx
<Button variant="outline" size="lg" className="btn-secondary-dark text-lg px-10 py-6 group" asChild>
  <Link href="/competitions">
    <Trophy className="h-5 w-5 mr-2 btn-primary-icon" />
    Voir les compétitions
  </Link>
</Button>
```

---

### **4. `.btn-tertiary` - Bouton Tertiaire (Fond clair)**
**Usage :** Actions tertiaires, liens secondaires

**Style :**
- Transparent avec bordure grise (`border-slate-300`)
- Texte gris foncé (`text-slate-700`)
- Hover : Fond gris clair + shadow
- Pas de translate-y

**Exemple :**
```tsx
<Button variant="outline" size="lg" className="btn-tertiary text-lg px-10 py-6 group" asChild>
  <Link href="/newsletter">
    <Mail className="h-5 w-5 mr-2 btn-primary-icon" />
    S'abonner à la Newsletter
  </Link>
</Button>
```

---

### **5. `.btn-tertiary-dark` - Bouton Tertiaire (Fond sombre)**
**Usage :** Actions tertiaires sur fond sombre (Hero)

**Style :**
- Transparent avec bordure grise (`border-slate-400/40`)
- Texte clair (`text-slate-100`)
- Hover : Fond gris semi-transparent + shadow
- Translate-y -0.5 au hover

**Exemple :**
```tsx
<Button variant="outline" size="lg" className="btn-tertiary-dark text-lg px-10 py-6 group" asChild>
  <Link href="/articles">
    <BookOpen className="h-5 w-5 mr-2 btn-primary-icon" />
    Voir les tutoriels
  </Link>
</Button>
```

---

### **6. `.btn-inverse` - Bouton Inversé**
**Usage :** CTA sur fond coloré (bande organisations)

**Style :**
- Fond blanc (`bg-white`)
- Texte sombre (`text-slate-900`)
- Hover : Fond gris clair + shadow intense
- Translate-y -1 au hover
- Font-weight: semibold

**Exemple :**
```tsx
<Button size="lg" className="btn-inverse text-lg px-10 py-6 group" asChild>
  <Link href="/auth/register">
    <Rocket className="h-5 w-5 mr-2 btn-primary-icon" />
    Lancer une compétition
  </Link>
</Button>
```

---

### **7. `.btn-brand` - Bouton Brand**
**Usage :** CTA final, couleur brand Palanteer

**Style :**
- Fond bleu nuit (`bg-[#2d5986]`)
- Texte blanc
- Hover : Fond plus foncé + shadow brand
- Translate-y -0.5 au hover
- Font-weight: semibold

**Exemple :**
```tsx
<Button size="lg" className="btn-brand text-lg px-10 py-7 group" asChild>
  <Link href="/auth/register">
    <Zap className="h-5 w-5 mr-2 btn-primary-icon" />
    Commencer Gratuitement
  </Link>
</Button>
```

---

## 🎯 CLASSES UTILITAIRES

### **`.btn-primary-icon`**
Animation d'icônes au hover (scale + rotate)

```tsx
<Zap className="h-5 w-5 mr-2 btn-primary-icon" />
```

**Effet :**
- `scale-110` au hover
- `rotate-3` au hover
- Transition 300ms

---

### **`.btn-arrow-slide`**
Animation de flèche qui glisse au hover

```tsx
<Button className="btn-primary btn-arrow-slide group">
  <span className="relative z-10 flex items-center">
    Commencer
    <ArrowRight className="h-5 w-5 ml-2 arrow" />
  </span>
</Button>
```

**Effet :**
- Flèche translate-x au hover

---

### **`.btn-overlay`**
Overlay gradient au hover (effet premium)

```tsx
<Button className="btn-primary btn-arrow-slide group">
  <span className="relative z-10">...</span>
  <div className="btn-overlay" aria-hidden="true" />
</Button>
```

**Effet :**
- Gradient overlay qui apparaît au hover
- Opacity 0 → 100

---

## 📊 HIÉRARCHIE VISUELLE

### **Niveau 1 - Action Primaire**
- ✅ `.btn-primary` : Inscription, CTA principal
- ✅ `.btn-inverse` : CTA sur fond coloré

### **Niveau 2 - Action Secondaire**
- ✅ `.btn-secondary` : Liens importants (fond clair)
- ✅ `.btn-secondary-dark` : Liens importants (fond sombre)
- ✅ `.btn-brand` : CTA avec couleur brand

### **Niveau 3 - Action Tertiaire**
- ✅ `.btn-tertiary` : Liens secondaires (fond clair)
- ✅ `.btn-tertiary-dark` : Liens secondaires (fond sombre)

---

## 🎨 PALETTE DE COULEURS

| Bouton | Fond | Bordure | Texte | Hover Fond | Hover Shadow |
|--------|------|---------|-------|------------|--------------|
| **Primary** | Gradient cyan-bleu | - | Blanc | Gradient plus clair | Cyan intense |
| **Secondary** | Transparent | Cyan 50% | Cyan 600 | Cyan 10% | Cyan 20% |
| **Secondary Dark** | Transparent | Cyan 40% | Slate 100 | Cyan 10% | Cyan 20% |
| **Tertiary** | Transparent | Slate 300 | Slate 700 | Slate 50 | Slate 300 |
| **Tertiary Dark** | Transparent | Slate 40% | Slate 100 | Slate 30% | Slate 500 |
| **Inverse** | Blanc | - | Slate 900 | Slate 100 | Intense |
| **Brand** | Bleu #2d5986 | - | Blanc | Bleu #1e3a5f | Brand 30% |

---

## 📈 ANIMATIONS

### **Translate-Y**
- **Primary, Inverse** : `-translate-y-1` (-4px)
- **Secondary, Tertiary Dark** : `-translate-y-0.5` (-2px)
- **Tertiary** : Pas de translate

### **Shadow**
- **Primary** : Glow cyan intense (`shadow-cyan-500/30` → `shadow-cyan-500/50`)
- **Secondary** : Glow cyan subtil (`shadow-cyan-500/20`)
- **Inverse** : Shadow standard → shadow-2xl

### **Icônes**
- **Scale** : `scale-110` au hover
- **Rotate** : `rotate-3` au hover
- **Translate-X** : Flèches (arrow)

---

## 🚀 EXEMPLES D'UTILISATION

### **Hero Section (Fond sombre)**
```tsx
{/* Bouton principal */}
<Button className="btn-primary btn-arrow-slide text-lg px-10 py-6 group">
  Commencer gratuitement
</Button>

{/* Bouton secondaire */}
<Button className="btn-secondary-dark text-lg px-10 py-6 group">
  Voir les compétitions
</Button>

{/* Bouton tertiaire */}
<Button className="btn-tertiary-dark text-lg px-10 py-6 group">
  Tutoriels gratuits
</Button>
```

### **Section normale (Fond clair)**
```tsx
{/* Bouton principal */}
<Button className="btn-primary text-lg px-10 py-6 group">
  Créer mon compte gratuit
</Button>

{/* Bouton secondaire */}
<Button className="btn-secondary text-lg px-10 py-6 group">
  Voir toutes les compétitions
</Button>

{/* Bouton tertiaire */}
<Button className="btn-tertiary text-lg px-10 py-6 group">
  S'abonner à la Newsletter
</Button>
```

### **Bande colorée**
```tsx
{/* Bouton inversé */}
<Button className="btn-inverse text-lg px-10 py-6 group">
  Lancer une compétition
</Button>
```

### **CTA Final**
```tsx
{/* Bouton brand */}
<Button className="btn-brand text-lg px-10 py-7 group">
  Commencer Gratuitement
</Button>

{/* Bouton tertiaire */}
<Button className="btn-tertiary text-lg px-10 py-7 group">
  Explorer les compétitions
</Button>
```

---

## 📊 RÉCAPITULATIF HOMEPAGE

### **13 boutons refondus :**

1. ✅ Hero - Authenticated : "Mon Dashboard" → `.btn-primary`
2. ✅ Hero - Authenticated : "Voir les compétitions" → `.btn-secondary-dark`
3. ✅ Hero - Authenticated : "Voir les tutoriels" → `.btn-tertiary-dark`
4. ✅ Hero - Non-authenticated : "Commencer gratuitement" → `.btn-primary` + `.btn-arrow-slide`
5. ✅ Hero - Non-authenticated : "Voir les compétitions" → `.btn-secondary-dark`
6. ✅ Hero - Non-authenticated : "Tutoriels gratuits" → `.btn-tertiary-dark`
7. ✅ Compétitions : "Voir toutes les compétitions" → `.btn-secondary`
8. ✅ Comment ça marche : "Créer mon compte gratuit" → `.btn-primary`
9. ✅ Bande Organisations : "Lancer une compétition" → `.btn-inverse`
10. ✅ CTA Final : "Commencer Gratuitement" → `.btn-brand`
11. ✅ CTA Final : "Explorer les compétitions" → `.btn-tertiary`
12. ✅ Communauté : "Rejoindre le Discord" → `.btn-secondary`
13. ✅ Communauté : "S'abonner à la Newsletter" → `.btn-tertiary`

---

## 🎨 IMPACT AVANT/APRÈS

### **Avant :**
- ❌ 13 boutons avec styles inline différents
- ❌ Aucune cohérence visuelle
- ❌ Code dupliqué (10+ lignes par bouton)
- ❌ Difficile à maintenir
- ❌ Animations incohérentes

### **Après :**
- ✅ 7 classes utilitaires réutilisables
- ✅ Hiérarchie visuelle claire
- ✅ Code réduit (1 ligne de classe)
- ✅ Facile à maintenir
- ✅ Animations standardisées
- ✅ Design professionnel et cohérent

---

**Date de refonte :** 9 janvier 2025  
**Fichiers modifiés :** 
- `src/app/page.tsx` (13 boutons refondus)
- `src/app/globals.css` (7 classes + 3 utilitaires créées)
**Statut :** ✅ Prêt pour production - **DESIGN SYSTEM COMPLET**

