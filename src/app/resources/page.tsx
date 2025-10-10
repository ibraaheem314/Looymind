'use client'

import { useState } from 'react'
import { useResources } from '@/hooks/useResources'
import { ResourceCard } from '@/components/resources/resource-card'
import { ResourceFilters } from '@/components/resources/resource-filters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, BookOpen, Loader2, ArrowUpDown, Plus 
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>()
  const [selectedType, setSelectedType] = useState<string>()
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent')

  const { user, profile } = useAuth()
  const canCreateResource = profile?.role === 'admin' || profile?.role === 'mentor'

  const { resources, loading, error } = useResources({
    category: selectedCategory,
    difficulty: selectedDifficulty,
    resourceType: selectedType,
    searchQuery,
    sortBy
  })

  const handleClearFilters = () => {
    setSelectedCategory(undefined)
    setSelectedDifficulty(undefined)
    setSelectedType(undefined)
    setSearchQuery('')
  }

  const sortOptions = [
    { value: 'recent', label: 'Plus récent' },
    { value: 'popular', label: 'Plus populaire' },
    { value: 'views', label: 'Plus vu' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Design professionnel avec identité VERTE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/20">
        {/* Decorative elements - subtils en VERT */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-1.5 mb-4">
                Bibliothèque de Ressources
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Apprenez l'IA avec des <br/>
                <span className="text-green-600">ressources de qualité</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Cours, tutoriels, vidéos et outils sélectionnés, organisés en <strong>parcours guidés</strong> pour apprendre étape par étape.
              </p>
              
              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-green-600">{resources.length}</strong> ressources disponibles
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-green-600">100% Gratuit</span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="text-sm text-slate-600">
                  En français 🇸🇳
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/resources" className="inline-flex">
                  <Button size="sm" variant="outline" className="rounded-full px-4">Bibliothèque</Button>
                </Link>
                <Link href="/resources/paths" className="inline-flex">
                  <Button size="sm" className="rounded-full px-4 bg-[#2d5986] hover:bg-[#1e3a5f] text-white">Parcours</Button>
                </Link>
                {canCreateResource && (
                  <Link href="/resources/create">
                    <Button size="sm" variant="outline" className="rounded-full px-4 border-green-300 text-green-800 hover:bg-green-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une Ressource
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Resource preview mockup */}
            <div className="hidden lg:block">
              <Card className="bg-white border-2 border-green-200 shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs w-fit">
                      Cours
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs w-fit">
                      Débutant
                    </Badge>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Python pour la Data Science</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Maîtrisez les bases de Python pour l'analyse de données et le machine learning.
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1">👁 1.2K</span>
                  <span className="flex items-center gap-1">⭐ 4.8</span>
                  <span className="flex items-center gap-1">⏱ 6h</span>
                </div>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Commencer →
                </Button>
              </Card>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mt-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une ressource (titre, description, tags...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-2 border-slate-200 focus:border-green-500 focus:ring-green-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Filtres */}
          <aside className="lg:col-span-1">
            <div 
              className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#86efac transparent'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background: #bbf7d0;
                  border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: #86efac;
                }
              `}</style>
              <ResourceFilters
                selectedCategory={selectedCategory}
                selectedDifficulty={selectedDifficulty}
                selectedType={selectedType}
                onCategoryChange={setSelectedCategory}
                onDifficultyChange={setSelectedDifficulty}
                onTypeChange={setSelectedType}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content - Liste des ressources */}
          <main className="lg:col-span-3">
            {/* Filtres actifs */}
            {(selectedCategory || selectedDifficulty || selectedType || searchQuery) && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-green-900">Filtres actifs</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100 h-7"
                  >
                    Tout effacer
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="outline" className="bg-white border-green-300 text-green-800">
                      Recherche: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="outline" className="bg-white border-green-300 text-green-800">
                      Catégorie: {selectedCategory}
                    </Badge>
                  )}
                  {selectedDifficulty && (
                    <Badge variant="outline" className="bg-white border-green-300 text-green-800">
                      Difficulté: {selectedDifficulty}
                    </Badge>
                  )}
                  {selectedType && (
                    <Badge variant="outline" className="bg-white border-green-300 text-green-800">
                      Type: {selectedType}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Toolbar - Tri & Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-600">
                {loading ? (
                  <span>Chargement...</span>
                ) : (
                  <span>
                    <strong className="text-slate-900">{resources.length}</strong> ressource{resources.length !== 1 ? 's' : ''} trouvée{resources.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tri */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Liste des ressources */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-green-500" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4">Erreur : {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Aucune ressource trouvée
                </h3>
                <p className="text-slate-500 mb-6">
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {resources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onLike={() => {
                      if (user) {
                        console.log('Like resource:', resource.id)
                      }
                    }}
                    isLiked={false}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
