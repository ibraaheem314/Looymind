'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Calendar, Users, Trophy, 
  Target, Clock, Award, Download,
  Upload, BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import SubmissionModal from '@/components/competitions/submission-modal'
import Leaderboard from '@/components/competitions/leaderboard'

interface Competition {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  category: string
  difficulty: string
  metric_type: string
  metric_description: string
  evaluation_criteria: string
  dataset_description: string
  dataset_url: string
  start_date: string
  end_date: string
  status: string
  rules: string
  participants_count: number
  submissions_count: number
  prize_amount: number
  prize_description: string
  created_at: string
}

export default function CompetitionDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'data' | 'leaderboard'>('overview')
  const supabase = createClient()

  useEffect(() => {
    if (slug) {
      fetchCompetition()
    }
  }, [slug])

  const fetchCompetition = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Error fetching competition:', error)
        return
      }

      setCompetition(data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Compétition non trouvée</h2>
            <p className="text-gray-600 mb-4">Cette compétition n'existe pas ou a été supprimée.</p>
            <Button onClick={() => router.push('/competitions')}>
              Retour aux compétitions
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(competition.end_date)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/competitions"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux compétitions
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-white/20 text-white border-0">
                  {competition.category}
                </Badge>
                <Badge className="bg-white/20 text-white border-0">
                  {competition.difficulty}
                </Badge>
                {competition.status === 'active' && daysRemaining <= 7 && (
                  <Badge className="bg-red-500 text-white border-0">
                    🔥 {daysRemaining}j restants
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-4">{competition.title}</h1>
              <p className="text-xl text-white/80 mb-6">{competition.short_description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <div className="text-2xl font-bold">{competition.participants_count}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Soumissions</span>
                  </div>
                  <div className="text-2xl font-bold">{competition.submissions_count}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm">Métrique</span>
                  </div>
                  <div className="text-2xl font-bold">{competition.metric_type.toUpperCase()}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Fin</span>
                  </div>
                  <div className="text-lg font-bold">
                    {format(new Date(competition.end_date), 'dd MMM', { locale: fr })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'rules', label: 'Règles' },
              { id: 'data', label: 'Données' },
              { id: 'leaderboard', label: 'Classement' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ReactMarkdown>{competition.description}</ReactMarkdown>
                </CardContent>
              </Card>
            )}

            {activeTab === 'rules' && (
              <Card>
                <CardHeader>
                  <CardTitle>Règles de la compétition</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <ReactMarkdown>{competition.rules}</ReactMarkdown>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Critères d'évaluation</h4>
                    <p className="text-blue-800 text-sm">{competition.evaluation_criteria}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'data' && (
              <Card>
                <CardHeader>
                  <CardTitle>Dataset</CardTitle>
                  <CardDescription>{competition.dataset_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Métrique d'évaluation</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>{competition.metric_type.toUpperCase()}</strong>
                      </p>
                      <p className="text-sm text-gray-600">{competition.metric_description}</p>
                    </div>

                    {competition.dataset_url && (
                      <Button className="w-full" asChild>
                        <a href={competition.dataset_url} download>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le dataset
                        </a>
                      </Button>
                    )}

                    {!competition.dataset_url && (
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Le dataset sera bientôt disponible</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'leaderboard' && (
              <div>
                <Leaderboard competitionId={competition.id} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>Participer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <SubmissionModal 
                      competitionId={competition.id}
                      competitionSlug={competition.slug}
                      userId={user.id}
                    />
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/competitions/${competition.slug}/leaderboard`}>
                        <Trophy className="h-4 w-4 mr-2" />
                        Tableau des scores
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Connectez-vous pour participer à cette compétition
                    </p>
                    <Button className="w-full" asChild>
                      <Link href={`/auth/login?redirect=/competitions/${competition.slug}`}>
                        Se connecter
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Début</div>
                  <div className="font-medium">
                    {format(new Date(competition.start_date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Fin</div>
                  <div className="font-medium">
                    {format(new Date(competition.end_date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </div>
                {competition.prize_amount && (
                  <div>
                    <div className="text-gray-500 mb-1">Prix</div>
                    <div className="font-medium text-green-600">
                      {competition.prize_amount.toLocaleString()} FCFA
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

