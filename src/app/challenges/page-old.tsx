'use client'

import { Button } from '@/components/ui/button'
import ChallengeCard from '@/components/challenges/challenge-card'
import { Search, Filter, Plus, Trophy, Users, Target } from 'lucide-react'
import { useState } from 'react'
import { useChallenges } from '@/hooks/useChallenges'

export default function ChallengesPage() {
  const { challenges, loading, error } = useChallenges()
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  
  const difficulties = ['all', 'debutant', 'intermediaire', 'avance']
  const difficultyLabels = {
    all: 'Tous les niveaux',
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire', 
    avance: 'Avancé'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Mock data - à remplacer par des données Supabase
  const mockChallenges = [
  {
    id: '1',
    title: 'Prédiction des Prix du Riz au Sénégal',
    description: 'Développez un modèle de machine learning pour prédire les fluctuations des prix du riz sur les marchés sénégalais en utilisant des données historiques et des facteurs économiques.',
    prize_amount: 500000,
    end_date: '2024-03-15',
    difficulty: 'intermediate' as const,
    category: 'Agriculture',
    participants: 45,
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '2',
    title: 'Classification d\'Images Médicales',
    description: 'Créez un système de classification automatique pour détecter des anomalies dans des radiographies pulmonaires, contribuant à améliorer le diagnostic médical au Sénégal.',
    prize_amount: 750000,
    end_date: '2024-04-20',
    difficulty: 'advanced' as const,
    category: 'Santé',
    participants: 32,
    image_url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '3',
    title: 'Analyse de Sentiment en Wolof',
    description: 'Développez un modèle de traitement du langage naturel capable d\'analyser les sentiments dans des textes en wolof, la langue locale du Sénégal.',
    prize_amount: 300000,
    end_date: '2024-02-28',
    difficulty: 'beginner' as const,
    category: 'NLP',
    participants: 67,
    image_url: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '4',
    title: 'Prédiction de la Mobilité Urbaine à Dakar',
    description: 'Analysez les patterns de mobilité urbaine à Dakar pour optimiser les transports en commun et réduire les embouteillages. Utilisez des données GPS et de géolocalisation.',
    prize_amount: 400000,
    end_date: '2024-05-30',
    difficulty: 'intermediate' as const,
    category: 'Transport',
    participants: 28,
    image_url: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '5',
    title: 'Détection de Fraude Bancaire Mobile Money',
    description: 'Développez un système de détection de fraude pour les transactions Mobile Money au Sénégal. Protégez les utilisateurs contre les activités suspectes.',
    prize_amount: 600000,
    end_date: '2024-06-15',
    difficulty: 'advanced' as const,
    category: 'Finance',
    participants: 19,
    image_url: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '6',
    title: 'Optimisation des Rendements Agricoles',
    description: 'Créez un modèle prédictif pour optimiser les rendements des cultures d\'arachide au Sénégal en fonction des conditions climatiques et du sol.',
    prize_amount: 350000,
    end_date: '2024-07-10',
    difficulty: 'beginner' as const,
    category: 'Agriculture',
    participants: 52,
    image_url: 'https://images.pexels.com/photos/1081887/pexels-photo-1081887.jpeg?auto=compress&cs=tinysrgb&w=500'
  }
]

export default function ChallengesPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
  const difficultyLabels = {
    all: 'Tous les niveaux',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire', 
    advanced: 'Avancé'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Trophy className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">Compétitions IA</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Défis IA Sénégal
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Participez à des compétitions de machine learning avec des prix attractifs.
              Relevez les défis IA et gagnez des prix en XOF.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Proposer un défi
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                Voir les prix
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Target, number: "15+", label: "Défis actifs" },
                { icon: Users, number: "300+", label: "Participants" },
                { icon: Trophy, number: "2M+", label: "XOF en prix" }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Difficulty Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedDifficulty === difficulty
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un défi par nom, catégorie ou description..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à relever un défi ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez la compétition et montrez vos compétences en IA. Gagnez des prix et faites-vous remarquer par la communauté.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Proposer un nouveau défi
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Charger plus de défis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}