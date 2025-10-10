# 🧪 Guide de test — Phase 1

Ce guide t'aide à tester toutes les nouvelles fonctionnalités de Phase 1.

---

## Prérequis

1. **Base de données à jour:**
   ```bash
   # Appliquer la migration Phase 1
   npx supabase db reset  # ou
   npx supabase migration up
   ```

2. **Serveur de dev lancé:**
   ```bash
   npm run dev
   ```

3. **Compte utilisateur de test:**
   - Email: `test@looymind.com`
   - Mot de passe: `Test123!`
   (ou crée un nouveau compte)

---

## Test 1: Onboarding complet

**Objectif:** Vérifier que le wizard fonctionne et sauvegarde les données.

### Étapes:
1. Créer un nouveau compte (ou se déconnecter si déjà connecté)
2. S'inscrire avec un nouvel email
3. **Résultat attendu:** Redirection automatique vers `/onboarding`

4. **Étape 1 — Objectifs:**
   - Sélectionner au moins 1 objectif (ex: "LLMs / IA générative")
   - Vérifier que le bouton "Suivant" est désactivé si aucun objectif
   - Cliquer "Suivant"

5. **Étape 2 — Niveau:**
   - Sélectionner un niveau (ex: "Débutant")
   - Vérifier que le bouton "Retour" fonctionne
   - Cliquer "Suivant"

6. **Étape 3 — Temps disponible:**
   - Sélectionner une durée (ex: "5h / semaine")
   - Cliquer "Suivant"

7. **Étape 4 — Langues:**
   - Sélectionner au moins 1 langue (FR par défaut)
   - Vérifier que le bouton devient "Voir mon plan"
   - Cliquer "Voir mon plan"

8. **Résultat attendu:**
   - Redirection vers `/plan`
   - Les recommandations s'affichent (ou empty state si DB vide)
   - Le profil utilisateur en haut affiche les choix faits

### Vérification en DB:
```sql
-- Dans Supabase SQL Editor
SELECT id, level, goals, langs, time_per_week 
FROM profiles 
WHERE email = 'test@looymind.com';
```

**Résultat attendu:** Les données de l'onboarding sont enregistrées.

---

## Test 2: Mode invité

**Objectif:** Vérifier que les utilisateurs non connectés voient l'invitation.

### Étapes:
1. Se déconnecter
2. Aller sur `/plan`
3. **Résultat attendu:**
   - Page `GuestRedirect` s'affiche
   - Message: "Ton plan d'apprentissage personnalisé"
   - Liste des bénéfices visible
   - 2 boutons: "Se connecter" et "Créer un compte"
4. Cliquer "Se connecter"
5. **Résultat attendu:**
   - Redirection vers `/auth/login?redirect=/plan`

---

## Test 3: Recommandations personnalisées

**Objectif:** Vérifier que l'endpoint `/api/recommendations` fonctionne.

### Prérequis:
- Avoir au moins 10 ressources dans la DB avec les nouvelles colonnes (`level`, `domains`, `lang`, etc.)
- Si DB vide, ajouter des ressources de test:

```sql
-- Exemple de ressource de test
INSERT INTO resources (title, url, description, level, domains, lang, duration_minutes, quality_score, published_at)
VALUES (
  'Introduction aux LLMs',
  'https://example.com/llm-intro',
  'Cours débutant sur les modèles de langage',
  'Beginner',
  ARRAY['LLMs', 'NLP'],
  'FR',
  120,
  0.8,
  NOW()
);
```

### Étapes:
1. Se connecter avec un compte ayant complété l'onboarding
2. Aller sur `/plan`
3. **Résultat attendu:**
   - Section "Start Pack" avec 3 ressources
   - Section "Mini-parcours" avec jusqu'à 6 ressources
   - Section "Alternatives" avec jusqu'à 3 ressources
   - Chaque carte affiche:
     - Badges (niveau, durée, langue, domaines)
     - Encadré cyan "Pourquoi ?" avec explication
     - Bouton "Commencer"
     - Bouton bookmark (📥)

4. Cliquer "Régénérer"
5. **Résultat attendu:**
   - Loading spinner
   - Nouvelles recommandations (ou les mêmes si peu de ressources)

### Vérification API:
Ouvre la console réseau (F12 → Network)
- Recherche la requête `GET /api/recommendations?user_id=...&limit=10`
- Statut: 200
- Temps de réponse: < 500ms
- Body contient: `{ items: [...] }`

---

## Test 4: Tracking des interactions

**Objectif:** Vérifier que `/api/events` enregistre les événements.

### Étapes:
1. Sur `/plan`, ouvrir la console réseau
2. Cliquer "Commencer" sur une ressource
3. **Vérification console:**
   - Requête `POST /api/events`
   - Body: `{ event: "click", resource_id: "..." }`
   - Statut: 200

4. **Vérification DB:**
```sql
SELECT * FROM interactions 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'test@looymind.com')
ORDER BY created_at DESC
LIMIT 5;
```

**Résultat attendu:** Un event `click` est enregistré avec le bon `resource_id`.

---

## Test 5: Ajustement des préférences

**Objectif:** Modifier le profil et voir de nouvelles recos.

### Étapes:
1. Sur `/plan`, cliquer "Ajuster"
2. **Résultat attendu:** Redirection vers `/onboarding`
3. Modifier le niveau (ex: Débutant → Intermédiaire)
4. Modifier les objectifs (ajouter ou retirer)
5. Cliquer "Voir mon plan"
6. **Résultat attendu:**
   - Retour sur `/plan`
   - Le profil en haut reflète les nouveaux choix
7. Cliquer "Régénérer"
8. **Résultat attendu:**
   - Nouvelles recommandations basées sur le nouveau profil

---

## Test 6: Empty states

**Objectif:** Vérifier les messages si aucune recommandation.

### Simulation:
1. Vider temporairement la table `resources`:
```sql
-- NE PAS FAIRE EN PROD !
DELETE FROM resources;
```

2. Sur `/plan`, recharger la page
3. **Résultat attendu:**
   - EmptyState s'affiche
   - Message: "Aucune recommandation disponible"
   - 2 boutons: "Explorer le catalogue" et "Ajuster mes préférences"

4. Restaurer les ressources (reset ou re-seed)

---

## Test 7: Navigation

**Objectif:** Vérifier que "Mon plan" est accessible partout.

### Étapes:
1. **Header:**
   - Vérifier que "Mon plan" est visible dans le header
   - Cliquer dessus → redirection vers `/plan`

2. **Footer:**
   - Scroll en bas de la page d'accueil
   - Vérifier que "Mon plan d'apprentissage" est dans la section "Navigation"
   - Cliquer dessus → redirection vers `/plan`

---

## Test 8: Accessibilité (a11y)

**Objectif:** Vérifier que tout est accessible.

### Étapes:
1. **Navigation clavier:**
   - Tab à travers l'onboarding
   - Vérifier que tous les boutons/cartes sont focusables
   - Vérifier que le focus est visible (outline)

2. **Contrastes:**
   - Utiliser un outil type [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Vérifier les badges (niveau, langue, domaines)
   - Vérifier le texte "Pourquoi ?"

3. **Screen reader (optionnel):**
   - Activer un lecteur d'écran (NVDA, JAWS, VoiceOver)
   - Naviguer dans `/onboarding` et `/plan`
   - Vérifier que les labels sont clairs

---

## Test 9: Performance

**Objectif:** Vérifier que tout est rapide.

### Métriques cibles:
- **Onboarding:** Chaque étape charge < 200ms
- **`/api/recommendations`:** Réponse < 300ms (rule-based)
- **`/plan` TTFB:** < 1.5s en dev

### Outil:
1. Ouvrir Chrome DevTools → Lighthouse
2. Lancer un audit sur `/plan`
3. **Résultat attendu:**
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 85

---

## Test 10: Redirections intelligentes

**Objectif:** Vérifier les redirections automatiques.

### Scénarios:
1. **Utilisateur pas connecté → `/plan`**
   - Résultat: `GuestRedirect` affiché

2. **Utilisateur connecté sans onboarding → `/plan`**
   - Résultat: Redirection vers `/onboarding`

3. **Utilisateur avec onboarding complet → `/onboarding`**
   - Résultat: Redirection vers `/plan`

4. **Après connexion avec `?redirect=/plan`**
   - Résultat: Redirection vers `/plan` après login

---

## 🐛 Bugs à surveiller

Si tu rencontres ces erreurs, voici comment les corriger:

### 1. "Column does not exist" (migration)
```bash
# Reset et ré-appliquer les migrations
npx supabase db reset
```

### 2. "User not found" (après onboarding)
- Vérifier que le user_id est bien passé à `/api/recommendations`
- Vérifier que le JWT est valide (refresh la page)

### 3. "Empty recommendations" (alors qu'il y a des ressources)
- Vérifier que les ressources ont `level`, `domains`, `lang` remplis
- Vérifier que le profil utilisateur a `goals`, `langs` remplis

### 4. "Quality score null"
- Le trigger `auto_compute_quality_score` ne s'est pas déclenché
- Relancer manuellement:
```sql
UPDATE resources SET quality_score = 0.5 WHERE quality_score IS NULL;
```

---

## ✅ Checklist finale

Une fois tous les tests passés:

- [ ] Onboarding complet (4 étapes) fonctionne
- [ ] Mode invité affiche `GuestRedirect`
- [ ] `/api/recommendations` retourne des résultats pertinents
- [ ] `/api/events` enregistre les interactions
- [ ] `/plan` affiche Start Pack + Mini-parcours + Alternatives
- [ ] Cartes avec badges + "Pourquoi ?" fonctionnent
- [ ] "Ajuster" et "Régénérer" fonctionnent
- [ ] Empty states affichés si 0 ressources
- [ ] Navigation header/footer à jour
- [ ] Accessibilité OK (tab, contrastes, labels)
- [ ] Performance OK (< 1.5s TTFB, < 300ms API)

---

## 🚀 Tu es prêt !

Si tous les tests passent, **Phase 1 est validée** et tu peux passer à Phase 2 ! 🎉

Pour toute question, consulte:
- `PLAN.md` → Roadmap complète
- `docs/PHASE1_COMPLETE.md` → Récapitulatif
- `docs/phase1-qa-checklist.md` → Checklist QA détaillée

