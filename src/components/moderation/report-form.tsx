'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle, Flag, Send, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'

interface ReportFormProps {
  entityType: 'project' | 'article' | 'comment' | 'user';
  entityId: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ReportForm({ entityType, entityId, onClose, onSuccess }: ReportFormProps) {
  const { user } = useAuth()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    severity: 'low' as 'low' | 'medium' | 'high' | 'critical'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const reportReasons = [
    { value: 'spam', label: 'Spam ou contenu promotionnel' },
    { value: 'inappropriate', label: 'Contenu inapproprié' },
    { value: 'harassment', label: 'Harcèlement ou intimidation' },
    { value: 'hate_speech', label: 'Discours de haine' },
    { value: 'violence', label: 'Contenu violent' },
    { value: 'misinformation', label: 'Désinformation' },
    { value: 'copyright', label: 'Violation de droits d\'auteur' },
    { value: 'privacy', label: 'Violation de la vie privée' },
    { value: 'other', label: 'Autre' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          reporter_id: user.id,
          reason: formData.reason,
          description: formData.description,
          severity: formData.severity,
          status: 'pending'
        })

      if (reportError) {
        setError('Erreur lors de la création du signalement: ' + reportError.message)
        return
      }

      setSuccess(true)
      if (onSuccess) onSuccess()
      
      // Reset form
      setFormData({ reason: '', description: '', severity: 'low' })
      
      // Close form after 2 seconds
      setTimeout(() => {
        if (onClose) onClose()
      }, 2000)
    } catch (err) {
      setError('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour signaler du contenu.
          </p>
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
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          Signaler du contenu
        </CardTitle>
        <CardDescription>
          Aidez-nous à maintenir une communauté saine en signalant les contenus inappropriés.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Flag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Signalement envoyé
            </h3>
            <p className="text-gray-600">
              Merci pour votre signalement. Notre équipe de modération l'examinera rapidement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="reason">Raison du signalement</Label>
              <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une raison" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Gravité</Label>
              <Select value={formData.severity} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData(prev => ({ ...prev, severity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez le problème en détail..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={!formData.reason || !formData.description || loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Signaler
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

