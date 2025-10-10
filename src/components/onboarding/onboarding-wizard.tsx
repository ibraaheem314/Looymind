'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, Check, Target, GraduationCap, Clock, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

type OnboardingData = {
  goals: string[]
  level: 'Beginner' | 'Intermediate' | 'Advanced' | null
  time_per_week: number | null
  langs: string[]
}

type OnboardingWizardProps = {
  userId?: string
  onComplete?: (data: OnboardingData) => void
  asModal?: boolean
}

const GOALS_OPTIONS = [
  { id: 'bases-ia', label: 'Comprendre les bases de l\'IA', icon: '🎯' },
  { id: 'ml-engineer', label: 'Devenir ML Engineer', icon: '🚀' },
  { id: 'llms', label: 'LLMs / IA générative', icon: '🤖' },
  { id: 'data-analytics', label: 'Data & Analytics', icon: '📊' },
  { id: 'mlops', label: 'MLOps / Déploiement', icon: '⚙️' },
  { id: 'vision', label: 'Computer Vision', icon: '👁️' },
  { id: 'nlp', label: 'NLP / Traitement du langage', icon: '💬' },
  { id: 'not-sure', label: 'Je ne sais pas encore', icon: '🤔' }
]

const LEVEL_OPTIONS = [
  { 
    id: 'Beginner', 
    label: 'Débutant', 
    description: 'Je débute en IA/ML',
    icon: '🌱'
  },
  { 
    id: 'Intermediate', 
    label: 'Intermédiaire', 
    description: 'J\'ai des bases en programmation/stats',
    icon: '🌿'
  },
  { 
    id: 'Advanced', 
    label: 'Avancé', 
    description: 'Je maîtrise déjà certains concepts',
    icon: '🌳'
  }
]

const TIME_OPTIONS = [
  { value: 2, label: '2h / semaine', description: 'Découverte' },
  { value: 5, label: '5h / semaine', description: 'Régulier' },
  { value: 10, label: '10h+ / semaine', description: 'Intensif' }
]

const LANG_OPTIONS = [
  { id: 'FR', label: 'Français', flag: '🇫🇷' },
  { id: 'EN', label: 'Anglais', flag: '🇬🇧' }
]

export function OnboardingWizard({ userId, onComplete, asModal = false }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [data, setData] = useState<OnboardingData>({
    goals: [],
    level: null,
    time_per_week: null,
    langs: ['FR'] // Par défaut FR
  })

  const toggleGoal = (goalId: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const toggleLang = (langId: string) => {
    setData(prev => ({
      ...prev,
      langs: prev.langs.includes(langId)
        ? prev.langs.filter(l => l !== langId)
        : [...prev.langs, langId]
    }))
  }

  const canGoNext = () => {
    if (step === 1) return data.goals.length > 0
    if (step === 2) return data.level !== null
    if (step === 3) return data.time_per_week !== null
    if (step === 4) return data.langs.length > 0
    return false
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Si userId fourni, sauvegarder en DB
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({
            level: data.level,
            goals: data.goals,
            langs: data.langs,
            time_per_week: data.time_per_week
          })
          .eq('id', userId)

        if (error) {
          console.error('Error saving onboarding:', error)
          alert('Erreur lors de la sauvegarde. Veuillez réessayer.')
          setLoading(false)
          return
        }
      }

      // Callback
      if (onComplete) {
        onComplete(data)
      } else {
        // Redirection par défaut vers les ressources (plan intégré)
        router.push('/resources')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 4) * 100

  return (
    <div className={asModal ? '' : 'min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 py-12'}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Étape {step} sur 4</span>
            <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Objectif */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
                    <Target className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Quel est ton objectif principal ?
                  </h2>
                  <p className="text-slate-600">
                    Sélectionne un ou plusieurs objectifs (tu pourras ajuster plus tard)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS_OPTIONS.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        data.goals.includes(goal.id)
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="text-sm font-medium text-slate-900">{goal.label}</span>
                        {data.goals.includes(goal.id) && (
                          <Check className="h-5 w-5 text-cyan-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Niveau */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
                    <GraduationCap className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Ton niveau aujourd'hui ?
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Sois honnête : ça nous aide à t'éviter les contenus trop durs ou trop simples 😊
                  </p>
                </div>

                <div className="space-y-3">
                  {LEVEL_OPTIONS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setData(prev => ({ ...prev, level: level.id as any }))}
                      className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                        data.level === level.id
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{level.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{level.label}</div>
                          <div className="text-sm text-slate-600">{level.description}</div>
                        </div>
                        {data.level === level.id && (
                          <Check className="h-6 w-6 text-cyan-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Temps dispo */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
                    <Clock className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Combien de temps par semaine ?
                  </h2>
                  <p className="text-slate-600">
                    On adaptera la durée des ressources recommandées
                  </p>
                </div>

                <div className="space-y-3">
                  {TIME_OPTIONS.map(time => (
                    <button
                      key={time.value}
                      onClick={() => setData(prev => ({ ...prev, time_per_week: time.value }))}
                      className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                        data.time_per_week === time.value
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">{time.label}</div>
                          <div className="text-sm text-slate-600">{time.description}</div>
                        </div>
                        {data.time_per_week === time.value && (
                          <Check className="h-6 w-6 text-cyan-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Langue */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-2xl mb-4">
                    <Globe className="h-8 w-8 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Tu préfères apprendre en...
                  </h2>
                  <p className="text-slate-600">
                    Tu peux choisir les deux si tu es à l'aise
                  </p>
                </div>

                <div className="space-y-3">
                  {LANG_OPTIONS.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => toggleLang(lang.id)}
                      className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                        data.langs.includes(lang.id)
                          ? 'border-cyan-500 bg-cyan-50 shadow-md'
                          : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{lang.flag}</span>
                        <span className="font-semibold text-slate-900 flex-1">{lang.label}</span>
                        {data.langs.includes(lang.id) && (
                          <Check className="h-6 w-6 text-cyan-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Conseil</strong> : Même si tu choisis Français, certaines ressources de qualité peuvent être en anglais.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={handleNext}
                disabled={!canGoNext() || loading}
                className="bg-[#2d5986] hover:bg-[#1e3a5f] text-white"
              >
                {loading ? (
                  'Enregistrement...'
                ) : step === 4 ? (
                  <>
                    Voir mon plan
                    <Check className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust footer */}
        {!asModal && (
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>🔒 Tes données restent privées. Tu peux modifier tes préférences à tout moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

