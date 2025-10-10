'use client'

import { useLeaderboard, useUserRank } from '@/hooks/useLeaderboard'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, Users, Target, Medal, Award } from 'lucide-react'

interface LeaderboardProps {
  competitionId: string
}

export default function Leaderboard({ competitionId }: LeaderboardProps) {
  const { user } = useAuth()
  const { leaderboard, stats, loading, error } = useLeaderboard(competitionId)
  const { userRank } = useUserRank(competitionId, user?.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats du leaderboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Users className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Participants</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_participants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Meilleur Score</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.highest_score.toFixed(4)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Score Moyen</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.average_score.toFixed(4)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Soumissions</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_submissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mon classement */}
      {userRank && (
        <Card className="border-2 border-cyan-200 bg-cyan-50/50">
          <CardHeader>
            <CardTitle className="text-lg">Votre Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-cyan-600">
                  #{userRank.rank}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Score: {userRank.score.toFixed(4)}</p>
                  <p className="text-sm text-slate-600">
                    {userRank.submission_count} soumission{userRank.submission_count > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {userRank.best_score > userRank.score && (
                <Badge variant="secondary">
                  Meilleur: {userRank.best_score.toFixed(4)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau du leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Classement Général
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Aucune soumission pour le moment</p>
              <p className="text-sm">Soyez le premier à participer !</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Rang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Soumissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Dernière amélioration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = user?.id === entry.user_id
                    const isTopThree = entry.rank <= 3

                    return (
                      <tr
                        key={entry.id}
                        className={`
                          hover:bg-slate-50 transition-colors
                          ${isCurrentUser ? 'bg-cyan-50/30' : ''}
                          ${isTopThree ? 'font-semibold' : ''}
                        `}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getMedalIcon(entry.rank)}
                            <span className={`
                              text-lg
                              ${entry.rank === 1 ? 'text-yellow-600' : ''}
                              ${entry.rank === 2 ? 'text-gray-600' : ''}
                              ${entry.rank === 3 ? 'text-orange-600' : 'text-slate-700'}
                            `}>
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {entry.display_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {entry.display_name}
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="ml-2">Vous</Badge>
                                )}
                              </p>
                              {entry.role === 'admin' && (
                                <Badge variant="secondary" className="text-xs">Admin</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono font-semibold text-slate-900">
                            {entry.score.toFixed(6)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">
                            {entry.submission_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {entry.last_improvement_at ? (
                            new Date(entry.last_improvement_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
