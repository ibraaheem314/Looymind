'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Save, Eye, Plus, X, AlertCircle, CheckCircle 
} from 'lucide-react'
import Link from 'next/link'

export default function CreateArticlePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'ia',
    tags: [] as string[],
    published: false
  })

  const [newTag, setNewTag] = useState('')

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
    { value: 'tutorial', label: 'Tutoriel' },
    { value: 'news', label: 'Actualités' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, newTag.trim().toLowerCase()] 
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
  }

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault()
    
    if (!user) {
      setError('Vous devez être connecté pour créer un article')
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Le titre et le contenu sont obligatoires')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const slug = generateSlug(formData.title)
      
      // Generate excerpt if not provided
      const excerpt = formData.excerpt.trim() || 
        formData.content.substring(0, 200).trim() + '...'

      const articleData = {
        title: formData.title.trim(),
        slug,
        content: formData.content.trim(),
        excerpt,
        author_id: user.id,
        category: formData.category,
        tags: formData.tags,
        published: publish,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single()

      if (error) {
        setError('Erreur lors de la création de l\'article')
        console.error('Error creating article:', error)
        return
      }

      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        if (publish) {
          router.push(`/articles/${slug}`)
        } else {
          router.push('/articles')
        }
      }, 1500)

    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour créer un article.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/articles">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Créer un article</h1>
                <p className="text-gray-600">Partagez vos connaissances avec la communauté</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          
          {/* Title & Category */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Titre, catégorie et description de votre article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'article *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Guide complet du Machine Learning en 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="excerpt">Résumé (optionnel)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Un bref résumé de votre article..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si vide, les 200 premiers caractères du contenu seront utilisés
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu de l'article</CardTitle>
              <CardDescription>
                Rédigez le contenu principal de votre article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Rédigez votre article ici... Vous pouvez utiliser du Markdown."
                  rows={15}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez utiliser la syntaxe Markdown pour formater votre texte
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Ajoutez des mots-clés pour aider les utilisateurs à trouver votre article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Article créé avec succès !</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Link href="/articles">
              <Button variant="outline">
                Annuler
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                variant="outline"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
              </Button>
              <Button 
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
              >
                <Eye className="h-4 w-4 mr-2" />
                {loading ? 'Publication...' : 'Publier l\'article'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}