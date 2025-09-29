'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Eye, ArrowRight, Search, Filter, Plus, BookOpen, Star } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <BookOpen className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">Blog IA Sénégal</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Articles & Tutoriels
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez les dernières actualités, tutoriels et analyses sur l'intelligence artificielle au Sénégal.
              Partagez vos connaissances et apprenez des experts.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Écrire un article
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                Voir les tutoriels
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: BookOpen, number: `${articles.length}+`, label: "Articles publiés" },
                { icon: User, number: "25+", label: "Auteurs" },
                { icon: Eye, number: "15K+", label: "Lectures" }
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

      {/* Articles List */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Articles à la une
                </h2>
                <Button variant="outline" size="sm">
                  Voir tous
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.slice(0, 3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Tous les articles
              </h2>
              <div className="text-sm text-gray-600">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              </div>
            </div>
            
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Aucun article dans cette catégorie'}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Effacer la recherche
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-100 rounded-2xl p-12 shadow-sm border border-gray-200">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Vous avez une expertise à partager ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'auteurs et partagez vos connaissances en IA et Data Science.
              Contribuez à l'écosystème tech sénégalais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Écrire un article
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Devenir auteur
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
