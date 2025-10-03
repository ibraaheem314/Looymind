'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, ArrowLeft, Shield, Eye, Trash2, CheckCircle, XCircle
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Competition {
  id: string
  title: string
  slug: string
  status: string
  start_date: string
  end_date: string
  participants_count: number
  submissions_count: number
  created_at: string
}

export default function CompetitionsModeration() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchCompetitions()
    }
  }, [isAdmin])

  const fetchCompetitions = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      setCompetitions((data || []) as Competition[])
    } catch (err) {
      console.error('Error fetching competitions:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteCompetition = async (id: string) => {
    if (!confirm('Supprimer cette compétition définitivement ?')) return
    try {
      setProcessingId(id)
      const { error } = await supabase.from('competitions').delete().eq('id', id)
      if (error) throw error
      await fetchCompetitions()
      alert('Compétition supprimée')
    } catch (err: any) {
      alert('Erreur lors de la suppression')
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
                <TrendingUp className="h-8 w-8 text-green-500" />
                Modération des Compétitions
              </h1>
              <p className="text-gray-600 mt-1">Gérer et modérer les compétitions</p>
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
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          </div>
        ) : competitions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune compétition
              </h3>
              <p className="text-gray-600 mb-4">
                Les compétitions créées apparaîtront ici
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {competitions.map((competition) => (
              <Card key={competition.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{competition.title}</h3>
                        <Badge className={
                          competition.status === 'active' ? 'bg-green-100 text-green-800' :
                          competition.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {competition.status === 'active' ? 'Active' :
                           competition.status === 'upcoming' ? 'À venir' : 'Terminée'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>👥 {competition.participants_count || 0} participants</span>
                        <span>📊 {competition.submissions_count || 0} soumissions</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          Début: {format(new Date(competition.start_date), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <p>
                          Fin: {format(new Date(competition.end_date), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/competitions/${competition.slug}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCompetition(competition.id)}
                        disabled={processingId === competition.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
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

