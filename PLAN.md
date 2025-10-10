# 📌 PLAN.md — Palanteer (MVP Éducation)

Dernière mise à jour: 2025-10-10

## 0) Vision courte
- Construire un copilote d’apprentissage IA: curation enrichie, recommandations simples, parcours guidés, boucle de feedback.
- Focus unique: Ressources + Articles + Communauté (Compétitions/Projets archivés).

## 1) Principes
- Livrer petit, utile, vite; itérer.
- D’abord règles simples → ensuite embeddings/LLM si valeur prouvée.
- Transparence: toujours afficher “Pourquoi cette reco ?”.
- Privacy: opt‑in, invité possible, PII minimales.

## 2) État actuel (fait)
- Navigation simplifiée (Header/Footer) → Accueil, Ressources, Mon plan, Articles, Talents.
- Homepage recentrée éducation (CTAs alignés).
- Parcours v1: `/resources/paths` (3 tracks seedés + progression locale).
- Intégration Ressources ↔ Parcours (onglets Bibliothèque/Parcours).
- **Phase 1 COMPLÈTE** ✅: Onboarding, Recos rule-based, Plan d'apprentissage, Tracking, Empty states.
- Docs à jour: README, RECENTRAGE_MVP_EDUCATION.md, RAPPORT_RECENTRAGE_FINAL.md, _archive/*, phase1-qa-checklist.md.

---

## 3) Roadmap exécutable

### Phase 1 — MVP+ (5–7 jours)
Objectif: recos “rule‑based” + plan d’apprentissage actionnable.

Checklist
- [x] Migrations DB (Phase 1 légère) ✅
  - resources: level, domains[], prerequisites[], duration_minutes, lang, published_at, quality_score
  - interactions: table (user_id, resource_id, event, value, created_at)
- [x] Onboarding 4 questions → `profiles` (level, goals[], langs[], time_per_week) ✅
- [x] Endpoint GET `/api/recommendations` (rule‑based) ✅
  - filtres {domains/level/lang}, tri {récence, quality}
  - réponse: items[] + `why` (raison simple)
- [x] Page "Ton plan d'apprentissage" ✅
  - Start Pack (3), Mini‑parcours (6), Alternatives (3)
  - "Ajuster" (ré‑ouvrir onboarding), "Régénérer" (exploration légère)
- [x] Tracking minimal POST `/api/events` → `interactions` ✅
- [x] Carte ressource unifiée (badges + tooltip "Pourquoi ?") ✅
- [x] Empty states + mode invité (bannière douce "créer un compte") ✅
- [x] QA: lints, a11y, perfs de base ✅

Critères d’acceptation
- Recos servies < 300 ms côté serveur (rule‑based)
- 1er rendu plan TTFB ≤ 1.5s (dev)
- Onboarding ≤ 90s; données persistées

Livrables
- SQL migrations (Phase 1)
- Routes: `/api/recommendations`, `/api/events`
- UI: OnboardingWizard, PlanPage, ResourceCard

### Phase 2 — Enrichissement + Recos avancées (2–3 semaines)
Objectif: qualité, dédup, pertinence; préparer le scale.

Checklist
- [ ] Script d’enrichissement (LLM optionnel) + upsert resources
- [ ] Dédup (URL + cosine > 0.92)
- [ ] Heuristiques `quality_score` (fraîcheur, FR, source fiable, usage)
- [ ] Cron quotidien (ingest + recalcul qualité)
- [ ] Embeddings + pgvector (si >150–200 ressources)
- [ ] `profile_embedding` (cold via onboarding, warm via interactions)
- [ ] Endpoint reco: Top‑K vectoriel + rerank (quality/recency/difficulty) + MMR + `why` explicable
- [ ] Mini‑dashboard KPIs (CTR, completion, top domaines)

Acceptation
- Top‑10 diversifié (MMR) avec `why` sur chaque item
- Dédup validée sur cas réels

### Phase 3 — Pilot test (1–2 semaines)
Objectif: valider l’utilité (30–50 testeurs).

Checklist
- [ ] Recruter testeurs (universités/communauté locale)
- [ ] Sondage bref (utilité des recos 1–5)
- [ ] Itérations rapides UX/contenu

KPIs de succès
- ≥ 60% cliquent ≥ 1 ressource jour 1
- ≥ 25% terminent ≥ 1 ressource semaine 1
- Satisfaction ≥ 4/5

---

## 4) Découpage technique (Phase 1)
- SQL: colonnes `resources` ci‑dessus; table `interactions`.
- API: GET `/api/recommendations` (filters+tri); POST `/api/events` (log usage).
- Front: OnboardingWizard; PlanPage; ResourceCard (badges + “Pourquoi ?”).

## 5) Contenu & curation (en parallèle)
- [ ] 50+ ressources FR/EN seed
- [ ] Normaliser metadata (niveau, domaines, durée, langue)
- [ ] Parcours: +2 tracks (CV, MLOps)

## 6) Qualité, sécurité, perfs
- TS strict, lints, a11y; pages rapides.
- RLS Supabase; PII minimales; opt‑in personnalisation.
- Pagination catalogue; index (published_at, lang, level).

## 7) Gouvernance & rituel
- Mettre à jour PLAN.md à chaque tâche (cocher, dater).
- Revue hebdo (30 min) pour prioriser la phase suivante.
- Ne pas démarrer Phase 2 avant DoD Phase 1 atteint.

## 8) Backlog (idées)
- Quiz de niveau → choix track auto
- Rappels hebdo “reprendre où tu t’es arrêté”
- Import bookmarks GitHub/YouTube (curation assistée)
- Mode offline (PWA)

## 9) Journal de bord
- **2025‑10‑10 (AM)**: Recentre terminé; Parcours v1 live; onglets Ressources/Parcours; docs à jour.
- **2025‑10‑10 (PM - 1)**: Phase 1 COMPLÈTE ✅
  - Migrations: `resources` (level, domains, prerequisites, duration_minutes, lang, published_at, quality_score) + `profiles` (level, goals, langs, time_per_week) + table `interactions` + view `resources_with_metrics`
  - Onboarding: wizard 4 étapes (goals, level, time, langs) avec validation et design moderne
  - API: `/api/recommendations` (GET, rule-based, scoring + MMR) + `/api/events` (POST, tracking interactions)
  - UI: Page `/plan` (Start Pack, Mini-parcours, Alternatives) + `ResourceCard` avec badges + tooltip "Pourquoi"
  - UX: Empty states, mode invité, redirections intelligentes
  - QA: 0 erreurs lints, a11y OK, docs phase1-qa-checklist.md
- **2025‑10‑10 (PM - 2)**: Refonte UX `/resources` ✅
  - Architecture hiérarchique inspirée de Coursera/edX/DataCamp
  - Section "Recommandé pour toi" (6 recos personnalisées) intégrée EN HAUT
  - Section "Parcours guidés" mise en avant (3 tracks: Débutant, Intermédiaire, Avancé)
  - Bibliothèque complète avec filtres (en bas)
  - CTA élégant si user invité ou pas d'onboarding
  - Page `/plan` standalone archivée → tout centralisé sur `/resources`
  - Navigation simplifiée (retiré "Mon plan" du header/footer)
  - Design system cohérent (Cyan/Recos, Vert/Parcours, Slate/Bibliothèque)
  - Doc: `docs/REFONTE_RESOURCES_UX.md`
  - Prêt pour Phase 2

## 10) Définitions
- Start Pack: 3 ressources pour démarrer vite.
- Mini‑parcours: 5–6 étapes triées par prérequis.
- Why: raison courte expliquant la reco.
