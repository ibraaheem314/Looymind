'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Trophy, Users, Download, ExternalLink, Clock, Target, Award, TrendingUp, Upload } from 'lucide-react'
import Link from 'next/link'
import SubmissionForm from '@/components/challenges/submission-form'
import { createClient } from '@/lib/supabase'
import type { Challenge } from '@/lib/supabase'

// Mock data pour un défi spécifique (sera remplacé par les données Supabase)
const mockChallenge = {
  id: '1',
  title: 'Prédiction des Prix du Riz au Sénégal',
  description: 'Développez un modèle de machine learning pour prédire les fluctuations des prix du riz sur les marchés sénégalais en utilisant des données historiques et des facteurs économiques.',
  problem_statement: `
    # Contexte du Défi

    Le prix du riz est un indicateur économique crucial au Sénégal, car il constitue l'aliment de base pour une grande partie de la population. Les fluctuations de prix peuvent avoir des impacts significatifs sur la sécurité alimentaire et l'économie du pays.

    ## Objectif

    Votre mission est de développer un modèle prédictif capable d'anticiper les variations de prix du riz sur les principaux marchés sénégalais.

    ## Données Fournies

    - **Prix historiques** : 5 ans de données hebdomadaires sur 15 marchés
    - **Données météorologiques** : Précipitations, température, humidité
    - **Calendrier agricole** : Périodes de semis et de récolte
    - **Indicateurs économiques** : Taux de change, inflation, etc.
    - **Données d'importation** : Volumes et prix d'importation

    ## Métrique d'Évaluation

    Votre modèle sera évalué sur la **RMSE (Root Mean Square Error)** calculée sur les prédictions de prix pour les 12 semaines suivantes.

    ## Format de Soumission

    Fichier CSV avec les colonnes :
    - \`market_id\` : Identifiant du marché
    - \`week\` : Semaine de prédiction (1-12)
    - \`predicted_price\` : Prix prédit en FCFA/kg
  `,
  difficulty: 'intermediaire' as const,
  category: 'Agriculture',
  prize_xof: 500000,
  starts_at: '2024-01-15T00:00:00Z',
  ends_at: '2024-03-15T23:59:59Z',
  status: 'en_cours' as const,
  image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800',
  dataset_url: '/datasets/rice-prices-senegal.zip',
  metric: 'RMSE',
  slug: 'prediction-prix-riz-senegal'
}

const mockLeaderboard = [
  { rank: 1, user: 'DataMaster_SN', score: 0.1247, submissions: 8 },
  { rank: 2, user: 'ML_Wizard', score: 0.1289, submissions: 12 },
  { rank: 3, user: 'AgriPredict', score: 0.1334, submissions: 5 },
  { rank: 4, user: 'SenegalAI', score: 0.1456, submissions: 15 },
  { rank: 5, user: 'RicePredictor', score: 0.1523, submissions: 7 }
]

const difficultyColors = {
  debutant: 'bg-green-100 text-green-800',
  intermediaire: 'bg-yellow-100 text-yellow-800',
  avance: 'bg-red-100 text-red-800'
}

const statusColors = {
  a_venir: 'bg-gray-100 text-gray-800',
  en_cours: 'bg-green-100 text-green-800',
  termine: 'bg-blue-100 text-blue-800'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(amount)
}

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [participants, setParticipants] = useState(45)
  const [submissions, setSubmissions] = useState(128)

  useEffect(() => {
    // Dans l'implémentation réelle, on chargerait depuis Supabase
    // Pour l'instant, on utilise les données mock
    setTimeout(() => {
      setChallenge(mockChallenge as any)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmissionSuccess = () => {
    // Recharger les stats ou afficher une notification
    setSubmissions(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement du défi...</div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Défi non trouvé</h1>
          <p className="text-gray-600 mb-4">Ce défi n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/challenges">Retour aux défis</Link>
          </Button>
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(challenge.ends_at)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image et badges */}
            <div className="lg:w-1/3">
              <div className="relative">
                <img
                  src={challenge.image_url || '/placeholder-challenge.jpg'}
                  alt={challenge.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge className={difficultyColors[challenge.difficulty]}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Badge>
                  <Badge className={statusColors[challenge.status]}>
                    {challenge.status === 'en_cours' ? 'Actif' : 
                     challenge.status === 'a_venir' ? 'À venir' : 'Terminé'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{challenge.category}</Badge>
                  <span className="text-sm text-gray-500">Métrique : {challenge.metric}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {challenge.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Stats du défi */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(challenge.prize_xof)}</p>
                  <p className="text-sm text-gray-500">Prix</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{participants}</p>
                  <p className="text-sm text-gray-500">Participants</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{submissions}</p>
                  <p className="text-sm text-gray-500">Soumissions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{daysRemaining}</p>
                  <p className="text-sm text-gray-500">Jours restants</p>
                </div>
              </div>

              {/* Onglets */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Aperçu', icon: Target },
                    { id: 'submit', label: 'Soumettre', icon: Upload },
                    { id: 'leaderboard', label: 'Classement', icon: Award },
                    { id: 'data', label: 'Données', icon: Download }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="mr-2 h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Description du Défi</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {challenge.description || mockChallenge.problem_statement}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'submit' && (
              <SubmissionForm 
                challengeId={challenge.id}
                challengeTitle={challenge.title}
                onSubmissionSuccess={handleSubmissionSuccess}
              />
            )}

            {activeTab === 'leaderboard' && (
              <Card>
                <CardHeader>
                  <CardTitle>Classement</CardTitle>
                  <CardDescription>
                    Classement basé sur la métrique {challenge.metric} (meilleur score en premier)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLeaderboard.map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <p className="font-medium">{entry.user}</p>
                            <p className="text-sm text-gray-500">{entry.submissions} soumissions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-lg">{entry.score}</p>
                          <p className="text-xs text-gray-500">{challenge.metric}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'data' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ressources et Données</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Dataset Principal</h4>
                        <p className="text-sm text-gray-600">Données historiques et variables explicatives</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={challenge.dataset_url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Exemple de Soumission</h4>
                        <p className="text-sm text-gray-600">Format CSV attendu pour vos prédictions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Notebook de Démarrage</h4>
                        <p className="text-sm text-gray-600">Analyse exploratoire et modèle de base</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Voir sur GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations importantes */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Date de fin</span>
                  <span className="font-medium">{new Date(challenge.ends_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Métrique</span>
                  <span className="font-medium">{challenge.metric}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Évaluation</span>
                  <span className="font-medium">Automatique</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Soumissions/jour</span>
                  <span className="font-medium">5 max</span>
                </div>
              </CardContent>
            </Card>

            {/* Bouton de participation rapide */}
            {challenge.status === 'en_cours' && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Prêt à participer ?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Téléchargez les données et soumettez votre première prédiction !
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('submit')}
                  >
                    Commencer maintenant
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}