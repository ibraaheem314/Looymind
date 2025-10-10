'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, CheckCircle2, GraduationCap, ListChecks, RefreshCw } from 'lucide-react'

type LearningStep = {
  id: string
  title: string
  description: string
  resourceHref?: string
}

type LearningModule = {
  id: string
  title: string
  steps: LearningStep[]
}

type LearningPath = {
  id: string
  title: string
  level: 'debutant' | 'junior' | 'intermediaire'
  description: string
  modules: LearningModule[]
}

type ProgressState = Record<string, boolean>

const LOCAL_STORAGE_KEY = 'learningPathsProgress_v1'

const learningPathsSeed: LearningPath[] = [
  {
    id: 'debutant-foundations',
    title: "Parcours Débutant: Fondations IA",
    level: 'debutant',
    description:
      "Bases de Python, mathématiques essentielles et premières notions de machine learning.",
    modules: [
      {
        id: 'python-basics',
        title: 'Python pour la Data',
        steps: [
          {
            id: 'py-install',
            title: 'Installer Python et VS Code',
            description: 'Mettez en place votre environnement local pour coder.',
            resourceHref: '/resources',
          },
          {
            id: 'py-fundamentals',
            title: 'Bases de Python (types, listes, boucles)',
            description: 'Apprenez les fondamentaux du langage Python.',
            resourceHref: '/resources',
          },
          {
            id: 'py-pandas',
            title: 'Manipulation de données avec Pandas',
            description: 'Importer, nettoyer et transformer des datasets simples.',
            resourceHref: '/resources',
          },
        ],
      },
      {
        id: 'math-ml',
        title: 'Maths pour le ML (light)',
        steps: [
          {
            id: 'math-linear',
            title: 'Algèbre linéaire (vecteurs, matrices)',
            description: 'Intuition pratique sans formalisme excessif.',
            resourceHref: '/resources',
          },
          {
            id: 'math-proba',
            title: 'Probabilités de base',
            description: 'Variables aléatoires, distributions, moyenne/variance.',
            resourceHref: '/resources',
          },
        ],
      },
      {
        id: 'first-ml',
        title: 'Premier modèle ML',
        steps: [
          {
            id: 'ml-train-test',
            title: 'Split train/test et métriques',
            description: 'Comprendre la validation et les erreurs courantes.',
            resourceHref: '/resources',
          },
          {
            id: 'ml-linear-reg',
            title: 'Régression linéaire sur petit dataset',
            description: 'Aller de bout en bout: preprocessing → modèle → évaluation.',
            resourceHref: '/resources',
          },
        ],
      },
    ],
  },
  {
    id: 'ds-junior',
    title: 'Data Scientist Junior: Pratique encadrée',
    level: 'junior',
    description:
      "Du feature engineering aux modèles classiques (Tree-based), bonnes pratiques et portfolio.",
    modules: [
      {
        id: 'eda-feature',
        title: 'EDA & Feature Engineering',
        steps: [
          {
            id: 'eda',
            title: 'Exploration de données (EDA)',
            description: 'Visualiser, détecter outliers, comprendre la structure.',
            resourceHref: '/resources',
          },
          {
            id: 'feature-eng',
            title: 'Création de features',
            description: 'Encodage, normalisation, sélection de variables.',
            resourceHref: '/resources',
          },
        ],
      },
      {
        id: 'tree-models',
        title: 'Modèles Tree-Based',
        steps: [
          {
            id: 'rf',
            title: 'Random Forest & tuning basique',
            description: 'Hyperparamètres clés et évaluation robuste.',
            resourceHref: '/resources',
          },
          {
            id: 'gbt',
            title: 'Gradient Boosting (XGBoost/LightGBM)',
            description: 'Gagner en performance sans overfit.',
            resourceHref: '/resources',
          },
        ],
      },
      {
        id: 'portfolio',
        title: 'Portfolio & Bonnes pratiques',
        steps: [
          {
            id: 'repo-structure',
            title: 'Structurer un repo ML propre',
            description: 'Notebooks vs scripts, data/, README, reproductibilité.',
            resourceHref: '/resources',
          },
          {
            id: 'writeup',
            title: 'Écrire un article technique',
            description: 'Présenter problème, solution et résultats.',
            resourceHref: '/articles/create',
          },
        ],
      },
    ],
  },
  {
    id: 'nlp-fr',
    title: 'NLP Francophone: Textes & modèles',
    level: 'intermediaire',
    description:
      "Pipeline NLP, vectorisation, modèles classiques et initiation aux modèles pré-entraînés.",
    modules: [
      {
        id: 'nlp-basics',
        title: 'Pipeline NLP',
        steps: [
          {
            id: 'tokenization',
            title: 'Tokenisation et nettoyage de texte',
            description: 'Accent, ponctuation, normalisation.',
            resourceHref: '/resources',
          },
          {
            id: 'vectorize',
            title: 'TF-IDF et embeddings',
            description: 'Représenter le texte pour les modèles ML.',
            resourceHref: '/resources',
          },
        ],
      },
      {
        id: 'nlp-models',
        title: 'Modèles NLP',
        steps: [
          {
            id: 'classic-clf',
            title: 'Classification de texte (LogReg/SVM)',
            description: 'Modèles baselines solides et rapides.',
            resourceHref: '/resources',
          },
          {
            id: 'hf-intro',
            title: 'Intro Transformers (HuggingFace) — lecture',
            description: 'Comprendre les bases avant la pratique avancée.',
            resourceHref: '/resources',
          },
        ],
      },
    ],
  },
]

export default function LearningPathsPage() {
  const [progressByStepId, setProgressByStepId] = useState<ProgressState>({})

  // Load/save local progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (raw) {
        setProgressByStepId(JSON.parse(raw))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressByStepId))
    } catch {}
  }, [progressByStepId])

  const toggleStep = (stepId: string) => {
    setProgressByStepId(prev => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  const resetProgress = () => {
    setProgressByStepId({})
  }

  const overallStats = useMemo(() => {
    const steps = learningPathsSeed.flatMap(p => p.modules.flatMap(m => m.steps))
    const total = steps.length
    const done = steps.filter(s => progressByStepId[s.id]).length
    const percent = total === 0 ? 0 : Math.round((done / total) * 100)
    return { total, done, percent }
  }, [progressByStepId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="flex flex-col gap-4 items-start">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5">Parcours d’apprentissage</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Des chemins guidés pour apprendre l’IA
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Suivez un parcours étape par étape, cochez vos progrès, et accédez aux ressources recommandées.
            </p>

            <div className="flex items-center gap-2">
              <Link href="/resources" className="inline-flex">
                <Button size="sm" variant="outline" className="rounded-full px-4">Bibliothèque</Button>
              </Link>
              <Link href="/resources/paths" className="inline-flex">
                <Button size="sm" className="rounded-full px-4 bg-[#2d5986] hover:bg-[#1e3a5f] text-white">Parcours</Button>
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                <span>
                  Progression: <strong className="text-slate-900">{overallStats.done}</strong> / {overallStats.total} ({overallStats.percent}%)
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={resetProgress}>
                <RefreshCw className="h-4 w-4 mr-2" /> Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {learningPathsSeed.map((path) => {
            const pathDone = path.modules
              .flatMap(m => m.steps)
              .every(step => progressByStepId[step.id])

            return (
              <Card key={path.id} className="bg-white border-2 border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-slate-100 text-slate-700 border-0 text-xs">
                          {path.level === 'debutant' ? 'Débutant' : path.level === 'junior' ? 'Junior' : 'Intermédiaire'}
                        </Badge>
                        {pathDone && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                          </span>
                        )}
                      </div>
                      <h2 className="font-bold text-lg text-slate-900">{path.title}</h2>
                    </div>
                    <GraduationCap className="h-6 w-6 text-cyan-600" />
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{path.description}</p>

                  <div className="space-y-4">
                    {path.modules.map((mod) => (
                      <div key={mod.id} className="border border-slate-200 rounded-lg">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <ListChecks className="h-4 w-4 text-cyan-600" />
                          <h3 className="text-sm font-semibold text-slate-900">{mod.title}</h3>
                        </div>
                        <div className="p-4 space-y-3">
                          {mod.steps.map((step) => (
                            <div key={step.id} className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                                checked={!!progressByStepId[step.id]}
                                onChange={() => toggleStep(step.id)}
                                aria-label={`Marquer comme terminé: ${step.title}`}
                              />
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-medium text-slate-900">{step.title}</span>
                                  {step.resourceHref && (
                                    <Link href={step.resourceHref} className="inline-flex items-center gap-1 text-xs text-cyan-700 hover:text-cyan-900">
                                      <BookOpen className="h-3.5 w-3.5" /> Ressource
                                    </Link>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-[#2d5986] hover:bg-[#1e3a5f] text-white">
            <Link href="/resources">
              Parcourir les ressources recommandées
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


