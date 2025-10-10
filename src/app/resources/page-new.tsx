'use client'

import { useState, useEffect } from 'react'
import { useResources } from '@/hooks/useResources'
import { ResourceCard } from '@/components/resources/resource-card'
import { ResourceFilters } from '@/components/resources/resource-filters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, BookOpen, Loader2, ArrowUpDown, Plus, Sparkles, 
  TrendingUp, GraduationCap, ArrowRight, Target, Clock, LogIn
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

type RecommendationItem = {
  id: string
  title: string
  url: string
  description: string | null
  level: string | null
  domains: string[]
  duration_minutes: number | null
  lang: string | null
  quality_score: number
  why: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>()
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>()
  const [selectedType, setSelectedType] = useState<string>()
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent')
  
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [loadingRecos, setLoadingRecos] = useState(false)

  const { user, profile } = useAuth()
  const router = useRouter()
  const canCreateResource = profile?.role === 'admin' || profile?.role === 'mentor'

  const { resources, loading, error } = useResources({
    category: selectedCategory,
    difficulty: selectedDifficulty,
    resourceType: selectedType,
    searchQuery,
    sortBy
  })

  // Fetch recommendations si user connecté et onboarding complété
  useEffect(() => {
    if (user && profile?.level && profile?.goals && profile.goals.length > 0) {
      fetchRecommendations()
    }
  }, [user, profile])

  const fetchRecommendations = async () => {
    if (!user) return

    setLoadingRecos(true)
    try {
      const res = await fetch(`/api/recommendations?user_id=${user.id}&limit=6`)
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data.items || [])
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoadingRecos(false)
    }
  }

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

  const hasOnboarding = user && profile?.level && profile?.goals && profile.goals.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-1.5 mb-4">
              Centre de Ressources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Apprends l'IA avec des <br/>
              <span className="text-green-600">ressources de qualité</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Cours, tutoriels, vidéos et outils sélectionnés. <br className="hidden sm:block"/>
              Organisés en parcours guidés pour apprendre étape par étape.
            </p>
            
            {/* Stats inline */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  <strong className="text-green-600">{resources.length}</strong> ressources
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
          </div>

          {/* Barre de recherche */}
          <div className="mt-8">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Section 1: Recommandations personnalisées (si connecté et onboarding complété) */}
        {hasOnboarding && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Recommandé pour toi</h2>
                  <p className="text-sm text-slate-600">Basé sur ton profil et tes objectifs</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/onboarding')}
                className="text-cyan-700 hover:text-cyan-900"
              >
                Ajuster mes préférences
              </Button>
            </div>

            {loadingRecos ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((item) => (
                  <Card key={item.id} className="border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-xl transition-all group bg-gradient-to-br from-white to-cyan-50/30">
                    <CardContent className="p-5">
                      <div className="mb-3">
                        <Badge className="bg-cyan-600 text-white text-xs mb-2">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Pour toi
                        </Badge>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-cyan-700 transition-colors">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.level && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800">
                            {item.level}
                          </Badge>
                        )}
                        {item.duration_minutes && (
                          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-300 text-slate-700">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.round(item.duration_minutes / 60)}h
                          </Badge>
                        )}
                        {item.lang && (
                          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-800">
                            {item.lang}
                          </Badge>
                        )}
                      </div>

                      {/* Pourquoi */}
                      {item.why && (
                        <div className="mb-4 p-2.5 bg-cyan-50 border border-cyan-200 rounded-lg">
                          <p className="text-xs text-cyan-900">
                            <strong>Pourquoi ?</strong> {item.why}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <Button asChild size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          Commencer
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-slate-300 bg-slate-50">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 mb-4">
                    On prépare tes recommandations personnalisées...
                  </p>
                  <Button onClick={fetchRecommendations} size="sm" variant="outline">
                    Générer mes recommandations
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* CTA Onboarding si pas connecté ou pas complété */}
        {!hasOnboarding && (
          <section>
            <Card className="border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Obtiens des recommandations personnalisées
                    </h3>
                    <p className="text-slate-700 mb-4">
                      {!user 
                        ? "Connecte-toi et réponds à 4 questions rapides pour obtenir des ressources adaptées à ton niveau et tes objectifs."
                        : "Réponds à 4 questions rapides pour obtenir des ressources adaptées à ton niveau et tes objectifs."
                      }
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {!user ? (
                        <>
                          <Button asChild className="bg-[#2d5986] hover:bg-[#1e3a5f] text-white">
                            <Link href="/auth/login?redirect=/resources">
                              <LogIn className="h-4 w-4 mr-2" />
                              Se connecter
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href="/auth/register?redirect=/resources">
                              Créer un compte
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          <Link href="/onboarding">
                            <Target className="h-4 w-4 mr-2" />
                            Commencer (2 min)
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Section 2: Parcours guidés */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Parcours guidés</h2>
                <p className="text-sm text-slate-600">Apprends étape par étape avec nos tracks</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/resources/paths">
                Voir tous les parcours
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Track 1 */}
            <Card className="border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-green-100 text-green-800 text-xs mb-3">
                    Débutant
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    🌱 Débuter en IA/ML
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Les fondamentaux de l'intelligence artificielle et du machine learning
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Python & NumPy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Algorithmes de base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Projet pratique</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/resources/paths">
                    Commencer le parcours
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Track 2 */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-blue-100 text-blue-800 text-xs mb-3">
                    Intermédiaire
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    🚀 Data Scientist Junior
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Analyse de données, modèles prédictifs et visualisation
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Pandas & Scikit-learn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Modèles supervisés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Projets portfolio</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/resources/paths">
                    Commencer le parcours
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Track 3 */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Badge className="bg-purple-100 text-purple-800 text-xs mb-3">
                    Avancé
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    🤖 NLP & LLMs
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Traitement du langage naturel et modèles de langage avancés
                  </p>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Transformers & BERT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>GPT & Fine-tuning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span>Applications réelles</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/resources/paths">
                    Commencer le parcours
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Bibliothèque complète avec filtres */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Bibliothèque complète</h2>
              <p className="text-sm text-slate-600">Explore toutes les ressources disponibles</p>
            </div>
          </div>

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

              {/* CTA Admin */}
              {canCreateResource && (
                <div className="mt-8 text-center">
                  <Button asChild variant="outline" className="border-green-300 text-green-800 hover:bg-green-50">
                    <Link href="/resources/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une nouvelle ressource
                    </Link>
                  </Button>
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
    </div>
  )
}

