'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Plus, Globe, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CreateResourcePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'external_course' as 'external_course' | 'local_course' | 'tool' | 'article' | 'video' | 'documentation' | 'tutorial',
    url: '',
    source: '',
    is_local: false,
    local_content: '',
    language: 'fr' as 'fr' | 'en' | 'wolof' | 'other',
    category: 'machine-learning' as string,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    duration_hours: '',
    is_free: true,
    has_certificate: false,
    price_fcfa: '',
    tags: [] as string[],
    curator_notes: '',
    thumbnail_url: '',
    featured: false
  })

  const [tagInput, setTagInput] = useState('')

  // Vérifier les permissions
  const canCreate = profile?.role === 'admin' || profile?.role === 'mentor'

  const categories = [
    { value: 'ia', label: 'Intelligence Artificielle' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'deep-learning', label: 'Deep Learning' },
    { value: 'nlp', label: 'NLP' },
    { value: 'computer-vision', label: 'Computer Vision' },
    { value: 'big-data', label: 'Big Data' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'dev', label: 'Développement' },
    { value: 'mathematics', label: 'Mathématiques' },
    { value: 'statistics', label: 'Statistiques' },
    { value: 'python', label: 'Python' },
    { value: 'r', label: 'R' },
    { value: 'other', label: 'Autre' }
  ]

  const types = [
    { value: 'external_course', label: 'Cours externe', icon: Globe },
    { value: 'local_course', label: 'Cours local 🇸🇳', icon: BookOpen },
    { value: 'video', label: 'Vidéo' },
    { value: 'article', label: 'Article' },
    { value: 'tutorial', label: 'Tutoriel' },
    { value: 'tool', label: 'Outil/Librairie' },
    { value: 'documentation', label: 'Documentation' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const supabase = createClient()

      // Validation
      if (!formData.title || !formData.description || !formData.category) {
        setError('Veuillez remplir tous les champs obligatoires')
        setLoading(false)
        return
      }

      if (formData.type === 'external_course' && !formData.url) {
        setError('Veuillez fournir l\'URL pour une ressource externe')
        setLoading(false)
        return
      }

      if (formData.type === 'local_course' && !formData.local_content) {
        setError('Veuillez fournir le contenu pour une ressource locale')
        setLoading(false)
        return
      }

      // Générer le slug à partir du titre
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Préparer les données
      const resourceData = {
        title: formData.title,
        slug,
        description: formData.description,
        type: formData.type,
        url: formData.url || null,
        source: formData.source || null,
        is_local: formData.is_local,
        local_content: formData.local_content || null,
        language: formData.language,
        category: formData.category,
        difficulty: formData.difficulty,
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        is_free: formData.is_free,
        has_certificate: formData.has_certificate,
        price_fcfa: formData.price_fcfa ? parseInt(formData.price_fcfa) : null,
        tags: formData.tags,
        curator_notes: formData.curator_notes || null,
        thumbnail_url: formData.thumbnail_url || null,
        featured: formData.featured,
        created_by: user?.id,
        status: 'published',
        visibility: 'public'
      }

      const { data, error: insertError } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single()

      if (insertError) {
        console.error('Error creating resource:', insertError)
        setError(`Erreur lors de la création : ${insertError.message}`)
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/resources`)
      }, 2000)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-slate-600 mb-4">Vous devez être connecté pour ajouter une ressource.</p>
            <Link href="/auth/login?redirect=/resources/create">
              <Button className="bg-green-500 hover:bg-green-600">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-slate-600 mb-4">
              Seuls les admins et mentors peuvent ajouter des ressources.
            </p>
            <Link href="/resources">
              <Button variant="outline">Retour aux ressources</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/resources" className="text-green-600 hover:text-green-700 text-sm font-medium">
            ← Retour aux ressources
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
            Ajouter une ressource éducative
          </h1>
          <p className="text-slate-600">
            Partagez une ressource externe (cours, vidéo, article) ou créez du contenu local 🇸🇳
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>
                Remplissez les informations sur la ressource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Titre */}
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Machine Learning avec Python"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (en français) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez la ressource, ce qu'elle couvre, pour qui elle est adaptée..."
                  rows={4}
                  required
                />
              </div>

              {/* Type de ressource */}
              <div>
                <Label>Type de ressource *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {types.map(type => (
                    <label
                      key={type.value}
                      className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.type === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            type: e.target.value as any,
                            is_local: e.target.value === 'local_course'
                          }))
                        }}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* URL (si externe) */}
              {formData.type !== 'local_course' && (
                <div>
                  <Label htmlFor="url">URL de la ressource *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              )}

              {/* Source */}
              <div>
                <Label htmlFor="source">Source / Plateforme</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="ex: Coursera, YouTube, Prof. Diallo (UCAD)"
                />
              </div>

              {/* Contenu local (si local_course) */}
              {formData.type === 'local_course' && (
                <div>
                  <Label htmlFor="local_content">Contenu (Markdown supporté)</Label>
                  <Textarea
                    id="local_content"
                    value={formData.local_content}
                    onChange={(e) => setFormData(prev => ({ ...prev, local_content: e.target.value }))}
                    placeholder="Écrivez votre cours ici..."
                    rows={10}
                  />
                </div>
              )}

              {/* Catégorie */}
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Difficulté + Langue */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Niveau *</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="language">Langue</Label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="wolof">Wolof</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              {/* Durée */}
              <div>
                <Label htmlFor="duration_hours">Durée (en heures)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: e.target.value }))}
                  placeholder="ex: 20"
                />
              </div>

              {/* Prix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <Label htmlFor="is_free" className="cursor-pointer">Gratuit</Label>
                </div>

                {!formData.is_free && (
                  <div>
                    <Label htmlFor="price_fcfa">Prix (FCFA)</Label>
                    <Input
                      id="price_fcfa"
                      type="number"
                      value={formData.price_fcfa}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_fcfa: e.target.value }))}
                      placeholder="ex: 50000"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="has_certificate"
                    checked={formData.has_certificate}
                    onChange={(e) => setFormData(prev => ({ ...prev, has_certificate: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <Label htmlFor="has_certificate" className="cursor-pointer">Certificat disponible</Label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tag-input">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ajouter un tag..."
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Notes du curateur */}
              <div>
                <Label htmlFor="curator_notes">Notes du curateur (pourquoi recommander cette ressource ?)</Label>
                <Textarea
                  id="curator_notes"
                  value={formData.curator_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, curator_notes: e.target.value }))}
                  placeholder="ex: Meilleur cours pour débuter, très pédagogique..."
                  rows={2}
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <Label htmlFor="thumbnail_url">URL de l'image miniature (optionnel)</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              {/* Featured (admins only) */}
              {profile?.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Ressource mise en avant (featured)
                  </Label>
                </div>
              )}

              {/* Error/Success messages */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Ressource créée avec succès ! Redirection...</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  {loading ? 'Création...' : 'Publier la ressource'}
                </Button>
                <Link href="/resources">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
