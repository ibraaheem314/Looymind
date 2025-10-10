'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, Image as ImageIcon, Link as LinkIcon, Github, ExternalLink, 
  Play, FileText, Plus, X, Save, Eye, Settings, Users, Tag, ArrowLeft,
  Monitor, Smartphone, Brain, Database, FlaskConical, Code, Loader2, Trash2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const PROJECT_TYPES = [
  { value: 'web', label: 'Application Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Application Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Application Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'Intelligence Artificielle', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data Science', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

const TECHNOLOGY_OPTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js',
  'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'PostgreSQL', 
  'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Flutter', 'React Native',
  'Tailwind CSS', 'Bootstrap', 'Sass', 'Git', 'GitHub', 'Firebase', 'Supabase', 'GraphQL', 'REST API'
]

const TAG_OPTIONS = [
  'Open Source', 'Innovation', 'Startup', 'Éducation', 'Santé', 'Finance', 'E-commerce',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Analysis', 'IoT',
  'Blockchain', 'Cybersecurity', 'DevOps', 'UI/UX', 'API', 'Cloud', 'Mobile First'
]

export default function CreateProjectPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    project_type: 'web',
    status: 'active',
    visibility: 'public',
    cover_image_url: '',
    live_url: '',
    github_url: '',
    demo_url: '',
    technologies: [] as string[],
    tags: [] as string[]
  })

  const [newTechnology, setNewTechnology] = useState('')
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const editParam = searchParams?.get('edit')
    if (editParam) {
      setProjectId(editParam)
      loadProject(editParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/projects/create')
    }
  }, [authLoading, user, router])

  const loadProject = async (id: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_technologies(technology)')
        .eq('id', id)
        .eq('author_id', user?.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          short_description: data.short_description || '',
          project_type: data.project_type || 'web',
          status: data.status || 'active',
          visibility: data.visibility || 'public',
          cover_image_url: data.cover_image_url || '',
          live_url: data.live_url || '',
          github_url: data.github_url || '',
          demo_url: data.demo_url || '',
          technologies: data.project_technologies?.map((t: any) => t.technology) || [],
          tags: data.tags || []
        })
      }
    } catch (err: any) {
      console.error('Error loading project:', err)
      setError('Erreur lors du chargement du projet')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!user) {
      setError('Vous devez être connecté pour créer un projet')
      return
    }

    // Validation différente selon le statut
    if (status === 'active') {
      // Validation stricte pour publication
      if (!formData.title.trim()) {
        setError('Le titre est requis pour publier')
        return
      }
      if (!formData.short_description.trim()) {
        setError('Une description courte est requise pour publier')
        return
      }
      if (!formData.description.trim()) {
        setError('Une description complète est requise pour publier')
        return
      }
    } else {
      // Validation minimale pour brouillon
      if (!formData.title.trim() && !formData.short_description.trim()) {
        setError('Au moins un titre ou une description est requis pour sauvegarder un brouillon')
        return
      }
    }

    try {
      setLoading(true)
      setError('')
      const supabase = createClient()

      // Générer un slug approprié
      let slug = ''
      if (formData.title.trim()) {
        slug = generateSlug(formData.title)
        
        // Vérifier l'unicité du slug
        let finalSlug = slug
        let counter = 1
        
        while (true) {
          const { data: existingProject } = await supabase
            .from('projects')
            .select('id')
            .eq('slug', finalSlug)
            .single()
          
          // Si pas de projet existant OU si c'est le même projet (édition)
          if (!existingProject || (projectId && existingProject.id === projectId)) {
            slug = finalSlug
            break
          }
          
          finalSlug = `${slug}-${counter}`
          counter++
        }
      } else if (status === 'draft') {
        // Pour les brouillons sans titre, générer un slug temporaire
        slug = `draft-project-${Date.now()}-${Math.random().toString(36).substring(7)}`
      } else {
        throw new Error('Le titre est requis pour publier')
      }

      const projectData = {
        title: formData.title.trim() || 'Projet brouillon sans titre',
        slug: projectId ? undefined : slug,
        description: formData.description,
        short_description: formData.short_description,
        project_type: formData.project_type,
        status,
        visibility: formData.visibility,
        cover_image_url: formData.cover_image_url || null,
        live_url: formData.live_url || null,
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        author_id: user.id,
        updated_at: new Date().toISOString()
      }

      let result
      if (projectId) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .select()
          .single()
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      // Insert technologies
      if (formData.technologies.length > 0) {
        const techData = formData.technologies.map(tech => ({
          project_id: result.data.id,
          technology: tech
        }))

        // Delete old technologies if editing
        if (projectId) {
          await supabase
            .from('project_technologies')
            .delete()
            .eq('project_id', projectId)
        }

        await supabase
          .from('project_technologies')
          .insert(techData)
      }

      // Insert tags
      if (formData.tags.length > 0) {
        const tagsData = formData.tags.map(tag => ({
          project_id: result.data.id,
          tag: tag
        }))

        // Delete old tags if editing
        if (projectId) {
          await supabase
            .from('project_tags')
            .delete()
            .eq('project_id', projectId)
        }

        await supabase
          .from('project_tags')
          .insert(tagsData)
      }

      // Redirection
      if (status === 'active') {
        router.push('/projects')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Error saving project:', err)
      setError(err.message || 'Erreur lors de l\'enregistrement du projet')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!projectId || !user) return

    try {
      setDeleteLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('author_id', user.id)

      if (error) throw error

      router.push('/projects')
    } catch (err: any) {
      console.error('Error deleting project:', err)
      setError('Erreur lors de la suppression du projet')
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {projectId ? 'Modifier le projet' : 'Nouveau projet'}
                </h1>
                <p className="text-sm text-slate-600">
                  {projectId ? 'Modifiez et publiez votre projet' : 'Créez et partagez votre projet avec la communauté'}
                </p>
              </div>
            </div>

            {projectId && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre du projet *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Assistant IA en Wolof"
                    className="text-lg font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Description courte *</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Un court résumé de votre projet (2-3 phrases)"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.short_description.length}/200 caractères
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description complète *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre projet en détail : objectif, fonctionnalités, impact..."
                    rows={10}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Markdown supporté : **gras**, *italique*, `code`, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="cover_image_url">Image de couverture (URL)</Label>
                  <Input
                    id="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Liens du projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="github_url">
                    <Github className="h-4 w-4 inline mr-2" />
                    GitHub Repository
                  </Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => handleInputChange('github_url', e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <Label htmlFor="live_url">
                    <ExternalLink className="h-4 w-4 inline mr-2" />
                    Site web / Application live
                  </Label>
                  <Input
                    id="live_url"
                    value={formData.live_url}
                    onChange={(e) => handleInputChange('live_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="demo_url">
                    <Play className="h-4 w-4 inline mr-2" />
                    Vidéo démo
                  </Label>
                  <Input
                    id="demo_url"
                    value={formData.demo_url}
                    onChange={(e) => handleInputChange('demo_url', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Project Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Type de projet *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PROJECT_TYPES.map(type => {
                  const Icon = type.icon
                  return (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.project_type === type.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="project_type"
                        value={type.value}
                        checked={formData.project_type === type.value}
                        onChange={(e) => handleInputChange('project_type', e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5 text-slate-600" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  )
                })}
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    placeholder="Ajouter une techno..."
                    className="flex-1"
                    list="tech-options"
                  />
                  <datalist id="tech-options">
                    {TECHNOLOGY_OPTIONS.map(tech => (
                      <option key={tech} value={tech} />
                    ))}
                  </datalist>
                  <Button size="sm" onClick={addTechnology} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="pl-3 pr-1">
                        {tech}
                        <button
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ajouter un tag..."
                    className="flex-1"
                    list="tag-options"
                  />
                  <datalist id="tag-options">
                    {TAG_OPTIONS.map(tag => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                  <Button size="sm" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="pl-3 pr-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  />
                  <span className="text-sm">🌍 Public - Visible par tous</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  />
                  <span className="text-sm">🔒 Privé - Visible par vous seulement</span>
                </label>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleSubmit('active')}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Publier le projet
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleSubmit('draft')}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme brouillon
                </Button>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-sm text-red-600">
                  {error}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible et supprimera également tous les commentaires, likes et collaborateurs associés.
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
    </div>
  )
}

