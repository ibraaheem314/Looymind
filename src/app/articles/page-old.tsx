'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Eye, ArrowRight, Search, Filter, Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useArticles } from '@/hooks/useArticles'
import ArticleCard from '@/components/articles/article-card'
import { useState } from 'react'

export default function ArticlesPage() {
  const { articles, loading, error, getPublishedArticles, getFeaturedArticles } = useArticles()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'Tous', count: articles.length },
    { id: 'IA', name: 'IA', count: articles.filter(a => a.category === 'IA').length },
    { id: 'Data Science', name: 'Data Science', count: articles.filter(a => a.category === 'Data Science').length },
    { id: 'Tutoriel', name: 'Tutoriel', count: articles.filter(a => a.category === 'Tutoriel').length },
    { id: 'Actualité', name: 'Actualité', count: articles.filter(a => a.category === 'Actualité').length },
    { id: 'Projet', name: 'Projet', count: articles.filter(a => a.category === 'Projet').length }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredArticles = getFeaturedArticles()
  const publishedArticles = getPublishedArticles()

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
  {
    id: 2,
    title: "Interview : Comment devenir Data Scientist au Sénégal",
    excerpt: "Rencontre avec Fatou Sarr, Data Scientist chez Orange Sénégal, qui partage son parcours.",
    author: "Ibrahima Fall",
    authorRole: "Journaliste Tech",
    publishedAt: "2024-01-12",
    readTime: "12 min",
    views: 890,
    category: "Interview",
    tags: ["Carrière", "Data Science", "Parcours"],
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 3,
    title: "Projet IA : Prédiction des récoltes au Sénégal",
    excerpt: "Étude de cas sur un projet d'IA agricole développé par des étudiants de l'UCAD.",
    author: "Prof. Moussa Diop",
    authorRole: "Professeur UCAD",
    publishedAt: "2024-01-10",
    readTime: "15 min",
    views: 2100,
    category: "Étude de cas",
    tags: ["Agriculture", "IA", "Projet"],
    image: "/api/placeholder/400/250",
    featured: true
  },
  {
    id: 4,
    title: "Les startups IA sénégalaises à suivre en 2024",
    excerpt: "Découvrez les startups les plus prometteuses du secteur IA au Sénégal.",
    author: "Khadija Ndiaye",
    authorRole: "Analyste Tech",
    publishedAt: "2024-01-08",
    readTime: "6 min",
    views: 1450,
    category: "Startup",
    tags: ["Startup", "Innovation", "2024"],
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 5,
    title: "Formation IA : Où se former au Sénégal ?",
    excerpt: "Guide complet des formations et certifications IA disponibles au Sénégal.",
    author: "Mariama Ba",
    authorRole: "Conseillère Formation",
    publishedAt: "2024-01-05",
    readTime: "10 min",
    views: 3200,
    category: "Formation",
    tags: ["Formation", "Certification", "Guide"],
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 6,
    title: "Défi IA : Classification des maladies du riz",
    excerpt: "Retour sur le défi organisé par l'ISRA avec 150 participants et des résultats prometteurs.",
    author: "Dr. Cheikh Ndiaye",
    authorRole: "Chercheur ISRA",
    publishedAt: "2024-01-03",
    readTime: "7 min",
    views: 1800,
    category: "Défi",
    tags: ["Défi", "Agriculture", "Résultats"],
    image: "/api/placeholder/400/250",
    featured: false
  }
]

const categories = [
  { id: 'all', label: 'Tous', count: articles.length },
  { id: 'Analyse', label: 'Analyse', count: articles.filter(a => a.category === 'Analyse').length },
  { id: 'Interview', label: 'Interview', count: articles.filter(a => a.category === 'Interview').length },
  { id: 'Étude de cas', label: 'Étude de cas', count: articles.filter(a => a.category === 'Étude de cas').length },
  { id: 'Startup', label: 'Startup', count: articles.filter(a => a.category === 'Startup').length },
  { id: 'Formation', label: 'Formation', count: articles.filter(a => a.category === 'Formation').length },
  { id: 'Défi', label: 'Défi', count: articles.filter(a => a.category === 'Défi').length }
]

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Articles & Ressources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les dernières actualités, analyses et success stories de l'écosystème IA sénégalais
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category.id === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles en vedette */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles en vedette</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articles.filter(article => article.featured).map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <Badge variant="outline">En vedette</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-slate-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="group">
                      Lire l'article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tous les articles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tous les articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    {article.featured && <Badge variant="outline">En vedette</Badge>}
                  </div>
                  <CardTitle className="text-lg group-hover:text-slate-600 transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="truncate">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="group">
                      Lire
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus d'articles
          </Button>
        </div>
      </div>
    </div>
  )
}
