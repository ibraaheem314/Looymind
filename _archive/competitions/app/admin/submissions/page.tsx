'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  FileText, Download, Check, X, 
  Clock, Trophy, AlertCircle, ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Submission {
  id: string
  competition_id: string
  user_id: string
  file_url: string
  file_name: string
  file_size: number
  evaluation_status: string
  created_at: string
  competition_title: string
  competition_slug: string
  user_name: string
  user_avatar: string | null
  user_email: string
}

export default function AdminSubmissionsPage() {
  const { user, profile } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const [score, setScore] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'evaluated'>('all')
  const [stats, setStats] = useState({ total: 0, pending: 0, evaluated: 0 })

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchStats()
      fetchSubmissions()
    }
  }, [profile, activeTab])

  const fetchStats = async () => {
    try {
      const supabase = createClient()

      // Compter toutes les soumissions
      const { count: totalCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })

      // Compter les soumissions en attente
      const { count: pendingCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .eq('evaluation_status', 'pending')

      // Compter les soumissions évaluées (evaluated + rejected)
      const { count: evaluatedCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('evaluation_status', ['evaluated', 'rejected'])

      console.log('📊 Stats calculées:', {
        total: totalCount || 0,
        pending: pendingCount || 0,
        evaluated: evaluatedCount || 0
      })

      setStats({
        total: totalCount || 0,
        pending: pendingCount || 0,
        evaluated: evaluatedCount || 0
      })
    } catch (err: any) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      if (activeTab === 'pending') {
        // Soumissions en attente uniquement
        console.log('🔍 Fetching PENDING submissions...')
        const { data: submissionsData, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('evaluation_status', 'pending')
          .order('submitted_at', { ascending: false })

        if (error) throw error

        // Récupérer les compétitions et profils séparément
        const competitionIds = [...new Set(submissionsData?.map(s => s.competition_id) || [])]
        const userIds = [...new Set(submissionsData?.map(s => s.user_id) || [])]

        const { data: competitions } = await supabase
          .from('competitions')
          .select('id, title, slug')
          .in('id', competitionIds)

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, email')
          .in('id', userIds)

        // Créer des maps
        const competitionsMap = new Map(competitions?.map(c => [c.id, c]) || [])
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

        // Formater
        const formatted = submissionsData?.map((s: any) => {
          const competition = competitionsMap.get(s.competition_id)
          const profile = profilesMap.get(s.user_id)
          
          return {
            id: s.id,
            competition_id: s.competition_id,
            user_id: s.user_id,
            file_url: s.file_url,
            file_name: s.file_name,
            file_size: s.file_size,
            evaluation_status: s.evaluation_status,
            created_at: s.submitted_at,
            competition_title: competition?.title || 'Compétition inconnue',
            competition_slug: competition?.slug || '',
            user_name: profile?.display_name || 'Utilisateur inconnu',
            user_avatar: profile?.avatar_url || null,
            user_email: profile?.email || ''
          }
        }) || []

        console.log(`✅ Found ${formatted.length} pending submissions`)
        setSubmissions(formatted)
      } else if (activeTab === 'evaluated') {
        // Soumissions déjà évaluées
        console.log('🔍 Fetching EVALUATED submissions...')
        const { data: submissionsData, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('evaluation_status', 'evaluated')
          .order('evaluated_at', { ascending: false })

        if (error) throw error

        // Récupérer les compétitions et profils séparément
        const competitionIds = [...new Set(submissionsData?.map(s => s.competition_id) || [])]
        const userIds = [...new Set(submissionsData?.map(s => s.user_id) || [])]

        const { data: competitions } = await supabase
          .from('competitions')
          .select('id, title, slug')
          .in('id', competitionIds)

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, email')
          .in('id', userIds)

        // Créer des maps
        const competitionsMap = new Map(competitions?.map(c => [c.id, c]) || [])
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

        // Formater
        const formatted = submissionsData?.map((s: any) => {
          const competition = competitionsMap.get(s.competition_id)
          const profile = profilesMap.get(s.user_id)
          
          return {
            id: s.id,
            competition_id: s.competition_id,
            user_id: s.user_id,
            file_url: s.file_url,
            file_name: s.file_name,
            file_size: s.file_size,
            evaluation_status: s.evaluation_status,
            score: s.score,
            feedback: s.feedback,
            evaluated_at: s.evaluated_at,
            created_at: s.submitted_at,
            competition_title: competition?.title || 'Compétition inconnue',
            competition_slug: competition?.slug || '',
            user_name: profile?.display_name || 'Utilisateur inconnu',
            user_avatar: profile?.avatar_url || null,
            user_email: profile?.email || ''
          }
        }) || []

        console.log(`✅ Found ${formatted.length} evaluated submissions`)
        setSubmissions(formatted)
      } else {
        // TOUTES les soumissions (AVEC jointures séparées pour éviter les erreurs RLS)
        console.log('🔍 Fetching ALL submissions...')
        const { data: submissionsData, error, count } = await supabase
          .from('submissions')
          .select('*', { count: 'exact' })
          .order('submitted_at', { ascending: false })

        if (error) {
          console.error('❌ Error fetching all submissions:', error)
          console.error('❌ Error details:', JSON.stringify(error, null, 2))
          throw error
        }

        console.log(`✅ Found ${count} submissions in DB`)
        console.log('📊 Raw submissions data:', submissionsData)

        // Récupérer les compétitions et profils séparément
        const competitionIds = [...new Set(submissionsData?.map(s => s.competition_id) || [])]
        const userIds = [...new Set(submissionsData?.map(s => s.user_id) || [])]

        const { data: competitions } = await supabase
          .from('competitions')
          .select('id, title, slug')
          .in('id', competitionIds)

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, email')
          .in('id', userIds)

        // Créer des maps pour un accès rapide
        const competitionsMap = new Map(competitions?.map(c => [c.id, c]) || [])
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])

        // Formater les données avec les jointures
        const formatted = submissionsData?.map((s: any) => {
          const competition = competitionsMap.get(s.competition_id)
          const profile = profilesMap.get(s.user_id)
          
          return {
            id: s.id,
            competition_id: s.competition_id,
            user_id: s.user_id,
            file_url: s.file_url,
            file_name: s.file_name,
            file_size: s.file_size,
            evaluation_status: s.evaluation_status,
            created_at: s.submitted_at,
            competition_title: competition?.title || 'Compétition inconnue',
            competition_slug: competition?.slug || '',
            user_name: profile?.display_name || 'Utilisateur inconnu',
            user_avatar: profile?.avatar_url || null,
            user_email: profile?.email || ''
          }
        }) || []

        console.log('✅ Formatted submissions:', formatted)
        setSubmissions(formatted)
      }
    } catch (err: any) {
      console.error('Error fetching submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingSubmissions = fetchSubmissions

  const handleEvaluate = async (status: 'evaluated' | 'rejected') => {
    if (!selectedSubmission || !user) return

    // Validation
    if (status === 'evaluated' && !score) {
      setError('Le score est requis')
      return
    }

    const scoreValue = parseFloat(score)
    if (status === 'evaluated' && (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 1)) {
      setError('Le score doit être entre 0 et 1')
      return
    }

    try {
      setEvaluating(true)
      setError('')
      const supabase = createClient()

      console.log('🚀 Début évaluation:', {
        submission_id: selectedSubmission.id,
        score: scoreValue,
        evaluator_id: user.id
      })

      if (status === 'evaluated') {
        // Évaluer avec score (retourne JSON maintenant)
        const { data, error } = await supabase.rpc('evaluate_submission_manually', {
          p_submission_id: selectedSubmission.id,
          p_score: scoreValue,
          p_evaluator_id: user.id,
          p_feedback: feedback || null
        })

        console.log('✅ Réponse Supabase:', { data, error })

        if (error) {
          console.error('❌ Erreur Supabase:', error)
          throw new Error(`Erreur SQL: ${error.message}\nDétails: ${error.details || 'Aucun'}\nHint: ${error.hint || 'Aucun'}`)
        }

        // data est maintenant un objet JSON simple
        const result = typeof data === 'string' ? JSON.parse(data) : data
        
        alert(`✅ Soumission évaluée avec succès !\n\nScore: ${result.score}\nRang: #${result.rank}\nMeilleur score: ${result.is_best_score ? 'Oui 🎉' : 'Non'}`)
      } else {
        // Rejeter sans score
        const { error } = await supabase
          .from('submissions')
          .update({
            evaluation_status: 'rejected',
            evaluated_by: user.id,
            evaluated_at: new Date().toISOString(),
            feedback: feedback || 'Soumission rejetée'
          })
          .eq('id', selectedSubmission.id)

        if (error) throw error

        alert('❌ Soumission rejetée')
      }

      // Rafraîchir la liste et les stats
      await fetchStats()
      await fetchSubmissions()
      
      // Fermer le modal
      setSelectedSubmission(null)
      setScore('')
      setFeedback('')
    } catch (err: any) {
      console.error('❌ Error evaluating submission:', err)
      setError(err.message || 'Erreur lors de l\'évaluation')
    } finally {
      setEvaluating(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">Vous devez être administrateur pour accéder à cette page.</p>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/moderation">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">
                Évaluation des Soumissions
              </h1>
              <p className="text-slate-600 mt-2">
                Évaluez manuellement les soumissions en attente
              </p>
            </div>
            <Button onClick={fetchPendingSubmissions} disabled={loading}>
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              En attente ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('evaluated')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'evaluated'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Évaluées ({stats.evaluated})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {activeTab === 'pending' && 'Aucune soumission en attente'}
                {activeTab === 'evaluated' && 'Aucune soumission évaluée'}
                {activeTab === 'all' && 'Aucune soumission'}
              </h3>
              <p className="text-slate-600">
                {activeTab === 'pending' && 'Toutes les soumissions ont été évaluées !'}
                {activeTab === 'evaluated' && 'Aucune soumission n\'a encore été évaluée.'}
                {activeTab === 'all' && 'Aucune soumission n\'a été enregistrée pour le moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {submission.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{submission.user_name}</p>
                          <p className="text-sm text-slate-600">{submission.user_email}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Link 
                          href={`/competitions/${submission.competition_slug}`}
                          className="text-lg font-medium text-cyan-600 hover:text-cyan-700"
                        >
                          {submission.competition_title}
                        </Link>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{submission.file_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{formatFileSize(submission.file_size)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(submission.created_at), { 
                              addSuffix: true,
                              locale: fr 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {submission.evaluation_status === 'pending' ? (
                        <>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                            <Clock className="h-3 w-3 mr-1" />
                            En attente
                          </Badge>
                          <Button onClick={() => setSelectedSubmission(submission)}>
                            <Trophy className="h-4 w-4 mr-2" />
                            Évaluer
                          </Button>
                        </>
                      ) : submission.evaluation_status === 'evaluated' ? (
                        <>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Évaluée
                          </Badge>
                          {submission.score && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Score: {submission.score}
                            </Badge>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                          <X className="h-3 w-3 mr-1" />
                          Rejetée
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'évaluation */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Évaluer la soumission</DialogTitle>
            <DialogDescription>
              Attribuez un score et un feedback optionnel à cette soumission
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Participant</p>
                <p className="text-slate-900">{selectedSubmission.user_name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Compétition</p>
                <p className="text-slate-900">{selectedSubmission.competition_title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Fichier</p>
                <p className="text-slate-900">{selectedSubmission.file_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Score (0 à 1) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="0.85"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Plus le score est élevé, meilleur est le classement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Feedback (optionnel)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Excellente approche, résultats cohérents..."
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={() => handleEvaluate('rejected')}
              disabled={evaluating}
            >
              <X className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
            <Button
              onClick={() => handleEvaluate('evaluated')}
              disabled={evaluating || !score}
            >
              <Check className="h-4 w-4 mr-2" />
              {evaluating ? 'Évaluation...' : 'Valider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
