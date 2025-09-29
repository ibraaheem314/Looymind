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

  // Calculer les statistiques
  const activeChallenges = challenges.filter(c => c.status === 'en_cours')
  const totalParticipants = challenges.reduce((sum, c) => sum + (c.participants || 0), 0)
  const totalPrize = challenges.reduce((sum, c) => sum + (c.prize_xof || 0), 0)

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
                { icon: Target, number: `${activeChallenges.length}+`, label: "Défis actifs" },
                { icon: Users, number: `${totalParticipants}+`, label: "Participants" },
                { icon: Trophy, number: `${(totalPrize / 1000000).toFixed(1)}M+`, label: "XOF en prix" }
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

      {/* Challenges List */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un défi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>
          </div>

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

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges
              .filter((challenge) => 
                selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
              )
              .map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-100 rounded-2xl p-12 shadow-sm border border-gray-200 mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Vous avez une idée de défi IA ?
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
      </section>
    </div>
  )
}
