'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Target, TrendingUp, Calendar, Award, Users, BarChart3, Activity } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useProjects } from '@/hooks/useProjects'

interface UserStatsProps {
  userId: string
}

interface UserStats {
  totalSubmissions: number
  acceptedSubmissions: number
  bestScore: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  recentSubmissions: any[]
  recentProjects: any[]
}

export default function UserStats({ userId }: UserStatsProps) {
  const { getProfileStats } = useProfile()
  const { submissions: userSubmissions } = useSubmissions()
  const { projects: userProjects } = useProjects()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const statsData = await getProfileStats(userId)
        
        if (statsData) {
          // Filtrer les soumissions et projets de l'utilisateur
          const userSubs = userSubmissions.filter(s => s.user_id === userId)
          const userProjs = userProjects.filter(p => p.user_id === userId)
          
          setStats({
            ...statsData,
            recentSubmissions: userSubs.slice(0, 5),
            recentProjects: userProjs.slice(0, 5)
          })
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId, getProfileStats, userSubmissions, userProjects])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Impossible de charger les statistiques
        </CardContent>
      </Card>
    )
  }

  const statCards = [
    {
      title: 'Soumissions',
      value: stats.totalSubmissions,
      subtitle: `${stats.acceptedSubmissions} acceptées`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Meilleur Score',
      value: stats.bestScore.toFixed(4),
      subtitle: 'Score le plus élevé',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Projets',
      value: stats.totalProjects,
      subtitle: `${stats.activeProjects} actifs`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Taux de Réussite',
      value: stats.totalSubmissions > 0 
        ? `${Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)}%`
        : '0%',
      subtitle: 'Soumissions acceptées',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soumissions récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Soumissions Récentes
            </CardTitle>
            <CardDescription>
              Vos dernières participations aux défis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{submission.title}</p>
                      <p className="text-xs text-gray-500">
                        {submission.challenges?.title || 'Défi'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={submission.status === 'accepted' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {submission.status === 'accepted' ? 'Accepté' : 'En attente'}
                      </Badge>
                      {submission.score && (
                        <p className="text-xs text-gray-500 mt-1">
                          Score: {submission.score.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune soumission récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projets récents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Projets Récents
            </CardTitle>
            <CardDescription>
              Vos derniers projets et réalisations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentProjects.length > 0 ? (
              <div className="space-y-3">
                {stats.recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{project.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(project.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge 
                      variant={project.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {project.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun projet récent</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Graphique de progression (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progression
          </CardTitle>
          <CardDescription>
            Évolution de vos performances au fil du temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Graphique de progression à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
