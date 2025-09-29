'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSubmissions } from '@/hooks/useSubmissions'
import { createClient } from '@/lib/supabase'

interface SubmissionFormProps {
  challengeId: string
  challengeTitle: string
  onSubmissionSuccess?: () => void
}

export default function SubmissionForm({ 
  challengeId, 
  challengeTitle, 
  onSubmissionSuccess 
}: SubmissionFormProps) {
  const { user, isAuthenticated } = useAuth()
  const { createSubmission } = useSubmissions(challengeId)
  const supabase = createClient()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    // Valider le fichier
    const allowedTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel']
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: 'Seuls les fichiers CSV sont acceptés' })
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Fichier trop volumineux (max 50MB)' })
      return
    }

    setFile(selectedFile)
    setMessage(null)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier' })
      return
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Veuillez donner un titre à votre soumission' })
      return
    }

    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Vous devez être connecté pour soumettre' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Upload du fichier vers Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`
      const filePath = `submissions/${challengeId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Créer la soumission en base
      const submissionData = {
        challenge_id: challengeId,
        title: title.trim(),
        description: description.trim(),
        file_url: uploadData.path,
        file_type: file.type,
        file_size: file.size
      }

      await createSubmission(submissionData)

      setMessage({ 
        type: 'success', 
        text: 'Soumission réussie ! Votre fichier est en cours d\'évaluation.' 
      })
      setFile(null)
      setTitle('')
      setDescription('')
      
      if (onSubmissionSuccess) {
        onSubmissionSuccess()
      }

    } catch (error) {
      console.error('Submission error:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la soumission' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Soumission requise</CardTitle>
          <CardDescription>
            Vous devez être connecté pour participer à ce défi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/login">Se connecter</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soumettre votre solution</CardTitle>
        <CardDescription>
          Uploadez votre fichier CSV de prédictions pour le défi "{challengeTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs de titre et description */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de votre soumission *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Modèle Random Forest v1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre approche, les techniques utilisées..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Zone de drop */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isSubmitting}
            />
            
            <div className="flex flex-col items-center space-y-4">
              {file ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-700">
                      Fichier sélectionné : {file.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Taille : {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 inline-flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Supprimer
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Glissez votre fichier CSV ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-gray-500">
                      Format CSV requis, taille max 20MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Message d'erreur/succès */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Informations sur les limitations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Règles de soumission :
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Format CSV obligatoire</li>
              <li>• Maximum 5 soumissions par jour</li>
              <li>• Taille maximale : 50MB</li>
              <li>• Votre meilleur score sera retenu pour le classement</li>
              <li>• Titre obligatoire pour chaque soumission</li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!file || !title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Soumission en cours...
              </>
            ) : (
              'Soumettre ma solution'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
