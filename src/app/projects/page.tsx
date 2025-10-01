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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
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
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Découvrez les Projets IA du Sénégal 🚀
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Explorez les innovations, partagez vos créations et collaborez avec la communauté
            </p>
            
            {/* Actions rapides */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/projects/create">
                <Button size="lg" className="bg-white text-slate-800 hover:bg-gray-100 border-0">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer un Projet
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="bg-white/90 text-slate-800 hover:bg-white border-0">
                <Github className="h-5 w-5 mr-2" />
                Voir sur GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des projets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">Tous les types</option>
                {PROJECT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="trending">Tendance</option>
              </select>

              <Button
                variant={filterFeatured ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterFeatured(!filterFeatured)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Featured
              </Button>
            </div>

            {/* Mode d'affichage */}
            <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
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
          <div className="text-center py-12">
            <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Soyez le premier à créer un projet !'}
            </p>
            <Link href="/projects/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier projet
              </Button>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredProjects.map((project) => {
              const typeConfig = getProjectTypeConfig(project.project_type)
              const TypeIcon = typeConfig.icon

              return (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-200">
                  <Link href={`/projects/${project.slug}`}>
                    <CardContent className="p-0">
                      {/* Image de couverture */}
                      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                        {project.cover_image_url ? (
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <TypeIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Badge type */}
                        <div className="absolute top-3 left-3">
                          <Badge className={`${typeConfig.color} border-0`}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeConfig.label}
                          </Badge>
                        </div>

                        {/* Actions rapides */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            {project.live_url && (
                              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {project.github_url && (
                              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                <Github className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-slate-600">
                            {project.title}
                          </h3>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {project.short_description}
                        </p>

                        {/* Auteur */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                            {project.author_avatar ? (
                              <img
                                src={project.author_avatar}
                                alt={project.author_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                {project.author_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{project.author_name}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {project.views_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {project.likes_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {project.comments_count}
                          </div>
                          {project.collaborators_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {project.collaborators_count}
                            </div>
                          )}
                        </div>

                        {/* Date */}
                        <div className="mt-3 text-xs text-gray-400">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}
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