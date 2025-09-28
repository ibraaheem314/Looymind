'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Users, Clock, TrendingUp, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

// Mock data pour le dashboard
const mockUserData = {
  name: 'Aminata Diallo',
  role: 'talent',
  profileComplete: 85,
  totalChallenges: 12,
  completedChallenges: 8,
  currentRank: 15,
  totalPoints: 2450
}

const mockActiveChallenges = [
  {
    id: '1',
    title: 'Prédiction des Prix du Riz',
    daysLeft: 5,
    participants: 45,
    myRank: 8
  },
  {
    id: '2',
    title: 'Classification d\'Images Médicales',
    daysLeft: 12,
    participants: 32,
    myRank: 3
  }
]

const mockRecentActivity = [
  {
    type: 'submission',
    message: 'Soumission pour "Analyse de Sentiment en Wolof"',
    date: '2024-01-15',
    score: 0.87
  },
  {
    type: 'rank',
    message: 'Nouveau classement #3 dans "Classification d\'Images"',
    date: '2024-01-14'
  },
  {
    type: 'join',
    message: 'Participation au défi "Prédiction des Prix du Riz"',
    date: '2024-01-12'
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {mockUserData.name} 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos activités et performances sur Looymind
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Défis Complétés</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUserData.completedChallenges}</div>
              <p className="text-xs text-muted-foreground">
                sur {mockUserData.totalChallenges} participations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classement Global</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{mockUserData.currentRank}</div>
              <p className="text-xs text-muted-foreground">
                dans la communauté
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Totaux</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUserData.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +120 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profil</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUserData.profileComplete}%</div>
              <p className="text-xs text-muted-foreground">
                complété
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Défis actifs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Défis en cours</CardTitle>
                <CardDescription>
                  Vos participations actuelles aux compétitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveChallenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{challenge.daysLeft} jours restants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{challenge.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Rang #{challenge.myRank}</Badge>
                        <div className="mt-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/challenges/${challenge.id}`}>
                              Voir
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/challenges">
                      Découvrir plus de défis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activité récente */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Vos dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('fr-FR')}
                          </p>
                          {'score' in activity && (
                            <Badge variant="outline" className="text-xs">
                              Score: {(activity.score * 100).toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/profile">
                    Compléter mon profil
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/challenges">
                    Rejoindre un défi
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/projects">
                    Créer un projet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
