# 🦉 Looymind - Communauté IA du Sénégal

> La première plateforme hybride d'Intelligence Artificielle du Sénégal. Connectons les talents, partageons les connaissances et construisons l'avenir de l'IA en Afrique.

## 🚀 Fonctionnalités

### 🏆 Défis IA Compétitifs
- Participez à des compétitions de machine learning avec des datasets réels
- Prix attractifs en XOF
- Système de scoring automatique
- Classements en temps réel

### 👥 Communauté d'Apprentissage
- Plus de 500 talents connectés
- Système de mentorat
- Profils détaillés avec compétences
- Réseautage professionnel

### 💡 Projets Collaboratifs
- Créez et rejoignez des projets IA innovants
- Collaboration en temps réel
- Gestion des contributions
- Intégration GitHub

### 📚 Ressources Éducatives
- Cours et tutoriels en français
- Articles spécialisés sur l'IA
- Outils et datasets
- Contenu adapté au contexte africain

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Déploiement**: Vercel
- **Versioning**: Git, GitHub

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Git

## ⚡ Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/looymind.git
cd looymind
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration des variables d'environnement**
```bash
cp env.example .env.local
```

4. **Configurer Supabase**
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Copier l'URL et les clés dans `.env.local`
   - Exécuter les migrations SQL (voir section Base de données)

5. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🗄️ Base de données

### Schéma Supabase

Le projet utilise 7 tables principales :

- **`profiles`** - Profils utilisateurs (talents, mentors, entreprises)
- **`challenges`** - Défis IA avec prix et dates
- **`submissions`** - Soumissions aux défis
- **`projects`** - Projets collaboratifs
- **`resources`** - Ressources éducatives
- **`mentors`** - Profils mentors
- **`mentor_requests`** - Demandes de mentorat

### Migrations

```sql
-- Exécuter ces requêtes dans l'éditeur SQL de Supabase
-- (Le schéma complet sera fourni dans /supabase/migrations/)
```

## 🎨 Design System

- **Palette**: Gris/slate minimaliste + orange/bleu du logo
- **Typographie**: Inter (Google Fonts)
- **Composants**: Design cohérent et moderne
- **Responsive**: Mobile-first approach

## 📁 Structure du projet

```
looymind/
├── src/
│   ├── app/                 # Pages Next.js (App Router)
│   │   ├── (auth)/         # Routes d'authentification
│   │   ├── challenges/     # Pages des défis
│   │   ├── projects/       # Pages des projets
│   │   ├── talents/        # Pages des talents
│   │   └── resources/      # Pages des ressources
│   ├── components/         # Composants React
│   │   ├── ui/            # Composants UI de base
│   │   ├── home/          # Composants de la page d'accueil
│   │   ├── challenges/    # Composants des défis
│   │   └── layout/        # Header, Footer
│   ├── lib/               # Utilitaires et configuration
│   │   ├── supabase.ts    # Configuration Supabase
│   │   └── utils.ts       # Fonctions utilitaires
│   └── types/             # Types TypeScript
├── public/                # Assets statiques
├── .env.example          # Variables d'environnement
└── README.md
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Autres plateformes

- **Netlify**: Compatible avec Next.js
- **Railway**: Support PostgreSQL natif
- **DigitalOcean**: App Platform

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [ ] Système de notifications en temps réel
- [ ] Intégration paiements (Mobile Money)
- [ ] API publique pour partenaires
- [ ] Application mobile (React Native)
- [ ] Intelligence artificielle pour matching
- [ ] Certifications et badges

## 🏆 Impact

- **500+** talents connectés
- **25+** défis IA lancés
- **100+** projets réalisés
- **2M+** XOF en prix distribués

## 📞 Contact

- **Email**: contact@looymind.sn
- **Twitter**: [@LooymindSN](https://twitter.com/LooymindSN)
- **LinkedIn**: [Looymind](https://linkedin.com/company/looymind)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Communauté Supabase
- Équipe Next.js
- Développeurs sénégalais
- Partenaires technologiques

---

**Fait avec ❤️ au Sénégal** 🇸🇳