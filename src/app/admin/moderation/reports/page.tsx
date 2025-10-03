'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, AlertTriangle, Users, FileText, TrendingUp,
  AlertCircle, CheckCircle, Clock, Activity, BarChart3,
  MessageSquare, Flag, Ban, Eye
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Signalements</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats?.reports.pending || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">En attente</p>
                </div>
                <Flag className="h-10 w-10 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Utilisateurs</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats?.users.total || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.users.banned || 0} bannis
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Articles</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.content.articles || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Publiés</p>
                </div>
                <FileText className="h-10 w-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projets</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.content.projects || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Actifs</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Signalements */}
          <Link href="/admin/moderation/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Flag className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Signalements</CardTitle>
                      <CardDescription className="text-xs">
                        Gérer les signalements de contenu
                      </CardDescription>
                    </div>
                  </div>
                  {stats && stats.reports.pending > 0 && (
                    <Badge className="bg-orange-500 text-white">
                      {stats.reports.pending}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="font-semibold text-orange-600">
                      {stats?.reports.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En cours</span>
                    <span className="font-semibold text-blue-600">
                      {stats?.reports.reviewing || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Résolus</span>
                    <span className="font-semibold text-green-600">
                      {stats?.reports.resolved || 0}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Utilisateurs */}
          <Link href="/admin/moderation/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Utilisateurs</CardTitle>
                      <CardDescription className="text-xs">
                        Gérer les utilisateurs et leurs rôles
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{stats?.users.total || 0}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actifs</span>
                    <span className="font-semibold text-green-600">
                      {stats?.users.active || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suspendus</span>
                    <span className="font-semibold text-orange-600">
                      {stats?.users.suspended || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bannis</span>
                    <span className="font-semibold text-red-600">
                      {stats?.users.banned || 0}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Contenu */}
          <Link href="/admin/moderation/content">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Contenu</CardTitle>
                      <CardDescription className="text-xs">
                        Modérer articles et projets
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles</span>
                    <span className="font-semibold">
                      {stats?.content.articles || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projets</span>
                    <span className="font-semibold">
                      {stats?.content.projects || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commentaires</span>
                    <span className="font-semibold">
                      {stats?.content.comments || 0}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Activité récente */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Les dernières actions de modération
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucune activité récente</p>
              <p className="text-xs mt-1">Les actions de modération apparaîtront ici</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
