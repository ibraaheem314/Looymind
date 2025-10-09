'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Save, Eye, Plus, X, AlertCircle, CheckCircle, BookOpen,
  Trash2, Loader2, FileText, Tag, BookMarked
} from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CreateArticlePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [loadingDraft, setLoadingDraft] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'ia',
    tags: [] as string[],
    markAsResource: false, // Nouvelle option
    coverImage: '',
  })

  const [newTag, setNewTag] = useState('')
  
  // Load draft if editing
  useEffect(() => {
    const draftParam = searchParams?.get('draft')
    
    if (draftParam) {
      setDraftId(draftParam)
      loadDraft(draftParam)
    }
  }, [searchParams])

  const categories = [
    { value: 'tutorial', label: 'Tutoriel (How-to)', icon: '📚' },
    { value: 'competition-analysis', label: 'Analyse de Compétition', icon: '🏆' },
    { value: 'feedback', label: 'Retour d\'Expérience', icon: '💡' },
    { value: 'best-practices', label: 'Best Practices', icon: '⭐' },
    { value: 'technique', label: 'Technique & Méthode', icon: '🔬' },
    { value: 'dataset-exploration', label: 'Exploration de Dataset', icon: '📊' },
    { value: 'model-optimization', label: 'Optimisation de Modèle', icon: '⚡' },
    { value: 'feature-engineering', label: 'Feature Engineering', icon: '🛠️' }
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

  const loadDraft = async (id: string) => {
    try {
      setLoadingDraft(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('status', 'draft')
        .single()
      
      if (error) {
        console.error('Error loading draft:', error)
        setError('Impossible de charger le brouillon')
        return
      }

      if (data) {
        setFormData({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category || 'ia',
          tags: data.tags || [],
          markAsResource: false,
          coverImage: data.cover_image_url || '',
        })
      }
    } catch (err) {
      console.error('Error loading draft:', err)
      setError('Erreur lors du chargement du brouillon')
    } finally {
      setLoadingDraft(false)
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

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user) {
      setError('Vous devez être connecté pour créer un article')
      return
    }

    // Validation différente selon le statut
    if (status === 'published') {
      // Validation stricte pour publication
      if (!formData.title.trim()) {
        setError('Le titre est requis pour publier')
        return
      }
      if (!formData.content.trim()) {
        setError('Le contenu est requis pour publier')
        return
      }
      if (!formData.excerpt.trim()) {
        setError('Un extrait est requis pour publier')
        return
      }
    } else {
      // Validation minimale pour brouillon
      if (!formData.title.trim() && !formData.content.trim()) {
        setError('Au moins un titre ou du contenu est requis pour sauvegarder un brouillon')
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
      } else if (status === 'draft') {
        // Pour les brouillons sans titre, générer un slug temporaire
        slug = `draft-${Date.now()}-${Math.random().toString(36).substring(7)}`
      } else {
        throw new Error('Le titre est requis pour publier')
      }

      const articleData = {
        title: formData.title.trim() || 'Brouillon sans titre',
        slug: draftId ? undefined : slug, // Ne pas regénérer le slug si c'est une édition
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: formData.tags,
        cover_image_url: formData.coverImage || null,
        author_id: user.id,
        status,
        updated_at: new Date().toISOString()
      }

      let result
      if (draftId) {
        // Update existing draft
        result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', draftId)
          .select()
          .single()
      } else {
        // Create new article
        result = await supabase
          .from('articles')
          .insert([articleData])
          .select()
          .single()
      }

      if (result.error) {
        console.error('Supabase error:', result.error)
        throw result.error
      }

      if (!result.data) {
        throw new Error('Aucune donnée retournée après la sauvegarde')
      }

      console.log('Article saved successfully:', result.data)
      setSuccess(true)

      // Redirection après un court délai
      const redirectUrl = status === 'published' 
        ? `/articles/${result.data.slug}` 
        : '/dashboard'
      
      console.log('Redirecting to:', redirectUrl)
      
      setTimeout(() => {
        router.push(redirectUrl)
      }, 500)
    } catch (err: any) {
      console.error('❌ Error saving article:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      
      // Messages d'erreur plus clairs
      let errorMessage = 'Erreur lors de l\'enregistrement de l\'article'
      
      if (err.message?.includes('permission') || err.message?.includes('policy')) {
        errorMessage = 'Erreur de permissions. Vérifiez que vous êtes connecté.'
      } else if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
        errorMessage = 'Un article avec ce titre existe déjà. Veuillez changer le titre.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!draftId || !user) return

    try {
      setDeleteLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', draftId)
        .eq('author_id', user.id)

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error deleting article:', err)
      setError('Erreur lors de la suppression de l\'article')
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (loadingDraft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Non connecté</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour créer un article.</p>
            <Link href="/auth/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/articles">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {draftId ? 'Modifier l\'article' : 'Nouvel article'}
                </h1>
                <p className="text-sm text-slate-600">
                  {draftId ? 'Modifiez et publiez votre article' : 'Partagez vos connaissances avec la communauté'}
                </p>
              </div>
            </div>

            {draftId && (
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
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informations principales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre de l'article *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Introduction au Machine Learning avec Python"
                    className="text-lg font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Extrait (résumé) *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Un court résumé de votre article (2-3 phrases)"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.excerpt.length}/200 caractères
                  </p>
                </div>

                <div>
                  <Label htmlFor="coverImage">Image de couverture (URL)</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => handleInputChange('coverImage', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu de l'article *</CardTitle>
                <CardDescription>
                  Rédigez votre article en Markdown (support complet)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="## Introduction&#10;&#10;Votre contenu ici...&#10;&#10;### Section 1&#10;&#10;Lorem ipsum..."
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Markdown supporté : **gras**, *italique*, `code`, [lien](url), etc.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catégorie *</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
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
                  />
                  <Button size="sm" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="pl-3 pr-1">
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

            {/* Mark as Resource */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-green-600" />
                  Ressource éducative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.markAsResource}
                    onChange={(e) => handleInputChange('markAsResource', e.target.checked)}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">Marquer comme ressource</p>
                    <p className="text-slate-600 mt-1">
                      Votre article apparaîtra dans la section "Ressources" pour aider la communauté
                    </p>
                  </div>
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
                  onClick={() => handleSubmit('published')}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
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
                      Publier maintenant
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

            {/* Messages */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {success && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Article enregistré avec succès !</p>
                  </div>
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
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
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
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

