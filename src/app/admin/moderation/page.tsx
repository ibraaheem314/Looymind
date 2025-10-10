'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, Flag, Trophy, AlertCircle, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface ModerationStats {
  reports: {
    pending: number
    total: number
  }
  submissions: {
    pending: number
    total: number
  }
}

export default function ModerationDashboard() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [stats, setStats] = useState<ModerationStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  const fetchStats = async () => {
    setLoading(true)
    try {
      // Fetch reports stats
      const { data: reports } = await supabase.from('reports').select('status')
      
      // Fetch submissions stats
      const { data: submissions } = await supabase.from('submissions').select('evaluation_status')

      setStats({
        reports: {
          pending: reports?.filter(r => r.status === 'pending').length || 0,
          total: reports?.length || 0
        },
        submissions: {
          pending: submissions?.filter(s => s.evaluation_status === 'pending').length || 0,
          total: submissions?.length || 0
        }
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">
              Vous devez être administrateur pour accéder à cette page.
            </p>
            <Link href="/dashboard">
              <Button>Retour au Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
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
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Shield className="h-8 w-8 text-orange-500" />
                Modération
              </h1>
              <p className="text-slate-600 mt-2">
                Gérez les signalements et évaluez les soumissions
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Retour au Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Signalements</span>
                {stats?.reports.pending && stats.reports.pending > 0 && (
                  <Badge variant="destructive">{stats.reports.pending}</Badge>
                )}
              </CardTitle>
              <CardDescription>Contenus signalés par la communauté</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">En attente</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {stats?.reports.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total traités</span>
                  <span className="text-slate-600">{stats?.reports.total || 0}</span>
                </div>
              </div>
              <Link href="/admin/moderation/reports">
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                  Gérer les signalements
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Soumissions</span>
                {stats?.submissions.total && stats.submissions.total > 0 && (
                  <Badge className="bg-cyan-100 text-cyan-700">{stats.submissions.total}</Badge>
                )}
              </CardTitle>
              <CardDescription>Évaluation des soumissions de compétitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">En attente</span>
                  <span className="text-2xl font-bold text-cyan-600">
                    {stats?.submissions.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total évaluées</span>
                  <span className="text-slate-600">
                    {(stats?.submissions.total || 0) - (stats?.submissions.pending || 0)}
                  </span>
                </div>
              </div>
              <Link href="/admin/submissions">
                <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
                  Évaluer les soumissions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Message d'info */}
        {stats && stats.reports.pending === 0 && stats.submissions.pending === 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-green-700">
                <Shield className="h-6 w-6" />
                <p className="text-lg font-medium">
                  ✅ Tout est à jour ! Aucune action requise pour le moment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerte si actions nécessaires */}
        {stats && (stats.reports.pending > 0 || stats.submissions.pending > 0) && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Actions requises
                  </h3>
                  <ul className="space-y-1 text-sm text-orange-800">
                    {stats.reports.pending > 0 && (
                      <li>• {stats.reports.pending} signalement{stats.reports.pending > 1 ? 's' : ''} en attente de traitement</li>
                    )}
                    {stats.submissions.pending > 0 && (
                      <li>• {stats.submissions.pending} soumission{stats.submissions.pending > 1 ? 's' : ''} à évaluer</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
