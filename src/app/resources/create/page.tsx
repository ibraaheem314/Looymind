'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Save, AlertCircle, CheckCircle,
  BookOpen, Video, FileText, Database, Wrench, BookMarked
} from 'lucide-react'
import Link from 'next/link'

const resourceTypes = [
  { value: 'tutorial', label: 'Tutoriel', icon: BookOpen },
  { value: 'documentation', label: 'Documentation', icon: FileText },
  { value: 'video', label: 'Vidéo', icon: Video },
  { value: 'dataset', label: 'Dataset', icon: Database },
  { value: 'tool', label: 'Outil', icon: Wrench },
  { value: 'book', label: 'Livre', icon: BookMarked }
]

const difficulties = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' }
]

const categories = [
  'Intelligence Artificielle',
  'Machine Learning',
  'Data Science',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing',
  'Cybersécurité',
  'Blockchain'
]

const tagSuggestions = [
  'Python', 'JavaScript', 'TensorFlow', 'PyTorch', 'React', 'Node.js',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'SQL', 'NoSQL',
  'API', 'REST', 'GraphQL', 'Débutant', 'Tutoriel', 'Projet', 'Gratuit'
]

export default function CreateResourcePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    resource_type: 'tutorial' as any,
    url: '',
    cover_image_url: '',
    category: categories[0],
    tags: [] as string[],
    difficulty: 'debutant' as any,
    is_free: true
  })

  const [currentTag, setCurrentTag] = useState('')

  // Vérifier les permissions
  useEffect(() => {
    if (!authLoading && (!user || (profile?.role !== 'admin' && profile?.role !== 'mentor'))) {
      router.push('/resources')
    }
  }, [user, profile, authLoading, router])

  // Auto-générer le slug
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim()
    if (normalizedTag && !formData.tags.includes(normalizedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, normalizedTag] }))
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Validation
      if (!formData.title || !formData.url || !formData.category) {
        setError('Veuillez remplir tous les champs obligatoires')
        setLoading(false)
        return
      }

      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Créer la ressource
      const { data, error: insertError } = await supabase
        .from('resources')
        .insert({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          resource_type: formData.resource_type,
          url: formData.url,
          cover_image_url: formData.cover_image_url || null,
          category: formData.category,
          tags: formData.tags,
          difficulty: formData.difficulty,
          is_free: formData.is_free,
          author_id: user?.id
        })
        .select()
        .single()

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push(`/resources/${formData.slug}`)
      }, 1500)
    } catch (err: any) {
      console.error('Error creating resource:', err)
      setError(err.message || 'Une erreur est survenue lors de la création de la ressource')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (!user || (profile?.role !== 'admin' && profile?.role !== 'mentor')) {
    return null // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/resources">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux ressources
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Ajouter une ressource
          </h1>
          <p className="text-gray-600 mt-2">
            Partagez une ressource éducative avec la communauté
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Les informations essentielles de la ressource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Introduction au Machine Learning avec Python"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (généré automatiquement)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={e => handleInputChange('slug', e.target.value)}
                  placeholder="introduction-machine-learning-python"
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez brièvement cette ressource..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="url">URL de la ressource *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={e => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com/resource"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cover_image_url">Image de couverture (URL)</Label>
                <Input
                  id="cover_image_url"
                  type="url"
                  value={formData.cover_image_url}
                  onChange={e => handleInputChange('cover_image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Catégorisation */}
          <Card>
            <CardHeader>
              <CardTitle>Catégorisation</CardTitle>
              <CardDescription>
                Aidez les utilisateurs à trouver cette ressource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type de ressource *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {resourceTypes.map(type => {
                    const Icon = type.icon
                    const isSelected = formData.resource_type === type.value
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('resource_type', type.value)}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          isSelected
                            ? 'border-slate-800 bg-slate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-2 ${isSelected ? 'text-slate-800' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                          {type.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={e => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="difficulty">Niveau de difficulté *</Label>
                <div className="flex gap-3 mt-2">
                  {difficulties.map(diff => {
                    const isSelected = formData.difficulty === diff.value
                    return (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => handleInputChange('difficulty', diff.value)}
                        className={`flex-1 p-3 border-2 rounded-lg transition-colors ${
                          isSelected
                            ? 'border-slate-800 bg-slate-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                          {diff.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag(currentTag)
                      }
                    }}
                    placeholder="Ajouter un tag..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTag(currentTag)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-sm text-gray-600">Suggestions:</span>
                  {tagSuggestions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={formData.tags.includes(tag)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  id="is_free"
                  type="checkbox"
                  checked={formData.is_free}
                  onChange={e => handleInputChange('is_free', e.target.checked)}
                  className="w-4 h-4 text-slate-800 border-gray-300 rounded focus:ring-slate-500"
                />
                <Label htmlFor="is_free" className="cursor-pointer">
                  Cette ressource est gratuite
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>Ressource créée avec succès ! Redirection...</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/resources">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Publier la ressource
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
