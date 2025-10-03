'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, AlertTriangle, Users, FileText, TrendingUp,
  Flag, Activity, BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface ModerationStats {
  reports: {
    pending: number
    reviewing: number
    resolved: number
    total: number
  }
  users: {
    total: number
    active: number
    banned: number
    suspended: number
  }
  content: {
    articles: number
    projects: number
    comments: number
  }
}

export default function ModerationDashboard() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [stats, setStats] = useState<ModerationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [urgentReports, setUrgentReports] = useState<any[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
      fetchUrgentReports()
    }
  }, [isAdmin])

  const fetchStats = async () => {
    setLoading(true)
    try {
      // Fetch reports stats
      const { data: reports } = await supabase.from('reports').select('status')
      
      // Fetch users stats
      const { data: profiles } = await supabase.from('profiles').select('account_status')
      
      // Fetch content stats
      const { data: articles } = await supabase.from('articles').select('id')
      const { data: projects } = await supabase.from('projects').select('id')
      const { data: comments } = await supabase.from('comments').select('id')

      setStats({
        reports: {
          pending: reports?.filter(r => r.status === 'pending').length || 0,
          reviewing: reports?.filter(r => r.status === 'reviewing').length || 0,
          resolved: reports?.filter(r => r.status === 'resolved').length || 0,
          total: reports?.length || 0
        },
        users: {
          total: profiles?.length || 0,
          active: profiles?.filter(p => p.account_status === 'active').length || 0,
          banned: profiles?.filter(p => p.account_status === 'banned').length || 0,
          suspended: profiles?.filter(p => p.account_status === 'suspended').length || 0
        },
        content: {
          articles: articles?.length || 0,
          projects: projects?.length || 0,
          comments: comments?.length || 0
        }
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUrgentReports = async () => {
    try {
      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .eq('priority', 'urgent')
        .order('created_at', { ascending: false })
        .limit(5)

      setUrgentReports(data || [])
    } catch (err) {
      console.error('Error fetching urgent reports:', err)
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-8 w-8 text-red-500" />
                Espace Modération
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez les signalements et maintenez la qualité du contenu
              </p>
              <Badge className="mt-2">Administrateur</Badge>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Retour au Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner si signalements urgents */}
        {urgentReports.length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">
                  🚨 {urgentReports.length} signalement(s) urgent(s) en attente
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Ces signalements nécessitent une attention immédiate
                </p>
              </div>
              <Link href="/admin/moderation/reports" className="ml-auto">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Traiter maintenant
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800">
                Espace en développement
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Les fonctionnalités de modération seront ajoutées progressivement. 
                Pour le moment, vous pouvez gérer les utilisateurs, compétitions et articles.
              </p>
            </div>
          </div>
        </div>

        {/* Cartes de navigation - Style "Note Cards" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Signalements */}
          <Link href="/admin/moderation/reports">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <Flag className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Signalements</h3>
                    <p className="text-sm text-gray-600">
                      Gérer les signalements de contenu
                    </p>
                  </div>
                  {stats && stats.reports.pending > 0 && (
                    <Badge className="bg-orange-500 text-white text-lg px-3 py-1 h-8">
                      {stats.reports.pending}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {stats?.reports.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En cours</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats?.reports.reviewing || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Résolus</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.reports.resolved || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Utilisateurs */}
          <Link href="/admin/moderation/users">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Utilisateurs</h3>
                    <p className="text-sm text-gray-600">
                      Gérer les utilisateurs et leurs rôles
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Actifs</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.users.active || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suspendus</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {stats?.users.suspended || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bannis</span>
                    <span className="text-2xl font-bold text-red-600">
                      {stats?.users.banned || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Contenu */}
          <Link href="/admin/moderation/content">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Contenu</h3>
                    <p className="text-sm text-gray-600">
                      Modérer articles et projets
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Articles</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {stats?.content.articles || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Projets</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.content.projects || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Commentaires</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats?.content.comments || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Compétitions */}
          <Link href="/admin/moderation/competitions">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Compétitions</h3>
                    <p className="text-sm text-gray-600">
                      Gérer les compétitions et submissions
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Actives</span>
                    <span className="text-2xl font-bold text-green-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-2xl font-bold text-orange-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Terminées</span>
                    <span className="text-2xl font-bold text-gray-600">
                      -
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Ressources */}
          <Link href="/admin/moderation/resources">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-2xl">
                    <Activity className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Ressources</h3>
                    <p className="text-sm text-gray-600">
                      Valider et modérer les ressources
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Validées</span>
                    <span className="text-2xl font-bold text-green-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-2xl font-bold text-orange-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rejetées</span>
                    <span className="text-2xl font-bold text-red-600">
                      -
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Soumissions */}
          <Link href="/admin/moderation/submissions">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-pink-100 rounded-2xl">
                    <BarChart3 className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Soumissions</h3>
                    <p className="text-sm text-gray-600">
                      Surveiller les soumissions et scores
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suspectes</span>
                    <span className="text-2xl font-bold text-orange-600">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Disqualifiées</span>
                    <span className="text-2xl font-bold text-red-600">
                      -
                    </span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
