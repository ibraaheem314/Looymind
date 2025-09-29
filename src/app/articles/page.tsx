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
  published: boolean
  created_at: string
  updated_at: string
  author?: {
    id: string
    display_name: string
    role: string
  }
}

export default function ArticlesPage() {
  const { user, profile } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState('')

  const categories = [
    { value: 'all', label: 'Tous les articles' },
    { value: 'ia', label: 'Intelligence Artificielle' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'deep-learning', label: 'Deep Learning' },
    { value: 'nlp', label: 'NLP' },
    { value: 'computer-vision', label: 'Computer Vision' },
    { value: 'big-data', label: 'Big Data' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'dev', label: 'Développement' },
    { value: 'tutorial', label: 'Tutoriel' },
    { value: 'news', label: 'Actualités' }
  ]

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      
      // Données mockées en attendant la création des tables Supabase
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Introduction au Machine Learning avec Python',
          slug: 'introduction-machine-learning-python',
          content: 'Contenu complet de l\'article...',
          excerpt: 'Découvrez les bases du machine learning avec Python. Ce guide complet vous accompagne dans vos premiers pas en IA.',
          author_id: 'user1',
          category: 'machine-learning',
          tags: ['Python', 'Machine Learning', 'IA', 'Tutoriel'],
          likes_count: 45,
          comments_count: 12,
          views_count: 234,
          published: true,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          author: {
            id: 'user1',
            display_name: 'Dr. Aminata Diallo',
            role: 'mentor'
          }
        },
        {
          id: '2',
          title: 'Deep Learning pour la Vision par Ordinateur',
          slug: 'deep-learning-vision-ordinateur',
          content: 'Contenu complet de l\'article...',
          excerpt: 'Explorez les réseaux de neurones convolutifs et leur application dans la reconnaissance d\'images.',
          author_id: 'user2',
          category: 'deep-learning',
          tags: ['Deep Learning', 'CNN', 'Computer Vision', 'TensorFlow'],
          likes_count: 67,
          comments_count: 8,
          views_count: 189,
          published: true,
          created_at: '2024-01-12T14:30:00Z',
          updated_at: '2024-01-12T14:30:00Z',
          author: {
            id: 'user2',
            display_name: 'Prof. Moussa Ndiaye',
            role: 'mentor'
          }
        },
        {
          id: '3',
          title: 'Analyse de Sentiment en Wolof avec NLP',
          slug: 'analyse-sentiment-wolof-nlp',
          content: 'Contenu complet de l\'article...',
          excerpt: 'Développez un modèle NLP pour analyser les sentiments dans des textes en wolof.',
          author_id: 'user3',
          category: 'nlp',
          tags: ['NLP', 'Wolof', 'Sentiment Analysis', 'Python'],
          likes_count: 34,
          comments_count: 15,
          views_count: 156,
          published: true,
          created_at: '2024-01-10T09:15:00Z',
          updated_at: '2024-01-10T09:15:00Z',
          author: {
            id: 'user3',
            display_name: 'Fatou Sall',
            role: 'member'
          }
        }
      ]

      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setArticles(mockArticles)
    } catch (err) {
      setError('Erreur lors du chargement des articles')
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Articles
              </h1>
              <p className="text-gray-600">Découvrez les derniers articles de la communauté</p>
            </div>
            {user && (
              <Link href="/articles/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Écrire un article
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchArticles} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Aucun article trouvé' : 'Aucun article disponible'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Essayez avec d\'autres mots-clés ou parcourez toutes les catégories.'
                  : 'Soyez le premier à partager vos connaissances avec la communauté !'
                }
              </p>
              {user && !searchTerm && (
                <Link href="/articles/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Écrire le premier article
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href={`/articles/${article.slug}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {categories.find(c => c.value === article.category)?.label || article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Eye className="h-3 w-3" />
                        {article.views_count}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-slate-600 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>{article.author?.display_name || 'Anonyme'}</span>
                        {article.author?.role && (
                          <Badge className={`text-xs ${getRoleColor(article.author.role)}`}>
                            {article.author.role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {article.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {article.comments_count}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
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