'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, Plus, Heart, MessageCircle, Calendar, User, 
  BookOpen, TrendingUp, Filter, Eye
} from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author_id: string
  category: string
  tags: string[]
  likes_count: number
  comments_count: number
  views_count: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  author?: {
    id: string
    display_name: string
    role: string
    avatar_url?: string
  }
}

export default function TutorialsPage() {
  const { user, profile } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState('')

  const categories = [
    { value: 'all', label: 'Tous les tutoriels' },
    { value: 'tutorial', label: '📚 Tutoriel (How-to)' },
    { value: 'competition-analysis', label: '🏆 Analyse de Compétition' },
    { value: 'feedback', label: '💡 Retour d\'Expérience' },
    { value: 'best-practices', label: '⭐ Best Practices' },
    { value: 'technique', label: '🔬 Technique & Méthode' },
    { value: 'dataset-exploration', label: '📊 Exploration de Dataset' },
    { value: 'model-optimization', label: '⚡ Optimisation de Modèle' },
    { value: 'feature-engineering', label: '🛠️ Feature Engineering' }
  ]

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles(id, display_name, role, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        console.error('Error fetching articles:', fetchError)
        setError('Erreur lors du chargement des tutoriels')
        setArticles([])
        setLoading(false)
        return
      }
      
      const transformedArticles = (data || []).map((article: any) => ({
        ...article,
        author: Array.isArray(article.author) ? article.author[0] : article.author
      }))
      
      setArticles(transformedArticles as Article[])
      setLoading(false)
    } catch (err) {
      setError('Erreur lors du chargement des tutoriels')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'mentor': 'bg-blue-100 text-blue-800',
      'org': 'bg-purple-100 text-purple-800',
      'member': 'bg-gray-100 text-gray-800'
    }
    return colors[role as keyof typeof colors] || colors.member
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Design professionnel cohérent */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/20">
        {/* Decorative elements - subtils */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <Badge className="bg-blue-100 text-blue-700 border-0 text-sm px-4 py-1.5 mb-4">
                Tutoriels & Analyses IA
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Apprenez des meilleurs,<br/>
                <span className="text-blue-500">maîtrisez les compétitions</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Tutoriels, analyses de compétitions, retours d'expérience et best practices partagés par la communauté IA du Sénégal.
              </p>
              
              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-blue-600">{articles.length}</strong> tutoriels
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-blue-600">100%</strong> Francophone
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="text-sm text-slate-600">
                  Communauté active 🇸🇳
                </div>
              </div>

              {user && (
                <Link href="/articles/create">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                    <Plus className="h-5 w-5 mr-2" />
                    Écrire un Tutoriel
                  </Button>
                </Link>
              )}
            </div>

            {/* Right: Article preview mockup */}
            <div className="hidden lg:block">
              <Card className="bg-white border-2 border-blue-200 shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-all hover:shadow-2xl">
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs mb-3">
                  Machine Learning
                </Badge>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Introduction au NLP avec Python</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Découvrez les bases du traitement du langage naturel avec Python.
                </p>
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">Dr. Aminata Diallo</span>
                  <Badge className="bg-blue-50 text-blue-700 border-0 text-xs ml-auto">Mentor</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    456
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    67
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    12
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-4 bg-gray-200 m-5 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 mx-5 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 mx-5 mb-5 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchArticles}>
              Réessayer
            </Button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {searchTerm ? 'Aucun article trouvé' : 'Aucun article disponible'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés ou parcourez toutes les catégories.'
                : 'Soyez le premier à partager vos connaissances avec la communauté !'
              }
            </p>
            {user && !searchTerm && (
              <Link href="/articles/create">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Écrire le premier article
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map(article => (
              <Card key={article.id} className="group hover:shadow-md hover:border-blue-200 transition-all cursor-pointer border border-slate-200">
                <Link href={`/articles/${article.slug}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-0">
                        {categories.find(c => c.value === article.category)?.label || article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Eye className="h-3 w-3" />
                        {article.views_count}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors text-lg">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-slate-50 border-slate-200">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                          {article.author?.display_name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-xs">{article.author?.display_name || 'Anonyme'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span className="text-xs">{article.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span className="text-xs">{article.comments_count}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.created_at)}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
