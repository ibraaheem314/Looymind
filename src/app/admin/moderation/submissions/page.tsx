'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Submission {
  id: string
  competition_id: string
  user_id: string
  score: number
  status: string
  created_at: string
  competition?: { title: string }[]
  user?: { display_name: string }[]
}

export default function SubmissionsModeration() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions()
    }
  }, [isAdmin])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('submissions')
        .select('*, competition:competitions(title), user:profiles!user_id(display_name)')
        .order('created_at', { ascending: false })
        .limit(100)
      
      setSubmissions((data || []) as Submission[])
    } catch (err) {
      console.error('Error fetching submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const disqualifySubmission = async (id: string) => {
    const reason = prompt('Raison de la disqualification :')
    if (!reason) return

    try {
      setProcessingId(id)
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'disqualified' })
        .eq('id', id)

      if (error) throw error
      await fetchSubmissions()
      alert('Soumission disqualifiée')
    } catch (err: any) {
      alert('Erreur lors de la disqualification')
    } finally {
      setProcessingId(null)
    }
  }

  const validateSubmission = async (id: string) => {
    try {
      setProcessingId(id)
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'validated' })
        .eq('id', id)

      if (error) throw error
      await fetchSubmissions()
      alert('Soumission validée')
    } catch (err: any) {
      alert('Erreur lors de la validation')
    } finally {
      setProcessingId(null)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <Link href="/dashboard"><Button>Retour</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-pink-500" />
                Modération des Soumissions
              </h1>
              <p className="text-gray-600 mt-1">Surveiller et valider les soumissions</p>
            </div>
            <Link href="/admin/moderation">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-orange-600">
                {submissions.filter(s => s.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Validées</p>
              <p className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'validated').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Disqualifiées</p>
              <p className="text-2xl font-bold text-red-600">
                {submissions.filter(s => s.status === 'disqualified').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune soumission
              </h3>
              <p className="text-gray-600">Les soumissions apparaîtront ici</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {submission.competition?.[0]?.title || 'Compétition inconnue'}
                        </h3>
                        <Badge className={
                          submission.status === 'validated' ? 'bg-green-100 text-green-800' :
                          submission.status === 'disqualified' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }>
                          {submission.status === 'validated' ? 'Validée' :
                           submission.status === 'disqualified' ? 'Disqualifiée' : 'En attente'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>👤 {submission.user?.[0]?.display_name || 'Anonyme'}</span>
                        <span>📊 Score: <span className="font-bold text-blue-600">{submission.score?.toFixed(4) || 'N/A'}</span></span>
                        <span>{format(new Date(submission.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                      </div>
                      
                      {/* Détection de scores suspects */}
                      {submission.score && submission.score > 0.99 && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          Score suspect - Vérification recommandée
                        </div>
                      )}
                    </div>

                    {submission.status === 'pending' && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => validateSubmission(submission.id)}
                          disabled={processingId === submission.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => disqualifySubmission(submission.id)}
                          disabled={processingId === submission.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Disqualifier
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

