'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Upload, Image as ImageIcon, Link as LinkIcon, Github, ExternalLink, 
  Play, FileText, Plus, X, Save, Eye, Settings, Users, Tag,
  Monitor, Smartphone, Brain, Database, FlaskConical, Code
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const PROJECT_TYPES = [
  { value: 'web', label: 'Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'IA', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

const TECHNOLOGY_CATEGORIES = [
  'frontend', 'backend', 'database', 'tool', 'framework', 'library', 'language', 'platform'
]

const TECHNOLOGY_OPTIONS = [
  // Frontend
  'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Tailwind CSS', 'Bootstrap', 'Sass',
  // Backend
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Supabase', 'Firebase',
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // AI/ML
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Hugging Face', 'LangChain',
  // Cloud
  'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean', 'Docker', 'Kubernetes',
  // Mobile
  'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Swift', 'Kotlin', 'Cordova',
  // Tools
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Figma', 'Sketch', 'Adobe XD'
]

const TAG_OPTIONS = [
  'Innovation', 'Open Source', 'Startup', 'Éducation', 'Santé', 'Finance', 'E-commerce', 'Social',
  'Gaming', 'IoT', 'Blockchain', 'Cybersecurity', 'DevOps', 'UI/UX', 'Performance', 'Accessibility',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Science', 'Analytics'
]

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    project_type: 'web',
    status: 'active',
    visibility: 'public',
    cover_image_url: '',
    gallery_urls: [] as string[],
    live_url: '',
    github_url: '',
    demo_url: '',
    documentation_url: '',
    started_at: '',
    completed_at: '',
    launched_at: '',
    technologies: [] as Array<{
      technology: string
      category: string
      proficiency_level: string
    }>,
    tags: [] as string[]
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [newTechnology, setNewTechnology] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Attendre que l'authentification soit chargée
    if (!authLoading && !user) {
      // Rediriger vers login avec un paramètre de retour
      router.push('/login?redirect=/projects/create')
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTechnology = () => {
    if (newTechnology && !formData.technologies.find(t => t.technology === newTechnology)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, {
          technology: newTechnology,
          category: 'tool',
          proficiency_level: 'intermediate'
        }]
      }))
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const updateTechnology = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => 
        i === index ? { ...tech, [field]: value } : tech
      )
    }))
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
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

  const addGalleryUrl = () => {
    if (newGalleryUrl && !formData.gallery_urls.includes(newGalleryUrl)) {
      setFormData(prev => ({
        ...prev,
        gallery_urls: [...prev.gallery_urls, newGalleryUrl]
      }))
      setNewGalleryUrl('')
    }
  }

  const removeGalleryUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter(u => u !== url)
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (!user) {
        setError('Vous devez être connecté pour créer un projet')
        setLoading(false)
        return
      }

      // Validation
      if (!formData.title.trim()) {
        setError('Le titre est obligatoire')
        setLoading(false)
        return
      }

      if (!formData.description.trim()) {
        setError('La description est obligatoire')
        setLoading(false)
        return
      }

      const slug = generateSlug(formData.title)
      console.log('🔍 Creating project with data:', {
        title: formData.title,
        slug: slug,
        author_id: user.id
      })

      // Créer le projet
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          slug: slug,
          description: formData.description,
          short_description: formData.short_description,
          project_type: formData.project_type,
          status: formData.status,
          visibility: formData.visibility,
          cover_image_url: formData.cover_image_url,
          gallery_urls: formData.gallery_urls,
          live_url: formData.live_url,
          github_url: formData.github_url,
          demo_url: formData.demo_url,
          documentation_url: formData.documentation_url,
          started_at: formData.started_at || null,
          completed_at: formData.completed_at || null,
          launched_at: formData.launched_at || null,
          author_id: user.id
        }])
        .select()
        .single()

      console.log('📊 Project creation result:', { projectData, projectError })

      if (projectError) {
        console.error('❌ Project creation error:', projectError)
        setError(`Erreur lors de la création: ${projectError.message}`)
        setLoading(false)
        return
      }

      // Ajouter les technologies
      if (formData.technologies.length > 0) {
        console.log('🔧 Adding technologies:', formData.technologies)
        const technologiesData = formData.technologies.map(tech => ({
          project_id: projectData.id,
          technology: tech.technology,
          category: tech.category,
          proficiency_level: tech.proficiency_level
        }))

        const { error: techError } = await supabase
          .from('project_technologies')
          .insert(technologiesData)

        if (techError) {
          console.error('❌ Error adding technologies:', techError)
        } else {
          console.log('✅ Technologies added successfully')
        }
      }

      // Ajouter les tags
      if (formData.tags.length > 0) {
        console.log('🏷️ Adding tags:', formData.tags)
        const tagsData = formData.tags.map(tag => ({
          project_id: projectData.id,
          tag: tag
        }))

        const { error: tagError } = await supabase
          .from('project_tags')
          .insert(tagsData)

        if (tagError) {
          console.error('❌ Error adding tags:', tagError)
        } else {
          console.log('✅ Tags added successfully')
        }
      }

      console.log('🎉 Project created successfully, redirecting...')
      setSuccess(true)
      router.push(`/projects/${projectData.slug}`)
    } catch (err: any) {
      console.error('❌ Unexpected error:', err)
      setError(err?.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  // Afficher un loader pendant le chargement de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour créer un projet.</p>
            <Button onClick={() => router.push('/login?redirect=/projects/create')}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau projet</h1>
              <p className="text-gray-600 mt-1">Partagez votre création avec la communauté</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Éditer' : 'Aperçu'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Décrivez votre projet de manière claire et attractive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Titre du projet *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Mon super projet IA"
                  required
                />
              </div>

              <div>
                <Label htmlFor="short_description">Description courte</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Une phrase qui décrit votre projet"
                />
              </div>

              <div>
                <Label htmlFor="description">Description complète *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre projet en détail..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_type">Type de projet *</Label>
                  <select
                    id="project_type"
                    value={formData.project_type}
                    onChange={(e) => handleInputChange('project_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="active">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="archived">Archivé</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="visibility">Visibilité</Label>
                <select
                  id="visibility"
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="private">Privé</option>
                  <option value="unlisted">Non listé</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Images et médias */}
          <Card>
            <CardHeader>
              <CardTitle>Images et médias</CardTitle>
              <CardDescription>
                Ajoutez des images pour rendre votre projet attractif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="cover_image_url">Image de couverture</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label>Galerie d'images</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button type="button" onClick={addGalleryUrl}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.gallery_urls.length > 0 && (
                    <div className="space-y-2">
                      {formData.gallery_urls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                          <span className="flex-1 text-sm truncate">{url}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGalleryUrl(url)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liens externes */}
          <Card>
            <CardHeader>
              <CardTitle>Liens externes</CardTitle>
              <CardDescription>
                Ajoutez des liens vers votre projet en ligne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="live_url">Site web</Label>
                <Input
                  id="live_url"
                  value={formData.live_url}
                  onChange={(e) => handleInputChange('live_url', e.target.value)}
                  placeholder="https://monprojet.com"
                />
              </div>

              <div>
                <Label htmlFor="github_url">GitHub</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/username/projet"
                />
              </div>

              <div>
                <Label htmlFor="demo_url">Démo</Label>
                <Input
                  id="demo_url"
                  value={formData.demo_url}
                  onChange={(e) => handleInputChange('demo_url', e.target.value)}
                  placeholder="https://demo.monprojet.com"
                />
              </div>

              <div>
                <Label htmlFor="documentation_url">Documentation</Label>
                <Input
                  id="documentation_url"
                  value={formData.documentation_url}
                  onChange={(e) => handleInputChange('documentation_url', e.target.value)}
                  placeholder="https://docs.monprojet.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies utilisées</CardTitle>
              <CardDescription>
                Spécifiez les technologies, frameworks et outils utilisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Ajouter une technologie</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="React, Python, TensorFlow..."
                    list="technologies"
                  />
                  <datalist id="technologies">
                    {TECHNOLOGY_OPTIONS.map(tech => (
                      <option key={tech} value={tech} />
                    ))}
                  </datalist>
                  <Button type="button" onClick={addTechnology}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.technologies.length > 0 && (
                <div className="space-y-3">
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={tech.technology}
                          onChange={(e) => updateTechnology(index, 'technology', e.target.value)}
                          placeholder="Nom de la technologie"
                        />
                      </div>
                      <div>
                        <select
                          value={tech.category}
                          onChange={(e) => updateTechnology(index, 'category', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {TECHNOLOGY_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={tech.proficiency_level}
                          onChange={(e) => updateTechnology(index, 'proficiency_level', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="beginner">Débutant</option>
                          <option value="intermediate">Intermédiaire</option>
                          <option value="advanced">Avancé</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Ajoutez des tags pour faciliter la découverte de votre projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ajouter un tag</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Innovation, Open Source..."
                    list="tags"
                  />
                  <datalist id="tags">
                    {TAG_OPTIONS.map(tag => (
                      <option key={tag} value={tag} />
                    ))}
                  </datalist>
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Dates importantes</CardTitle>
              <CardDescription>
                Spécifiez les dates clés de votre projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="started_at">Date de début</Label>
                  <Input
                    id="started_at"
                    type="date"
                    value={formData.started_at}
                    onChange={(e) => handleInputChange('started_at', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="completed_at">Date de fin</Label>
                  <Input
                    id="completed_at"
                    type="date"
                    value={formData.completed_at}
                    onChange={(e) => handleInputChange('completed_at', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="launched_at">Date de lancement</Label>
                  <Input
                    id="launched_at"
                    type="date"
                    value={formData.launched_at}
                    onChange={(e) => handleInputChange('launched_at', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages d'erreur et succès */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">Projet créé avec succès !</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/projects')}
            >
              Annuler
            </Button>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={async () => {
                  // Sauvegarder comme brouillon
                  handleInputChange('status', 'draft')
                  // Attendre un peu que le state soit mis à jour
                  await new Promise(resolve => setTimeout(resolve, 100))
                  // Soumettre le formulaire
                  const form = document.querySelector('form') as HTMLFormElement
                  if (form) form.requestSubmit()
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder comme brouillon'}
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Publier le projet'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}