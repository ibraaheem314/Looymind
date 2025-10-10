# 🎨 Système de Design LooyMind

## 📐 Architecture des Couleurs

### Background Général
```tsx
bg-gray-50  // #f9fafb - Fond principal des pages
```

**Pourquoi ?**
- ✅ Réduit la fatigue oculaire sur longues sessions
- ✅ Crée une hiérarchie visuelle claire
- ✅ Les cards blanches ressortent mieux
- ✅ Standard industrie (Zindi, Kaggle, GitHub, Notion)

---

## 🎨 Palette de Couleurs par Section

### Hero Sections (Gradients)
Chaque page a son gradient unique pour l'identification visuelle :

```tsx
// Accueil
bg-gradient-to-br from-slate-50 via-white to-cyan-50/30

// Ressources
bg-gradient-to-br from-green-50 via-white to-emerald-50/30

// Compétitions
bg-gradient-to-br from-slate-50 via-white to-cyan-50/30

// Projets
bg-gradient-to-br from-purple-50 via-white to-blue-50/30

// Articles
bg-gradient-to-br from-blue-50 via-white to-indigo-50/30

// Talents
bg-gradient-to-br from-orange-50 via-white to-amber-50/30
```

### Cards & Composants
```tsx
bg-white       // Cards principales
border-slate-200  // Bordures subtiles
hover:shadow-md   // Élévation au survol
```

---

## 🎯 Couleurs d'Accentuation

### Ressources → Vert
```tsx
bg-green-500 hover:bg-green-600
shadow-green-500/30
text-green-500
```

### Compétitions → Cyan
```tsx
bg-cyan-500 hover:bg-cyan-600
shadow-cyan-500/30
text-cyan-500
```

### Projets → Violet
```tsx
bg-purple-500 hover:bg-purple-600
shadow-purple-500/30
text-purple-500
```

### Articles → Bleu
```tsx
bg-blue-500 hover:bg-blue-600
shadow-blue-500/30
text-blue-500
```

### Talents → Orange
```tsx
bg-orange-500 hover:bg-orange-600
shadow-orange-500/30
text-orange-500
```

---

## 📏 Structure Type d'une Page

```tsx
<div className="min-h-screen bg-gray-50">
  
  {/* Hero Section avec gradient coloré */}
  <section className="bg-gradient-to-br from-X-50 via-white to-Y-50/30">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Contenu hero */}
    </div>
  </section>

  {/* Contenu principal sur fond gris */}
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
    {/* Cards blanches qui ressortent */}
    <Card className="bg-white border border-slate-200 hover:shadow-md">
      {/* Contenu */}
    </Card>
    
  </div>
</div>
```

---

## ✨ Composants Réutilisables

### Floating Emojis
```tsx
<div className="absolute top-10 left-[10%] text-4xl opacity-20">🎯</div>
<div className="absolute top-24 right-[12%] text-3xl opacity-15">💡</div>
```

### Stats Inline
```tsx
<div className="flex items-center gap-6 mb-8">
  <div className="flex items-center gap-2">
    <div className="flex -space-x-2">
      <div className="w-8 h-8 rounded-full bg-X-100 border-2 border-white flex items-center justify-center text-xs">
        🎯
      </div>
      {/* Plus d'emojis... */}
    </div>
    <span className="text-sm text-slate-600">Statistique</span>
  </div>
</div>
```

### Mockup Preview
```tsx
<div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform rotate-1 hover:rotate-0 transition-transform">
  {/* Contenu du mockup */}
</div>
```

---

## 🎭 Animations

### Entrée de Page
```tsx
animate-fadeIn       // Apparition douce
animate-fadeInUp     // Monte en apparaissant
animate-fadeInScale  // Zoom en apparaissant
```

### Survol
```tsx
hover:shadow-md transition-all duration-200
hover:border-X-200
group-hover:text-X-600
```

### Délais d'Animation
```tsx
animation-delay-100
animation-delay-200
animation-delay-300
```

---

## 📱 Responsive

### Breakpoints
```tsx
sm: 640px   // Mobile large
md: 768px   // Tablette
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Grid Responsive Type
```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5
```

---

## 🔍 Accessibilité

### Contraste
- Texte principal: `text-slate-900` sur `bg-white` ou `bg-gray-50`
- Texte secondaire: `text-slate-600`
- Texte tertiaire: `text-slate-400`

### Focus States
```tsx
focus:ring-2 focus:ring-X-500 focus:border-transparent
```

---

## 📊 Badges & Status

### Catégories
```tsx
bg-blue-100 text-blue-800    // Data Science
bg-purple-100 text-purple-800 // NLP
bg-green-100 text-green-800   // Computer Vision
```

### Difficulté
```tsx
bg-green-100 text-green-800   // Débutant
bg-yellow-100 text-yellow-800 // Intermédiaire
bg-orange-100 text-orange-800 // Avancé
bg-red-100 text-red-800       // Expert
```

### Status
```tsx
bg-green-100 text-green-800 // Actif
bg-blue-100 text-blue-800   // Bientôt
bg-gray-100 text-gray-800   // Terminé
bg-red-100 text-red-800     // Urgent
```

---

## 🎯 Principes de Design

### 1. Hiérarchie Claire
- Hero → Gradient coloré
- Contenu → Fond gris subtil
- Cards → Blanc pur

### 2. Cohérence Visuelle
- Même structure sur toutes les pages
- Couleurs d'accentuation par section
- Animations subtiles et professionnelles

### 3. Performance
- Transitions fluides (200-300ms)
- Animations légères
- Pas d'effets lourds

### 4. Accessibilité
- Contrastes WCAG AA minimum
- Focus states visibles
- Texte lisible (16px minimum)

---

## 📚 Inspirations

- **Zindi.africa** → Minimalisme, stats, badges
- **Kaggle.com** → Hero sections, mockups, grilles
- **Andakia.tech** → Gradients, typographie, espacements
- **GitHub** → Fond gris, cards blanches
- **Notion** → Hiérarchie visuelle, confort

---

## 🚀 Pages Actuelles

| Page | Status | Gradient | Accentuation |
|------|--------|----------|--------------|
| 🏠 Accueil | ✅ | Slate/Cyan | Cyan |
| 📚 Ressources | ✅ | Green/Emerald | Green |
| 🏆 Compétitions | ✅ | Slate/Cyan | Cyan |
| 💻 Projets | ✅ | Purple/Blue | Purple |
| ✍️ Articles | ✅ | Blue/Indigo | Blue |
| 👥 Talents | ✅ | Orange/Amber | Orange |

---

*Dernière mise à jour : Octobre 2024*
*Design System par l'équipe LooyMind*

