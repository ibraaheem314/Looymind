'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, Github, ExternalLink, Users, Star, GitFork, Calendar, Code, Lightbulb, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/projects/project-card'

export default function ProjectsPage() {
  const { projects, loading, error } = useProjects()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const categories = [
    { id: 'all', name: 'Tous', count: projects.length },
    { id: 'IA & Machine Learning', name: 'IA & ML', count: projects.filter(p => p.category === 'IA & Machine Learning').length },
    { id: 'Data Science', name: 'Data Science', count: projects.filter(p => p.category === 'Data Science').length },
    { id: 'Web Development', name: 'Web Dev', count: projects.filter(p => p.category === 'Web Development').length },
    { id: 'Mobile Development', name: 'Mobile', count: projects.filter(p => p.category === 'Mobile Development').length },
    { id: 'DevOps', name: 'DevOps', count: projects.filter(p => p.category === 'DevOps').length },
    { id: 'Blockchain', name: 'Blockchain', count: projects.filter(p => p.category === 'Blockchain').length },
    { id: 'IoT', name: 'IoT', count: projects.filter(p => p.category === 'IoT').length },
    { id: 'Autre', name: 'Autre', count: projects.filter(p => p.category === 'Autre').length }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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
              <Code className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">Innovation Collaborative</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Projets Communautaires
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez, contribuez et lancez des projets IA qui transforment l'Afrique.
              Collaborez avec les meilleurs développeurs du continent.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700" asChild>
                <Link href="/projects/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Créer un projet
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                Explorer les catégories
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Lightbulb, number: `${projects.length}+`, label: "Projets actifs" },
                { icon: Users, number: "200+", label: "Contributeurs" },
                { icon: Star, number: "1.2k+", label: "Stars GitHub" }
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

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
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

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un projet par nom, technologie ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Aucun projet dans cette catégorie'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Effacer la recherche
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous ne trouvez pas votre projet idéal ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Créez votre propre projet et invitez la communauté à collaborer avec vous pour construire l'avenir de l'IA en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700" asChild>
                <Link href="/projects/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Créer un nouveau projet
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Charger plus de projets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}