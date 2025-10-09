'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, Filter, Grid, List, Plus, 
  Eye, Heart, MessageCircle, Users, 
  ExternalLink, Github, Calendar, 
  Code, Smartphone, Monitor, Brain, Database, FlaskConical
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Project {
  id: string
  title: string
  slug: string
  short_description: string
  cover_image_url: string
  project_type: string
  status: string
  visibility: string
  author_name: string
  author_avatar: string
  likes_count: number
  views_count: number
  comments_count: number
  collaborators_count: number
  created_at: string
  live_url: string
  github_url: string
  technologies: string[]
  tags: string[]
}

const PROJECT_TYPES = [
  { value: 'web', label: 'Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'IA', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent')
  const [filterFeatured, setFilterFeatured] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [selectedType, sortBy, filterFeatured])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('projects')
        .select(`
          id, title, slug, short_description, cover_image_url,
          project_type, status, visibility, created_at,
          live_url, github_url,
          likes_count, views_count, comments_count, collaborators_count,
          author:profiles!author_id(display_name, avatar_url)
        `)
        .eq('visibility', 'public')
        .eq('status', 'active')

      // Filtres
      if (selectedType !== 'all') {
        query = query.eq('project_type', selectedType)
      }

      if (filterFeatured) {
        query = query.eq('featured', true)
      }

      // Tri
      switch (sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false })
          break
        case 'trending':
          query = query.order('views_count', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(20)

      if (error) {
        console.error('Error fetching projects:', error)
        return
      }

      // Formater les données
      const formattedProjects = data?.map(project => ({
        ...project,
        author_name: project.author?.[0]?.display_name || 'Anonyme',
        author_avatar: project.author?.[0]?.avatar_url,
        technologies: [], // TODO: Récupérer les technologies
        tags: [] // TODO: Récupérer les tags
      })) || []

      setProjects(formattedProjects)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getProjectTypeConfig = (type: string) => {
    return PROJECT_TYPES.find(t => t.value === type) || PROJECT_TYPES[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-100 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-4 py-1.5 mb-4">
                Projets & Collaborations
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Partagez vos projets,<br/>
                <span className="text-purple-500">trouvez des collaborateurs</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Explorez les projets IA innovants du Sénégal, partagez vos créations et construisez ensemble.
              </p>
              
              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-purple-600">{projects.length}</strong> projets
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-purple-600">Open-source</strong>
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="text-sm text-slate-600">
                  Collaboratif 🇸🇳
                </div>
              </div>

              <Link href="/projects/create">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer un Projet
                </Button>
              </Link>
            </div>

            {/* Right: Project preview mockup */}
            <div className="hidden lg:block">
              <Card className="bg-white border-2 border-purple-200 shadow-xl overflow-hidden transform -rotate-1 hover:rotate-0 transition-all hover:shadow-2xl">
                <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Brain className="h-20 w-20 text-purple-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-pink-100 text-pink-700 border-0 text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      IA
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                      Actif
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Assistant IA en Wolof</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Chatbot conversationnel pour les langues locales sénégalaises.
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      234
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      45
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      3
                    </span>
                  </div>
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
                  placeholder="Rechercher des projets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 border-slate-200 focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Tous les types</option>
                {PROJECT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="trending">Tendance</option>
              </select>

              <Button
                variant={filterFeatured ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterFeatured(!filterFeatured)}
                className={filterFeatured ? "bg-purple-600 hover:bg-purple-700" : "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"}
              >
                <Filter className="h-4 w-4 mr-1" />
                Featured
              </Button>
            </div>

            {/* Mode d'affichage */}
            <div className="flex gap-1 border-2 border-slate-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{filteredProjects.length} projets trouvés</span>
            {selectedType !== 'all' && (
              <span>• Type: {getProjectTypeConfig(selectedType).label}</span>
            )}
            {filterFeatured && <span>• Featured uniquement</span>}
          </div>
        </div>

        {/* Liste des projets */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Code className="h-16 w-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Soyez le premier à créer un projet !'}
            </p>
            <Link href="/projects/create">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier projet
              </Button>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "space-y-4"
          }>
            {filteredProjects.map((project) => {
              const typeConfig = getProjectTypeConfig(project.project_type)
              const TypeIcon = typeConfig.icon

              return (
                <Card key={project.id} className="group hover:shadow-md hover:border-purple-200 transition-all duration-200 border border-slate-200 overflow-hidden">
                  <Link href={`/projects/${project.slug}`}>
                    <CardContent className="p-0">
                      {/* Image de couverture */}
                      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                        {project.cover_image_url ? (
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TypeIcon className="h-16 w-16 text-slate-300" />
                          </div>
                        )}
                        
                        {/* Badge type */}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${typeConfig.color} border-0 text-xs`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </div>

                        {/* Actions rapides */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1.5">
                            {project.live_url && (
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                <ExternalLink className="h-3.5 w-3.5 text-slate-700" />
                              </div>
                            )}
                            {project.github_url && (
                              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                                <Github className="h-3.5 w-3.5 text-slate-700" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                          {project.title}
                        </h3>

                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                          {project.short_description}
                        </p>

                        {/* Auteur */}
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                            {project.author_avatar ? (
                              <img
                                src={project.author_avatar}
                                alt={project.author_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                                {project.author_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-slate-600">{project.author_name}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="text-xs">{project.views_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            <span className="text-xs">{project.likes_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="text-xs">{project.comments_count}</span>
                          </div>
                          {project.collaborators_count > 0 && (
                            <div className="flex items-center gap-1 ml-auto">
                              <Users className="h-3.5 w-3.5" />
                              <span className="text-xs">{project.collaborators_count}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredProjects.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Voir plus de projets
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}