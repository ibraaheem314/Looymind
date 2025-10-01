'use client'

import { useState } from 'react'
import { useResources } from '@/hooks/useResources'
import { ResourceCard } from '@/components/resources/resource-card'
import { ResourceFilters } from '@/components/resources/resource-filters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                <BookOpen className="h-10 w-10" />
                Ressources Éducatives
              </h1>
              <p className="text-slate-200 text-lg max-w-2xl">
                Accédez à une bibliothèque complète de tutoriels, cours, vidéos et outils 
                pour développer vos compétences en IA et Data Science.
              </p>
            </div>
            {canCreateResource && (
              <Link href="/resources/create">
                <Button className="bg-white text-slate-800 hover:bg-slate-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une ressource
                </Button>
              </Link>
            )}
          </div>

          {/* Barre de recherche */}
          <div className="mt-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une ressource (titre, description, tags...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Filtres */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
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
            {/* Toolbar - Tri & Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span>Chargement...</span>
                ) : (
                  <span>
                    <strong>{resources.length}</strong> ressource{resources.length !== 1 ? 's' : ''} trouvée{resources.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tri */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                <Loader2 className="h-12 w-12 animate-spin text-slate-800" />
              </div>
            ) : error ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-red-600">Erreur : {error}</p>
                </CardContent>
              </Card>
            ) : resources.length === 0 ? (
              <Card className="p-12 text-center">
                <CardContent>
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune ressource trouvée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {resources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onLike={() => {
                      if (user) {
                        // TODO: Implémenter toggleLike
                        console.log('Like resource:', resource.id)
                      }
                    }}
                    isLiked={false} // TODO: Vérifier si l'utilisateur a liké
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