'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Trophy, ArrowLeft, Calendar, 
  Upload, AlertCircle, CheckCircle 
} from 'lucide-react'
import Link from 'next/link'

export default function CreateCompetitionPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'data-science',
    difficulty: 'intermediate',
    dataset_description: '',
    dataset_url: '',
    metric_type: 'accuracy',
    metric_description: '',
    evaluation_criteria: '',
    start_date: '',
    end_date: '',
    rules: '',
    prize_amount: '',
    prize_description: '',
    status: 'upcoming',
    visibility: 'public'
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/competitions/create')
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (!user) {
        setError('Vous devez être connecté pour créer une compétition')
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

      if (!formData.start_date || !formData.end_date) {
        setError('Les dates de début et fin sont obligatoires')
        setLoading(false)
        return
      }

      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)

      if (endDate <= startDate) {
        setError('La date de fin doit être après la date de début')
        setLoading(false)
        return
      }

      const slug = generateSlug(formData.title)

      // Créer la compétition
      const { data: competitionData, error: competitionError } = await supabase
        .from('competitions')
        .insert([{
          title: formData.title,
          slug: slug,
          description: formData.description,
          short_description: formData.short_description,
          category: formData.category,
          difficulty: formData.difficulty,
          dataset_description: formData.dataset_description,
          dataset_url: formData.dataset_url,
          metric_type: formData.metric_type,
          metric_description: formData.metric_description,
          evaluation_criteria: formData.evaluation_criteria,
          start_date: formData.start_date,
          end_date: formData.end_date,
          rules: formData.rules,
          prize_amount: formData.prize_amount ? parseInt(formData.prize_amount) : null,
          prize_description: formData.prize_description,
          status: formData.status,
          visibility: formData.visibility,
          created_by: user.id
        }])
        .select()
        .single()

      if (competitionError) {
        console.error('Error creating competition:', competitionError)
        setError(`Erreur lors de la création: ${competitionError.message}`)
        setLoading(false)
        return
      }

      setSuccess(true)
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push(`/competitions/${slug}`)
      }, 2000)

    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue')
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/competitions"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux compétitions
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Trophy className="h-10 w-10" />
            Créer une compétition
          </h1>
          <p className="text-xl text-white/80 mt-2">
            Proposez un défi à la communauté IA du Sénégal
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Les informations de base de votre compétition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de la compétition *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Détection de Fraude Mobile Money"
                  required
                />
              </div>

              <div>
                <Label htmlFor="short_description">Description courte *</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Résumé en une phrase de votre compétition"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description complète (Markdown) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée en Markdown (## pour les titres, - pour les listes, etc.)"
                  rows={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Utilisez Markdown pour formater votre description (## Titre, **gras**, - liste)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="data-science">Data Science</option>
                    <option value="nlp">NLP</option>
                    <option value="computer-vision">Computer Vision</option>
                    <option value="prediction">Prédiction</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulté *</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dataset et évaluation */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset et évaluation</CardTitle>
              <CardDescription>Informations sur les données et critères d'évaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dataset_description">Description du dataset *</Label>
                <Textarea
                  id="dataset_description"
                  value={formData.dataset_description}
                  onChange={(e) => handleInputChange('dataset_description', e.target.value)}
                  placeholder="Ex: Dataset de 100,000 transactions Mobile Money anonymisées"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dataset_url">URL du dataset (optionnel)</Label>
                <Input
                  id="dataset_url"
                  type="url"
                  value={formData.dataset_url}
                  onChange={(e) => handleInputChange('dataset_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric_type">Métrique d'évaluation *</Label>
                  <select
                    id="metric_type"
                    value={formData.metric_type}
                    onChange={(e) => handleInputChange('metric_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="accuracy">Accuracy</option>
                    <option value="f1">F1-Score</option>
                    <option value="rmse">RMSE</option>
                    <option value="mae">MAE</option>
                    <option value="auc">AUC-ROC</option>
                    <option value="custom">Personnalisé</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="metric_description">Description de la métrique</Label>
                  <Input
                    id="metric_description"
                    value={formData.metric_description}
                    onChange={(e) => handleInputChange('metric_description', e.target.value)}
                    placeholder="Ex: F1-Score: Moyenne harmonique"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="evaluation_criteria">Critères d'évaluation *</Label>
                <Textarea
                  id="evaluation_criteria"
                  value={formData.evaluation_criteria}
                  onChange={(e) => handleInputChange('evaluation_criteria', e.target.value)}
                  placeholder="Ex: - Utiliser uniquement le dataset fourni\n- Pas de données externes\n- Format CSV requis"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Règles et calendrier */}
          <Card>
            <CardHeader>
              <CardTitle>Règles et calendrier</CardTitle>
              <CardDescription>Définissez les règles et les dates de la compétition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rules">Règles de la compétition (Markdown) *</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder="## Règles\n\n1. Maximum 5 soumissions\n2. Code source obligatoire\n3. Pas de données externes"
                  rows={8}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Date de fin *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Statut *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="upcoming">À venir</option>
                    <option value="active">Actif</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="visibility">Visibilité *</Label>
                  <select
                    id="visibility"
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    required
                  >
                    <option value="public">Public</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prix (optionnel) */}
          <Card>
            <CardHeader>
              <CardTitle>Prix et récompenses (optionnel)</CardTitle>
              <CardDescription>Définissez les récompenses pour les gagnants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prize_amount">Montant du prix (FCFA)</Label>
                  <Input
                    id="prize_amount"
                    type="number"
                    value={formData.prize_amount}
                    onChange={(e) => handleInputChange('prize_amount', e.target.value)}
                    placeholder="Ex: 500000"
                  />
                </div>

                <div>
                  <Label htmlFor="prize_description">Description du prix</Label>
                  <Input
                    id="prize_description"
                    value={formData.prize_description}
                    onChange={(e) => handleInputChange('prize_description', e.target.value)}
                    placeholder="Ex: 1er prix: 300k, 2ème: 150k, 3ème: 50k"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages d'erreur et succès */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span>Compétition créée avec succès ! Redirection...</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/competitions')}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700"
            >
              {loading ? 'Création...' : 'Créer la compétition'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

