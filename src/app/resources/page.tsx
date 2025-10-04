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
      {/* Hero Section - Design Kaggle+Zindi */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Floating emojis */}
          <div className="absolute top-10 left-[10%] text-4xl opacity-20">📚</div>
          <div className="absolute top-24 right-[12%] text-3xl opacity-15">🎓</div>
          <div className="absolute bottom-16 left-[20%] text-3xl opacity-15">🔥</div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left: Text content */}
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Apprenez. <br/>
                <span className="text-green-500">Progressez.</span> <br/>
                Excellez.
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                Accédez à une bibliothèque complète de tutoriels, cours, vidéos et outils pour développer vos compétences en IA.
              </p>
              
              {/* Stats inline */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs">📖</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs">🎥</div>
                    <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs">🛠️</div>
                  </div>
                  <span className="text-sm text-slate-600">{resources.length} ressources</span>
                </div>
                <div className="text-sm text-slate-400">|</div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-green-500">Gratuit</span> & accessible
                </div>
              </div>

              {canCreateResource && (
                <Link href="/resources/create">
                  <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 border-0 shadow-lg shadow-green-500/30">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une Ressource
                  </Button>
                </Link>
              )}
            </div>

            {/* Right: Resource preview mockup */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 transform rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg">
                    📚
                  </div>
                  <div>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs mb-1">
                      Cours
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs ml-1">
                      Débutant
                    </Badge>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">Python pour la Data Science</h3>
                <p className="text-sm text-slate-600 mb-4">Maîtrisez les bases de Python pour l'analyse de données...</p>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-3 border-b border-slate-100">
                  <span>👁 1.2K vues</span>
                  <span>⭐ 4.8/5</span>
                  <span>⏱ 6h</span>
                </div>
                <Button size="sm" className="w-full bg-green-500 text-white hover:bg-green-600 border-0">
                  Commencer →
                </Button>
              </div>
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
                className="pl-12 pr-4 py-3 text-base border-slate-300 focus:border-green-500 focus:ring-green-500"
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
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
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
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
