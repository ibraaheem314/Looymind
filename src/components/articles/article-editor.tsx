'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, Eye, Upload, X, Plus, Tag } from 'lucide-react'
import { useArticles } from '@/hooks/useArticles'
import { useAuth } from '@/hooks/useAuth'

interface ArticleEditorProps {
  article?: any
  onSave?: (article: any) => void
  onCancel?: () => void
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const { createArticle, updateArticle } = useArticles()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    category: article?.category || 'IA',
    tags: article?.tags || [],
    image_url: article?.image_url || '',
    featured: article?.featured || false
  })

  const [newTag, setNewTag] = useState('')

  const categories = [
    'IA',
    'Data Science',
    'Machine Learning',
    'Tutoriel',
    'Actualité',
    'Projet'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire')
      return
    }

    if (!formData.content.trim()) {
      setError('Le contenu est obligatoire')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const articleData = {
        ...formData,
        status: publish ? 'published' : 'draft',
        published_at: publish ? new Date().toISOString() : undefined
      }

      let savedArticle
      if (article) {
        savedArticle = await updateArticle(article.id, articleData)
      } else {
        savedArticle = await createArticle(articleData)
      }

      setSuccess(publish ? 'Article publié avec succès' : 'Article sauvegardé comme brouillon')
      onSave?.(savedArticle)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {article ? 'Modifier l\'article' : 'Nouvel article'}
            </CardTitle>
            <CardDescription>
              {article ? 'Modifiez votre article' : 'Créez un nouvel article pour la communauté'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Brouillon'}
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={loading}
            >
              <Eye className="h-4 w-4 mr-2" />
              {loading ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Messages d'erreur/succès */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'article *
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Un titre accrocheur pour votre article"
            className="text-lg"
          />
        </div>

        {/* Extrait */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Extrait
          </label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Un court résumé de votre article (optionnel)"
            rows={3}
          />
        </div>

        {/* Catégorie et image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image
            </label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Contenu de l'article *
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Écrivez votre article ici... Vous pouvez utiliser du Markdown pour le formatage."
            rows={15}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Support du Markdown : **gras**, *italique*, # titres, etc.
          </p>
        </div>

        {/* Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Article à la une</span>
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
