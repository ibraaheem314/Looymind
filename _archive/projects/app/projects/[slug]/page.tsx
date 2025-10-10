'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, Eye, MessageCircle, Users, ExternalLink, Github, 
  Calendar, Clock, Code, Smartphone, Monitor, Brain, Database, FlaskConical,
  Share2, Bookmark, Star, GitBranch, Download, Play, Pause, Settings,
  ChevronLeft, ChevronRight, Image as ImageIcon, Video, FileText, Mail, User,
  Trash2, Loader2, Edit, ArrowLeft, Shield
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import ModerationModal from '@/components/moderation/moderation-modal'
import { fr } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  cover_image_url: string
  gallery_urls: string[]
  project_type: string
  status: string
  visibility: string
  started_at: string
  completed_at: string
  launched_at: string
  live_url: string
  github_url: string
  demo_url: string
  documentation_url: string
  likes_count: number
  views_count: number
  comments_count: number
  collaborators_count: number
  created_at: string
  author_id: string
  author_name: string
  author_avatar: string
  author_bio: string
  technologies: Array<{
    technology: string
    category: string
    proficiency_level: string
  }>
  tags: string[]
  collaborators: Array<{
    id: string
    name: string
    avatar: string
    role: string
  }>
}

const PROJECT_TYPES = [
  { value: 'web', label: 'Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'IA', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showModerateModal, setShowModerateModal] = useState(false)
  
  const { user, profile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (slug) {
      fetchProject()
    }
  }, [slug])

  useEffect(() => {
    if (project && user) {
      checkIfLiked()
    }
  }, [project, user])

  const fetchProject = async () => {
    setLoading(true)
    try {
      console.log('🔍 Fetching project with slug:', slug)
      
      // Récupérer le projet de base d'abord
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      console.log('📊 Project fetch result:', { projectData, projectError })

      if (projectError) {
        console.error('❌ Error fetching project:', projectError)
        setLoading(false)
        return
      }

      // Récupérer l'auteur
      const { data: authorData } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, bio')
        .eq('id', projectData.author_id)
        .single()

      // Récupérer les technologies
      const { data: technologiesData } = await supabase
        .from('project_technologies')
        .select('technology, category, proficiency_level')
        .eq('project_id', projectData.id)

      // Récupérer les tags
      const { data: tagsData } = await supabase
        .from('project_tags')
        .select('tag')
        .eq('project_id', projectData.id)

      // Récupérer les collaborateurs
      const { data: collaboratorsData } = await supabase
        .from('project_collaborators')
        .select(`
          role,
          user:profiles!user_id(display_name, avatar_url)
        `)
        .eq('project_id', projectData.id)

      console.log('📦 Additional data fetched:', { 
        author: authorData, 
        technologies: technologiesData, 
        tags: tagsData,
        collaborators: collaboratorsData
      })

      // Formater les données
      const formattedProject: Project = {
        ...projectData,
        author_name: authorData?.display_name || 'Anonyme',
        author_avatar: authorData?.avatar_url || '',
        author_bio: authorData?.bio || '',
        technologies: technologiesData || [],
        tags: tagsData?.map((t: any) => t.tag) || [],
        collaborators: collaboratorsData?.map((c: any) => ({
          id: c.user?.id || '',
          name: c.user?.display_name || 'Anonyme',
          avatar: c.user?.avatar_url || '',
          role: c.role
        })) || []
      }
      
      console.log('✅ Formatted project:', formattedProject)

      setProject(formattedProject)
      setLikesCount(formattedProject.likes_count)
      setViewsCount(formattedProject.views_count)

      // Incrémenter les vues
      await incrementViews(formattedProject.id)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const incrementViews = async (projectId: string) => {
    try {
      // Utiliser project_views (table spécifique aux projets)
      const { error } = await supabase
        .from('project_views')
        .insert([{
          project_id: projectId,
          user_id: user?.id || null,
        }])
        .select()

      if (!error) {
        setViewsCount(prev => prev + 1)
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  const checkIfLiked = async () => {
    if (!user || !project) return

    try {
      console.log('🔍 Checking if user liked project...')
      const { data: likeData, error } = await supabase
        .from('likes')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .maybeSingle()

      console.log('📊 Like check result:', { likeData, error, hasLiked: !!likeData })
      setLiked(!!likeData)
    } catch (err) {
      console.error('Error checking if liked:', err)
    }
  }

  const toggleLike = async () => {
    if (!user) {
      alert('Vous devez être connecté pour aimer ce projet')
      return
    }
    
    if (!project) return

    try {
      console.log('🔍 Toggle like - Current state:', { liked, project_id: project.id, user_id: user.id })
      
      // D'abord, vérifier l'état RÉEL dans la base de données
      const { data: currentLike } = await supabase
        .from('likes')
        .select('id')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .maybeSingle()
      
      const actuallyLiked = !!currentLike
      console.log('🔍 Actual state in DB:', { actuallyLiked, currentLike })
      
      if (actuallyLiked) {
        // Remove like
        console.log('👎 Removing like...')
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('project_id', project.id)
          .eq('user_id', user.id)
        
        if (!error) {
          console.log('✅ Like removed successfully')
          setLiked(false)
          
          // Rafraîchir le compteur depuis la base de données
          const { data: updatedProject } = await supabase
            .from('projects')
            .select('likes_count')
            .eq('id', project.id)
            .single()
          
          if (updatedProject) {
            console.log('📊 Likes count refreshed from DB:', updatedProject.likes_count)
            setLikesCount(updatedProject.likes_count)
          }
        } else {
          console.error('❌ Error removing like:', error)
          alert(`Erreur: ${error.message}`)
        }
      } else {
        // Add like
        console.log('👍 Adding like...')
        const { data, error } = await supabase
          .from('likes')
          .insert([{
            project_id: project.id,
            user_id: user.id,
          }])
          .select()
        
        if (!error) {
          console.log('✅ Like added successfully:', data)
          setLiked(true)
          
          // Rafraîchir le compteur depuis la base de données
          const { data: updatedProject } = await supabase
            .from('projects')
            .select('likes_count')
            .eq('id', project.id)
            .single()
          
          if (updatedProject) {
            console.log('📊 Likes count refreshed from DB:', updatedProject.likes_count)
            setLikesCount(updatedProject.likes_count)
          }
        } else {
          console.error('❌ Error adding like:', error)
          alert(`Erreur: ${error.message}`)
        }
      }
    } catch (err) {
      console.error('❌ Unexpected error toggling like:', err)
      alert('Erreur inattendue')
    }
  }

  const handleDelete = async () => {
    if (!project || !user) return

    try {
      setDeleteLoading(true)

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .eq('author_id', user.id)

      if (error) throw error

      router.push('/projects')
    } catch (err: any) {
      console.error('Error deleting project:', err)
      alert('Erreur lors de la suppression du projet')
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const getProjectTypeConfig = (type: string) => {
    return PROJECT_TYPES.find(t => t.value === type) || PROJECT_TYPES[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h1>
          <p className="text-gray-600 mb-4">Ce projet n'existe pas ou n'est plus accessible.</p>
          <Link href="/projects">
            <Button>Retour aux projets</Button>
          </Link>
        </div>
      </div>
    )
  }

  const typeConfig = getProjectTypeConfig(project.project_type)
  const TypeIcon = typeConfig.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image de couverture */}
      <div className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-r from-slate-800 to-slate-700">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon className="h-24 w-24 text-white/50" />
            </div>
          )}
        </div>
        
        {/* Overlay avec infos */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <Badge className={`${typeConfig.color} border-0 mb-2`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeConfig.label}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                <p className="text-white/80 text-lg">
                  {project.short_description}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant={liked ? "default" : "secondary"}
                  size="sm"
                  onClick={toggleLike}
                  className={liked ? "bg-red-500 hover:bg-red-600 text-white border-0" : "bg-white/90 text-slate-800 hover:bg-white border-0"}
                >
                  <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-white' : ''}`} />
                  {likesCount}
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/90 text-slate-800 hover:bg-white border-0">
                  <Share2 className="h-4 w-4 mr-1" />
                  Partager
                </Button>
                <Button variant="secondary" size="sm" className="bg-white/90 text-slate-800 hover:bg-white border-0">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Link href="/projects" className="hover:text-slate-600 flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Projets
                </Link>
                <span>/</span>
                <span className="text-slate-600">{project.title}</span>
              </div>

              {/* Actions du projet */}
              <div className="flex items-center gap-2">
                {user ? (
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    className={liked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-white' : ''}`} />
                    {likesCount}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Connectez-vous pour aimer ce projet')}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {likesCount}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: project.title,
                        text: project.short_description,
                        url: window.location.href
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Lien copié dans le presse-papier !')
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Partager
                </Button>

                {user && user.id === project.author_id && (
                  <>
                    <Link href={`/projects/create?edit=${project.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </>
                )}

                {profile?.role === 'admin' && user?.id !== project.author_id && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowModerateModal(true)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Modérer
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </>
                )}

                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs de contenu */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
                <TabsTrigger value="comments">Commentaires</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>À propos du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Liens externes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Liens du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <ExternalLink className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Site web</div>
                            <div className="text-sm text-gray-500">Voir en ligne</div>
                          </div>
                        </a>
                      )}
                      
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <Github className="h-5 w-5 text-gray-700" />
                          <div>
                            <div className="font-medium">Code source</div>
                            <div className="text-sm text-gray-500">Voir sur GitHub</div>
                          </div>
                        </a>
                      )}
                      
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <Play className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">Démo</div>
                            <div className="text-sm text-gray-500">Voir la démo</div>
                          </div>
                        </a>
                      )}
                      
                      {project.documentation_url && (
                        <a
                          href={project.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium">Documentation</div>
                            <div className="text-sm text-gray-500">Guide d'utilisation</div>
                          </div>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                {project.gallery_urls && project.gallery_urls.length > 0 ? (
                  <div className="space-y-4">
                    {/* Image principale */}
                    <div className="relative">
                      <img
                        src={project.gallery_urls[activeImageIndex]}
                        alt={`${project.title} - Image ${activeImageIndex + 1}`}
                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                      />
                      
                      {/* Navigation */}
                      {project.gallery_urls.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setActiveImageIndex(prev => 
                              prev === 0 ? project.gallery_urls.length - 1 : prev - 1
                            )}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setActiveImageIndex(prev => 
                              prev === project.gallery_urls.length - 1 ? 0 : prev + 1
                            )}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {/* Miniatures */}
                    <div className="flex gap-2 overflow-x-auto">
                      {project.gallery_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                            index === activeImageIndex ? 'border-slate-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Miniature ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune image dans la galerie</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="technologies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technologies utilisées</CardTitle>
                    <CardDescription>
                      Stack technique et outils utilisés dans ce projet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.technologies.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.technologies.map((tech, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Code className="h-5 w-5 text-slate-600" />
                              <div>
                                <div className="font-medium">{tech.technology}</div>
                                <div className="text-sm text-gray-500 capitalize">{tech.category}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {tech.proficiency_level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune technologie spécifiée</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                {/* Importer le composant de commentaires une fois créé */}
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium mb-2">Commentaires à venir</p>
                  <p className="text-sm">Le système de commentaires sera disponible prochainement</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Auteur */}
            <Card>
              <CardHeader>
                <CardTitle>Créateur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {project.author_avatar ? (
                      <img
                        src={project.author_avatar}
                        alt={project.author_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-lg font-medium">
                        {project.author_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{project.author_name}</div>
                    <div className="text-sm text-gray-500">Créateur du projet</div>
                  </div>
                </div>
                
                {project.author_bio && (
                  <p className="text-sm text-gray-600 mb-4">{project.author_bio}</p>
                )}
                
                <div className="space-y-2">
                  <Link href={`/profile/${project.author_id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Voir le profil
                    </Button>
                  </Link>
                  
                  {user && user.id !== project.author_id && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full bg-slate-800 hover:bg-slate-700"
                      onClick={() => {
                        // Ouvrir un modal de contact ou rediriger vers une page de messagerie
                        window.location.href = `mailto:?subject=Contact via Palanteer - ${project.title}&body=Bonjour ${project.author_name},%0D%0A%0D%0AJe souhaite discuter de votre projet "${project.title}".%0D%0A%0D%0ACordialement`
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter l'auteur
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Collaborateurs */}
            {project.collaborators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Équipe</CardTitle>
                  <CardDescription>
                    {project.collaborators.length} collaborateur{project.collaborators.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {collaborator.avatar ? (
                            <img
                              src={collaborator.avatar}
                              alt={collaborator.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                              {collaborator.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{collaborator.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{collaborator.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Vues</span>
                    </div>
                    <span className="font-medium">{viewsCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <span className="font-medium">{likesCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Commentaires</span>
                    </div>
                    <span className="font-medium">{project.comments_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {project.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Créé le {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                  </div>
                  
                  {project.started_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Démarré le {format(new Date(project.started_at), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  )}
                  
                  {project.completed_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Terminé le {format(new Date(project.completed_at), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible et supprimera également tous les commentaires, likes, collaborateurs et toutes les données associées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer définitivement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Moderation Modal */}
      {profile?.role === 'admin' && project && (
        <ModerationModal
          open={showModerateModal}
          onOpenChange={setShowModerateModal}
          contentType="project"
          contentId={project.id}
          contentTitle={project.title}
          authorId={project.author_id}
          authorName={project.author_name}
          onSuccess={() => {
            router.push('/projects')
          }}
        />
      )}
    </div>
  )
}
