'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Users, TrendingUp } from 'lucide-react'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useAuth } from '@/hooks/useAuth'

interface LeaderboardProps {
  challengeId: string
}

export default function Leaderboard({ challengeId }: LeaderboardProps) {
  const { submissions, loading, error } = useSubmissions(challengeId)
  const { user } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classement</CardTitle>
          <CardDescription>Chargement du classement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classement</CardTitle>
          <CardDescription>Erreur lors du chargement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const leaderboard = submissions
    .filter(s => s.status === 'accepted' && s.score !== null)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200'
      case 2:
        return 'bg-gray-50 border-gray-200'
      case 3:
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  const userRank = leaderboard.findIndex(s => s.user_id === user?.id) + 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Classement
            </CardTitle>
            <CardDescription>
              Top {leaderboard.length} des meilleures soumissions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{submissions.length} soumissions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune soumission évaluée pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((submission, index) => {
              const rank = index + 1
              const isCurrentUser = submission.user_id === user?.id
              
              return (
                <div
                  key={submission.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                    getRankColor(rank)
                  } ${isCurrentUser ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {submission.title}
                      </h4>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          Vous
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {submission.profiles?.display_name || 'Utilisateur anonyme'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold text-lg text-gray-900">
                        {submission.score?.toFixed(4) || 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {submission.status === 'accepted' ? 'Accepté' : 'En attente'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Position de l'utilisateur si pas dans le top 10 */}
        {userRank > 10 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Votre position : #{userRank}</span>
              <span>Continuez à améliorer votre score !</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
