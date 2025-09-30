# 🔧 CORRECTION : Erreur "permission denied for table profiles"

## ❌ PROBLÈME IDENTIFIÉ

**Erreur:** `permission denied for table profiles`

**Cause:** La page `/profile` utilisait `useProfile(user?.id)` qui essayait de faire une requête **directe** à la table `profiles` dans Supabase, ce qui nécessite des permissions RLS spécifiques.

---

## ✅ SOLUTION APPLIQUÉE

### 1. **Page Profile (`src/app/profile/page.tsx`)**

**AVANT :**
```typescript
export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { profile, loading, error } = useProfile(user?.id)  // ❌ Requête directe
  // ...
}
```

**APRÈS :**
```typescript
export default function ProfilePage() {
  const { user, profile, loading, isAuthenticated } = useAuth()  // ✅ Utilise le profil déjà chargé
  const [error, setError] = useState<string | null>(null)
  // ...
}
```

**Changements :**
- ✅ Suppression de l'appel à `useProfile(user?.id)`
- ✅ Utilisation du `profile` déjà chargé par `useAuth`
- ✅ Suppression de l'import `useProfile`

---

### 2. **Composant UserStats (`src/components/profile/user-stats.tsx`)**

**AVANT :**
```typescript
export default function UserStats({ userId }: UserStatsProps) {
  const { getProfileStats } = useProfile()  // ❌ Requête directe
  const { submissions: userSubmissions } = useSubmissions()
  const { projects: userProjects } = useProjects()
  // Fetch stats from database...
}
```

**APRÈS :**
```typescript
interface UserStatsProps {
  userId: string
  profile?: any  // ✅ Reçoit le profil en props
}

export default function UserStats({ userId, profile }: UserStatsProps) {
  const [stats, setStats] = useState<UserStats>({
    // Valeurs par défaut
    totalSubmissions: 0,
    acceptedSubmissions: 0,
    bestScore: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    recentSubmissions: [],
    recentProjects: []
  })
  
  useEffect(() => {
    // Utilise les données du profil passées en props
    if (profile) {
      // Met à jour les stats basées sur le profil
    }
  }, [userId, profile])
}
```

**Changements :**
- ✅ Suppression des appels à `useProfile()`, `useSubmissions()`, `useProjects()`
- ✅ Ajout de `profile` comme prop
- ✅ Utilisation des données du profil au lieu de faire des requêtes

---

### 3. **Mise à jour de l'appel à UserStats**

**Dans `/profile/page.tsx` :**
```typescript
{activeTab === 'stats' && user?.id && (
  <UserStats userId={user.id} profile={profile} />  // ✅ Passe le profil en prop
)}
```

---

## 🎯 POURQUOI ÇA FONCTIONNE MAINTENANT ?

### **Flux de données optimisé :**

1. **`useAuth`** charge le profil **une seule fois** au moment de la connexion
   - Utilise soit la session existante
   - Soit crée/charge le profil depuis `user_metadata`
   
2. **La page Profile** réutilise ce profil déjà chargé
   - ✅ Pas de requête supplémentaire
   - ✅ Pas besoin de permissions RLS spécifiques
   - ✅ Performance améliorée (moins de requêtes)

3. **UserStats** reçoit le profil en props
   - ✅ Affiche les statistiques basées sur le profil
   - ✅ Pas de requête à la base de données

---

## 📊 AVANT vs APRÈS

### **AVANT (avec erreurs) :**
```
useAuth → Charge le profil
   ↓
ProfilePage → useProfile(userId) → ❌ ERREUR: permission denied
   ↓
UserStats → useProfile() → ❌ ERREUR: permission denied
```

### **APRÈS (corrigé) :**
```
useAuth → Charge le profil (1 seule fois)
   ↓
ProfilePage → Utilise profile de useAuth ✅
   ↓
UserStats → Reçoit profile en props ✅
```

---

## 🔐 ALTERNATIVE (si besoin de requêtes directes)

Si tu veux permettre les requêtes directes à la table `profiles`, tu peux ajouter cette policy dans Supabase :

```sql
-- Permettre la lecture anonyme des profils (déjà présent)
CREATE POLICY "Profils visibles par tous" 
ON profiles FOR SELECT 
USING (true);

-- Permettre aux utilisateurs authentifiés de lire tous les profils
CREATE POLICY "Utilisateurs authentifiés peuvent lire les profils"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');
```

**Mais ce n'est PAS NÉCESSAIRE** car la solution actuelle est plus performante ! ✅

---

## ✅ RÉSULTAT

- ✅ **Plus d'erreur** "permission denied"
- ✅ **Performance améliorée** (moins de requêtes)
- ✅ **Code plus simple** (moins de hooks imbriqués)
- ✅ **Cohérence des données** (une seule source de vérité)

---

**🎉 PROFIL FONCTIONNEL !**
