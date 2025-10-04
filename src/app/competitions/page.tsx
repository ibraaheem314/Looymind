'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, Trophy, Calendar, Users, 
  TrendingUp, Clock, Award, Target,
  Brain, Eye, BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Competition {
  id: string
  title: string
  slug: string
  short_description: string
  cover_image_url: string
  category: string
  difficulty: string
  metric_type: string
  start_date: string
  end_date: string
  status: string
  participants_count: number
  submissions_count: number
  prize_amount: number
  prize_description: string
}

const CATEGORIES = [
  { value: 'data-science', label: 'Data Science', icon: BarChart3, color: 'bg-blue-100 text-blue-800' },
  { value: 'nlp', label: 'NLP', icon: Brain, color: 'bg-purple-100 text-purple-800' },
  { value: 'computer-vision', label: 'Computer Vision', icon: Eye, color: 'bg-green-100 text-green-800' },
  { value: 'prediction', label: 'Prédiction', icon: TrendingUp, color: 'bg-orange-100 text-orange-800' }
]

const DIFFICULTIES = [
  { value: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Avancé', color: 'bg-orange-100 text-orange-800' },
  { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
]

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchCompetitions()
  }, [selectedCategory, selectedStatus])

  const fetchCompetitions = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('competitions')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching competitions:', error)
        return
      }

      setCompetitions(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompetitions = competitions.filter(comp =>
    comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryConfig = (category: string) => {
    return CATEGORIES.find(c => c.value === category) || CATEGORIES[0]
  }

  const getDifficultyConfig = (difficulty: string) => {
    return DIFFICULTIES.find(d => d.value === difficulty) || DIFFICULTIES[0]
  }

  const getStatusBadge = (status: string, endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (status === 'completed') {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Terminé</Badge>
    }
    if (status === 'upcoming') {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Bientôt</Badge>
    }
    if (daysLeft <= 7) {
      return <Badge variant="outline" className="bg-red-100 text-red-800">🔥 {daysLeft}j restants</Badge>
    }
    return <Badge variant="outline" className="bg-green-100 text-green-800">Actif</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-100 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Design professionnel cohérent */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/20">
        {/* Decorative elements - subtils */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5 mb-4">
                Compétitions IA & Data Science
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Résolvez des défis réels,<br/>
                <span className="text-cyan-500">gagnez des prix</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Participez à des compétitions de data science, développez vos compétences en IA et gagnez des prix en FCFA.
              </p>
              
              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-cyan-600">{competitions.reduce((acc, c) => acc + c.participants_count, 0)}+</strong> participants
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-cyan-600">{competitions.length}</strong> défis actifs
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="text-sm text-slate-600">
                  Prix en <strong className="text-cyan-600">FCFA</strong> 🇸🇳
                </div>
              </div>

              <Link href="/competitions/create">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/30">
                  <Trophy className="h-5 w-5 mr-2" />
                  Créer une Compétition
                </Button>
              </Link>
            </div>

            {/* Right: Competition preview mockup */}
            <div className="hidden lg:block">
              <Card className="bg-white border-2 border-cyan-200 shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-all hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                    🔥 7j restants
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    Actif
                  </Badge>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Prédiction Prix Immobilier Dakar</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Utilisez le ML pour prédire les prix de l'immobilier à Dakar.
                </p>
                <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-slate-100">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-0 text-xs">
                    Débutant
                  </Badge>
                  <span className="font-semibold text-green-600">500K FCFA</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    123
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    245
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher une compétition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-slate-200 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">Toutes catégories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="all">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="upcoming">Bientôt</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des compétitions */}
        {filteredCompetitions.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Aucune compétition trouvée</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Les compétitions arrivent bientôt !'}
            </p>
            <Link href="/competitions/create">
              <Button variant="outline">
                Créer la première compétition
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompetitions.map((competition) => {
              const categoryConfig = getCategoryConfig(competition.category)
              const difficultyConfig = getDifficultyConfig(competition.difficulty)
              const CategoryIcon = categoryConfig.icon

              return (
                <Link key={competition.id} href={`/competitions/${competition.slug}`}>
                  <Card className="group hover:shadow-md hover:border-cyan-200 transition-all duration-200 h-full border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${categoryConfig.color} border-0 text-xs`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {categoryConfig.label}
                        </Badge>
                        {getStatusBadge(competition.status, competition.end_date)}
                      </div>
                      
                      <CardTitle className="group-hover:text-cyan-600 transition-colors line-clamp-2 text-lg">
                        {competition.title}
                      </CardTitle>
                      
                      <CardDescription className="line-clamp-2 text-sm">
                        {competition.short_description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Difficulté et métrique */}
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className={`${difficultyConfig.color} border-0 text-xs`}>
                          {difficultyConfig.label}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-0 text-xs">
                          {competition.metric_type.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-xs">{competition.participants_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5" />
                          <span className="text-xs">{competition.submissions_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs">{format(new Date(competition.end_date), 'dd MMM', { locale: fr })}</span>
                        </div>
                      </div>

                      {/* Prix (si disponible) */}
                      {competition.prize_amount ? (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                          <Award className="h-4 w-4" />
                          {competition.prize_amount.toLocaleString()} FCFA
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400">Aucun prix</div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

