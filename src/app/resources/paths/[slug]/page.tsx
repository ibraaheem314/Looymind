'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, Clock, Target, CheckCircle2, Circle, 
  BookOpen, PlayCircle, FileText, Code, Sparkles
} from 'lucide-react'
import Link from 'next/link'

// Données des parcours (à terme, ça viendra de Supabase)
const TRACKS = {
  'debutant-ia-ml': {
    id: 'debutant-ia-ml',
    title: 'Débuter en IA/ML',
    emoji: '🌱',
    level: 'Beginner',
    description: 'Apprends les fondamentaux de l\'intelligence artificielle et du machine learning de zéro.',
    duration: '8-12 semaines',
    objectives: [
      'Comprendre les concepts de base de l\'IA et du ML',
      'Maîtriser Python pour la data science',
      'Créer tes premiers modèles de machine learning',
      'Réaliser un projet portfolio complet'
    ],
    modules: [
      {
        id: 1,
        title: 'Introduction à l\'IA et au ML',
        duration: '1 semaine',
        lessons: [
          { title: 'Qu\'est-ce que l\'IA ?', type: 'video', duration: 15 },
          { title: 'ML vs DL vs IA : différences', type: 'article', duration: 10 },
          { title: 'Applications concrètes', type: 'video', duration: 20 },
          { title: 'Quiz de compréhension', type: 'quiz', duration: 10 }
        ]
      },
      {
        id: 2,
        title: 'Python pour la Data Science',
        duration: '3 semaines',
        lessons: [
          { title: 'Bases de Python', type: 'video', duration: 45 },
          { title: 'NumPy : calcul numérique', type: 'code', duration: 60 },
          { title: 'Pandas : manipulation de données', type: 'code', duration: 90 },
          { title: 'Matplotlib & Seaborn : visualisation', type: 'code', duration: 60 },
          { title: 'Projet : Analyser un dataset', type: 'project', duration: 180 }
        ]
      },
      {
        id: 3,
        title: 'Algorithmes de Machine Learning',
        duration: '3 semaines',
        lessons: [
          { title: 'Régression linéaire', type: 'video', duration: 30 },
          { title: 'Classification avec k-NN', type: 'code', duration: 45 },
          { title: 'Arbres de décision', type: 'code', duration: 45 },
          { title: 'Évaluation des modèles', type: 'article', duration: 30 },
          { title: 'Projet : Prédiction de prix', type: 'project', duration: 240 }
        ]
      },
      {
        id: 4,
        title: 'Projet Final',
        duration: '2 semaines',
        lessons: [
          { title: 'Choix du projet', type: 'article', duration: 30 },
          { title: 'Collecte et nettoyage des données', type: 'code', duration: 180 },
          { title: 'Entraînement et optimisation', type: 'code', duration: 240 },
          { title: 'Présentation et déploiement', type: 'project', duration: 180 }
        ]
      }
    ]
  },
  'data-scientist-junior': {
    id: 'data-scientist-junior',
    title: 'Data Scientist Junior',
    emoji: '🚀',
    level: 'Intermediate',
    description: 'Deviens data scientist avec des compétences en analyse de données, modélisation prédictive et visualisation avancée.',
    duration: '12-16 semaines',
    objectives: [
      'Maîtriser Pandas et Scikit-learn',
      'Créer des modèles prédictifs robustes',
      'Visualiser et communiquer les insights',
      'Construire un portfolio professionnel'
    ],
    modules: [
      {
        id: 1,
        title: 'Data Wrangling Avancé',
        duration: '2 semaines',
        lessons: [
          { title: 'Nettoyage de données réelles', type: 'code', duration: 90 },
          { title: 'Feature Engineering', type: 'video', duration: 45 },
          { title: 'Gestion des données manquantes', type: 'code', duration: 60 },
          { title: 'Projet : Pipeline ETL', type: 'project', duration: 180 }
        ]
      },
      {
        id: 2,
        title: 'Modèles Supervisés',
        duration: '4 semaines',
        lessons: [
          { title: 'Régression avancée (Ridge, Lasso)', type: 'code', duration: 90 },
          { title: 'Classification (SVM, Random Forest)', type: 'code', duration: 120 },
          { title: 'Gradient Boosting (XGBoost, LightGBM)', type: 'code', duration: 120 },
          { title: 'Hyperparameter tuning', type: 'code', duration: 90 },
          { title: 'Projet : Prédiction de churn', type: 'project', duration: 300 }
        ]
      },
      {
        id: 3,
        title: 'Modèles Non-Supervisés',
        duration: '3 semaines',
        lessons: [
          { title: 'Clustering (K-Means, DBSCAN)', type: 'code', duration: 90 },
          { title: 'Réduction de dimensionnalité (PCA, t-SNE)', type: 'code', duration: 90 },
          { title: 'Détection d\'anomalies', type: 'code', duration: 60 },
          { title: 'Projet : Segmentation clients', type: 'project', duration: 240 }
        ]
      },
      {
        id: 4,
        title: 'Visualisation & Communication',
        duration: '2 semaines',
        lessons: [
          { title: 'Plotly & dashboards interactifs', type: 'code', duration: 90 },
          { title: 'Storytelling avec les données', type: 'video', duration: 45 },
          { title: 'Présenter à des non-techniques', type: 'article', duration: 30 },
          { title: 'Projet : Dashboard analytique', type: 'project', duration: 240 }
        ]
      },
      {
        id: 5,
        title: 'Projet Portfolio',
        duration: '3 semaines',
        lessons: [
          { title: 'Définir un problème métier', type: 'article', duration: 60 },
          { title: 'Analyse exploratoire complète', type: 'code', duration: 180 },
          { title: 'Modélisation et optimisation', type: 'code', duration: 300 },
          { title: 'Déploiement et présentation', type: 'project', duration: 240 }
        ]
      }
    ]
  },
  'nlp-llms': {
    id: 'nlp-llms',
    title: 'NLP & LLMs',
    emoji: '🤖',
    level: 'Advanced',
    description: 'Maîtrise le traitement du langage naturel et les modèles de langage avancés (GPT, BERT, etc.).',
    duration: '10-14 semaines',
    objectives: [
      'Comprendre l\'architecture des Transformers',
      'Fine-tuner des modèles pré-entraînés',
      'Créer des applications NLP avancées',
      'Déployer des LLMs en production'
    ],
    modules: [
      {
        id: 1,
        title: 'Fondamentaux du NLP',
        duration: '2 semaines',
        lessons: [
          { title: 'Tokenization & preprocessing', type: 'code', duration: 60 },
          { title: 'Word embeddings (Word2Vec, GloVe)', type: 'video', duration: 45 },
          { title: 'RNN et LSTM', type: 'code', duration: 90 },
          { title: 'Projet : Classification de textes', type: 'project', duration: 180 }
        ]
      },
      {
        id: 2,
        title: 'Transformers & Attention',
        duration: '3 semaines',
        lessons: [
          { title: 'Architecture Transformer', type: 'video', duration: 60 },
          { title: 'Self-attention mechanism', type: 'code', duration: 90 },
          { title: 'BERT : comprendre et utiliser', type: 'code', duration: 120 },
          { title: 'GPT : génération de texte', type: 'code', duration: 120 },
          { title: 'Projet : Chatbot simple', type: 'project', duration: 240 }
        ]
      },
      {
        id: 3,
        title: 'Fine-tuning de LLMs',
        duration: '3 semaines',
        lessons: [
          { title: 'Transfer learning pour NLP', type: 'video', duration: 45 },
          { title: 'Fine-tuner BERT sur une tâche', type: 'code', duration: 150 },
          { title: 'LoRA et PEFT', type: 'code', duration: 120 },
          { title: 'Évaluation de modèles NLP', type: 'article', duration: 45 },
          { title: 'Projet : Analyse de sentiment', type: 'project', duration: 300 }
        ]
      },
      {
        id: 4,
        title: 'LLMs en Production',
        duration: '2 semaines',
        lessons: [
          { title: 'Optimisation et quantization', type: 'code', duration: 90 },
          { title: 'API avec FastAPI', type: 'code', duration: 120 },
          { title: 'Déploiement cloud (Hugging Face, AWS)', type: 'code', duration: 120 },
          { title: 'Monitoring et A/B testing', type: 'article', duration: 60 }
        ]
      },
      {
        id: 5,
        title: 'Projet Avancé',
        duration: '3 semaines',
        lessons: [
          { title: 'Concevoir une application LLM', type: 'article', duration: 90 },
          { title: 'RAG (Retrieval-Augmented Generation)', type: 'code', duration: 180 },
          { title: 'Fine-tuning et optimisation', type: 'code', duration: 300 },
          { title: 'Déploiement et présentation', type: 'project', duration: 240 }
        ]
      }
    ]
  }
}

const LESSON_TYPE_CONFIG = {
  video: { icon: PlayCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' },
  article: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300' },
  code: { icon: Code, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' },
  quiz: { icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-300' },
  project: { icon: Sparkles, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300' }
}

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const track = TRACKS[slug as keyof typeof TRACKS]
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    // Charger la progression depuis localStorage
    const saved = localStorage.getItem(`track-progress-${slug}`)
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
    }
  }, [slug])

  if (!track) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Parcours introuvable</h2>
            <p className="text-slate-600 mb-4">Ce parcours n'existe pas ou a été supprimé.</p>
            <Button asChild>
              <Link href="/resources">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux ressources
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalLessons = track.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)
  const completedCount = completedLessons.length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const toggleLesson = (moduleId: number, lessonTitle: string) => {
    const lessonId = `${moduleId}-${lessonTitle}`
    const newCompleted = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId]
    
    setCompletedLessons(newCompleted)
    localStorage.setItem(`track-progress-${slug}`, JSON.stringify(newCompleted))
  }

  const isLessonCompleted = (moduleId: number, lessonTitle: string) => {
    return completedLessons.includes(`${moduleId}-${lessonTitle}`)
  }

  const levelColors = {
    Beginner: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    Intermediate: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    Advanced: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }
  }

  const levelColor = levelColors[track.level as keyof typeof levelColors]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${levelColor.bg} border-b-2 ${levelColor.border}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{track.emoji}</div>
            <div className="flex-1">
              <Badge className={`${levelColor.bg} ${levelColor.text} border-0 mb-2`}>
                {track.level}
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{track.title}</h1>
              <p className="text-slate-700 text-lg mb-4">{track.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{track.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{track.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{totalLessons} leçons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Ta progression</span>
              <span className="text-sm text-slate-600">{completedCount} / {totalLessons} leçons</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border-2 border-slate-200">
              <div 
                className={`h-full ${track.level === 'Beginner' ? 'bg-green-600' : track.level === 'Intermediate' ? 'bg-blue-600' : 'bg-purple-600'} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{progress}% complété</p>
          </div>

          {/* Objectives */}
          <Card className="border-2 border-slate-200 bg-white">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3">🎯 Objectifs du parcours</h3>
              <ul className="space-y-2">
                {track.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className={levelColor.text}>✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {track.modules.map((module) => (
            <Card key={module.id} className="border-2 border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${levelColor.bg} ${levelColor.text} flex items-center justify-center font-bold text-lg`}>
                    {module.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{module.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {module.duration}
                      </span>
                      <span>•</span>
                      <span>{module.lessons.length} leçons</span>
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  {module.lessons.map((lesson, idx) => {
                    const completed = isLessonCompleted(module.id, lesson.title)
                    const typeConfig = LESSON_TYPE_CONFIG[lesson.type as keyof typeof LESSON_TYPE_CONFIG]
                    const Icon = typeConfig.icon

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleLesson(module.id, lesson.title)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          completed 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 ${completed ? 'text-green-600' : 'text-slate-400'}`}>
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5" />
                            )}
                          </div>
                          
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center`}>
                            <Icon className={`h-4 w-4 ${typeConfig.color}`} />
                          </div>

                          <div className="flex-1">
                            <h4 className={`font-medium ${completed ? 'text-slate-700' : 'text-slate-900'}`}>
                              {lesson.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{lesson.duration} min</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Final */}
        <Card className={`mt-8 border-2 ${levelColor.border} ${levelColor.bg}`}>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Prêt à commencer ?
            </h3>
            <p className="text-slate-700 mb-4">
              {progress === 0 
                ? "Lance-toi dans ce parcours et développe tes compétences !"
                : progress === 100
                ? "🎉 Félicitations ! Tu as complété ce parcours !"
                : "Continue ton parcours, tu es sur la bonne voie !"
              }
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild className="bg-[#2d5986] hover:bg-[#1e3a5f] text-white">
                <Link href="/resources">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explorer les ressources
                </Link>
              </Button>
              {progress > 0 && progress < 100 && (
                <Button variant="outline" onClick={() => {
                  setCompletedLessons([])
                  localStorage.removeItem(`track-progress-${slug}`)
                }}>
                  Réinitialiser la progression
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

