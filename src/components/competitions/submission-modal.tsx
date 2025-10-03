'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Upload, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface SubmissionModalProps {
  competitionId: string
  competitionSlug: string
  userId: string
  onSuccess?: () => void
}

export default function SubmissionModal({ 
  competitionId, 
  competitionSlug,
  userId,
  onSuccess 
}: SubmissionModalProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Vérifier le type de fichier (CSV)
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Seuls les fichiers CSV sont acceptés')
        setFile(null)
        return
      }
      
      // Vérifier la taille (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Le fichier ne doit pas dépasser 10MB')
        setFile(null)
        return
      }
      
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // 1. Upload du fichier vers Supabase Storage
      const fileName = `${userId}/${competitionSlug}/${Date.now()}_${file.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('competition-submissions')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError(`Erreur d'upload: ${uploadError.message}`)
        setLoading(false)
        return
      }

      // 2. Obtenir l'URL du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('competition-submissions')
        .getPublicUrl(fileName)

      // 3. Créer la soumission en DB
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          competition_id: competitionId,
          user_id: userId,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          description: description,
          status: 'pending'
        }])
        .select()
        .single()

      if (submissionError) {
        console.error('Submission error:', submissionError)
        setError(`Erreur de soumission: ${submissionError.message}`)
        setLoading(false)
        return
      }

      setSuccess(true)
      setFile(null)
      setDescription('')
      
      // Fermer le modal après 2 secondes
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        if (onSuccess) onSuccess()
      }, 2000)

    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Upload className="h-4 w-4 mr-2" />
          Soumettre une solution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Soumettre une solution</DialogTitle>
          <DialogDescription>
            Uploadez votre fichier de prédictions au format CSV
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Fichier CSV *</Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            {file && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement votre approche..."
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Soumission réussie ! Évaluation en cours...</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !file}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? 'Upload...' : 'Soumettre'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

