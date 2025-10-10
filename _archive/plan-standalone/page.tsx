'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, Clock, Globe, Loader2, Settings, RefreshCw, 
  ArrowRight, CheckCircle2, Target, Sparkles, LogIn
} from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/empty-state'

type RecommendationItem = {
  id: string
  title: string
  url: string
  description: string | null
  level: string | null
  domains: string[]
  duration_minutes: number | null
  lang: string | null
  published_at: string | null
  quality_score: number
  source: string | null
  why: string
}

export default function PlanPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Mode invité géré par le render
      } else if (!profile?.level || !profile?.goals || profile.goals.length === 0) {
        // Pas encore complété l'onboarding
        router.push('/onboarding')
      } else {
        fetchRecommendations()
      }
    }
  }, [user, profile, authLoading, router])

  const fetchRecommendations = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/recommendations?user_id=${user.id}&limit=10`)
      if (!res.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const data = await res.json()
      setRecommendations(data.items || [])
    } catch (err: any) {
      console.error('Error fetching recommendations:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    )
  }

  // Mode invité
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full border-2 border-slate-200 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Ton plan d'apprentissage personnalisé
              </h1>
              <p className="text-lg text-slate-600">
                Connecte-toi pour obtenir des recommandations adaptées à ton niveau et tes objectifs.
              </p>
            </div>

            <div className="mb-8 p-6 bg-cyan-50/50 border-2 border-cyan-200 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-4 text-center">
                ✨ Ce que tu vas obtenir :
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-cyan-600 mt-0.5">✓</span>
                  <span>Recommandations personnalisées selon tes objectifs</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-cyan-600 mt-0.5">✓</span>
                  <span>Parcours d'apprentissage adapté à ton niveau</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-cyan-600 mt-0.5">✓</span>
                  <span>Suivi de ta progression</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="text-cyan-600 mt-0.5">✓</span>
                  <span>Ressources filtrées par langue et durée</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 mb-6">
              <Button asChild className="w-full bg-[#2d5986] hover:bg-[#1e3a5f] text-white h-12 text-base">
                <Link href="/auth/login?redirect=/plan">
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 text-base">
                <Link href="/auth/register?redirect=/plan">
                  <LogIn className="h-5 w-5 mr-2" />
                  Créer un compte
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-slate-500">
              <p>🔒 Gratuit · Sans engagement · Données privées</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const startPack = recommendations.slice(0, 3)
  const miniPath = recommendations.slice(3, 9)
  const alternatives = recommendations.slice(9, 12)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5 mb-3">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Ton plan d'apprentissage
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Bienvenue {profile?.display_name || 'à toi'} 👋
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Voici tes recommandations personnalisées pour progresser en IA
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/onboarding')}
                className="hidden sm:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                Ajuster
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecommendations}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Régénérer
              </Button>
            </div>
          </div>

          {/* Résumé profil */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="outline" className="bg-white">
              <Target className="h-3.5 w-3.5 mr-1.5" />
              Niveau : {profile?.level}
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              Langue : {profile?.langs?.join(', ') || 'FR'}
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {profile?.time_per_week}h / sem
            </Badge>
            {profile?.goals && profile.goals.length > 0 && (
              <Badge variant="outline" className="bg-white">
                Objectifs : {profile.goals.slice(0, 2).join(', ')}
                {profile.goals.length > 2 && ` +${profile.goals.length - 2}`}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">Erreur : {error}</p>
            <Button variant="outline" onClick={fetchRecommendations}>
              Réessayer
            </Button>
          </div>
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Aucune recommandation disponible"
            description="On travaille à enrichir notre catalogue de ressources. Reviens bientôt !"
            action={{
              label: 'Explorer le catalogue',
              onClick: () => router.push('/resources')
            }}
            secondaryAction={{
              label: 'Ajuster mes préférences',
              onClick: () => router.push('/onboarding')
            }}
          />
        ) : (
          <div className="space-y-12">
            {/* Section 1: Start Pack */}
            {startPack.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Start Pack</h2>
                    <p className="text-slate-600 text-sm">3 ressources pour démarrer vite</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {startPack.map((item, idx) => (
                    <ResourceCard key={item.id} item={item} rank={idx + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Mini-parcours */}
            {miniPath.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Mini-parcours</h2>
                    <p className="text-slate-600 text-sm">Étapes suivantes pour progresser</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {miniPath.map((item, idx) => (
                    <ResourceCard key={item.id} item={item} rank={idx + 4} compact />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Alternatives */}
            {alternatives.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Alternatives</h2>
                  <p className="text-slate-600 text-sm">Si tu as plus de temps ou préfères d'autres formats</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {alternatives.map(item => (
                    <ResourceCard key={item.id} item={item} compact />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Composant carte ressource
function ResourceCard({ 
  item, 
  rank, 
  compact = false 
}: { 
  item: RecommendationItem
  rank?: number
  compact?: boolean
}) {
  return (
    <Card className="border-2 border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all group">
      <CardContent className="p-5">
        {rank && !compact && (
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold text-sm mb-3">
            {rank}
          </div>
        )}

        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-cyan-700 transition-colors">
          {item.title}
        </h3>

        {item.description && !compact && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.level && (
            <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800">
              {item.level}
            </Badge>
          )}
          {item.duration_minutes && (
            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-300 text-slate-700">
              <Clock className="h-3 w-3 mr-1" />
              {Math.round(item.duration_minutes / 60)}h
            </Badge>
          )}
          {item.lang && (
            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-800">
              {item.lang}
            </Badge>
          )}
          {item.domains.slice(0, 2).map(domain => (
            <Badge key={domain} variant="outline" className="text-xs bg-green-50 border-green-300 text-green-800">
              {domain}
            </Badge>
          ))}
        </div>

        {/* Pourquoi */}
        {item.why && (
          <div className="mb-4 p-3 bg-cyan-50/50 border border-cyan-200 rounded-lg">
            <p className="text-xs text-cyan-900">
              <strong>Pourquoi ?</strong> {item.why}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1 bg-[#2d5986] hover:bg-[#1e3a5f] text-white">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              Commencer
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
          <Button size="sm" variant="outline">
            📥
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

