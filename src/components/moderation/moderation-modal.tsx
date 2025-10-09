'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, Trash2, Ban, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

interface ModerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: 'article' | 'project' | 'comment'
  contentId: string
  contentTitle: string
  authorId: string
  authorName: string
  onSuccess?: () => void
}

type ActionType = 'delete' | 'ban' | 'warn' | null

export default function ModerationModal({
  open,
  onOpenChange,
  contentType,
  contentId,
  contentTitle,
  authorId,
  authorName,
  onSuccess
}: ModerationModalProps) {
  const [action, setAction] = useState<ActionType>(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleModerate = async () => {
    if (!action) {
      setError('Veuillez sélectionner une action')
      return
    }

    if (!reason.trim()) {
      setError('Veuillez indiquer une raison')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Enregistrer l'action de modération
      const { error: moderationError } = await supabase
        .from('moderation_actions')
        .insert([{
          content_type: contentType,
          content_id: contentId,
          action_type: action,
          reason: reason,
          target_user_id: authorId
        }])

      if (moderationError) throw moderationError

      // 2. Exécuter l'action selon le type
      switch (action) {
        case 'delete':
          await handleDelete()
          break
        case 'ban':
          await handleBan()
          break
        case 'warn':
          await handleWarn()
          break
      }

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 1500)

    } catch (err: any) {
      console.error('Moderation error:', err)
      setError(err.message || 'Erreur lors de la modération')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const tableName = contentType === 'article' ? 'articles' : 
                      contentType === 'project' ? 'projects' : 'comments'
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', contentId)

    if (error) throw error
  }

  const handleBan = async () => {
    // Bannir l'utilisateur
    const { error: banError } = await supabase
      .from('profiles')
      .update({ account_status: 'banned' })
      .eq('id', authorId)

    if (banError) throw banError

    // Supprimer aussi le contenu
    await handleDelete()

    // Enregistrer la sanction
    const { error: sanctionError } = await supabase
      .from('user_sanctions')
      .insert([{
        user_id: authorId,
        sanction_type: 'ban',
        reason: reason,
        duration_days: null // Permanent
      }])

    if (sanctionError) throw sanctionError
  }

  const handleWarn = async () => {
    // Juste enregistrer l'avertissement dans moderation_actions
    // Déjà fait au début de handleModerate
  }

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      case 'ban':
        return <Ban className="h-4 w-4" />
      case 'warn':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionColor = (actionType: ActionType) => {
    switch (actionType) {
      case 'delete':
        return 'destructive'
      case 'ban':
        return 'destructive'
      case 'warn':
        return 'default'
      default:
        return 'default'
    }
  }

  const resetAndClose = () => {
    setAction(null)
    setReason('')
    setError('')
    setSuccess(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Modération
          </DialogTitle>
          <DialogDescription>
            Prenez une action de modération sur ce contenu
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-700">Action effectuée avec succès !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info sur le contenu */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Type de contenu</span>
                <Badge variant="outline">
                  {contentType === 'article' && '📝 Article'}
                  {contentType === 'project' && '💼 Projet'}
                  {contentType === 'comment' && '💬 Commentaire'}
                </Badge>
              </div>
              <p className="text-sm text-slate-900 font-medium mb-1">{contentTitle}</p>
              <p className="text-xs text-slate-500">Par {authorName}</p>
            </div>

            {/* Sélection de l'action */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Action à effectuer *
              </label>
              <Select value={action || ''} onValueChange={(value) => setAction(value as ActionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une action">
                    {action === 'warn' && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span>Avertissement</span>
                      </div>
                    )}
                    {action === 'delete' && (
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span>Supprimer le contenu</span>
                      </div>
                    )}
                    {action === 'ban' && (
                      <div className="flex items-center gap-2">
                        <Ban className="h-4 w-4 text-red-700" />
                        <span>Bannir l'auteur + supprimer</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warn">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Avertissement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <span>Supprimer le contenu</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ban">
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-700" />
                      <span>Bannir l'auteur + supprimer</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Raison */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Raison * {action === 'ban' && <span className="text-red-600">(sera visible par l'utilisateur)</span>}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  action === 'warn' ? 'Ex: Langage inapproprié, merci de rester courtois' :
                  action === 'delete' ? 'Ex: Contenu hors-sujet / spam' :
                  action === 'ban' ? 'Ex: Violations répétées des règles de la communauté' :
                  'Indiquez la raison de cette action'
                }
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Warning pour les actions destructives */}
            {action === 'ban' && (
              <div className="flex items-start gap-2 text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200 text-sm">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Action irréversible</p>
                  <p className="text-xs">L'utilisateur sera banni définitivement et tout son contenu sera supprimé.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!success && (
            <>
              <Button
                variant="outline"
                onClick={resetAndClose}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                variant={action ? getActionColor(action) : 'default'}
                onClick={handleModerate}
                disabled={loading || !action}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    {action && getActionIcon(action)}
                    <span className="ml-2">Confirmer</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

