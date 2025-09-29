'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  parentId?: string;
  isReply?: boolean;
  loading?: boolean;
}

export default function CommentForm({ 
  onSubmit, 
  onCancel, 
  placeholder = "Partagez vos pensées...",
  parentId,
  isReply = false,
  loading = false
}: CommentFormProps) {
  const { user, profile } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4 text-center">
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour commenter.
          </p>
          <Button asChild>
            <a href="/login">Se connecter</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} alt={profile?.display_name} />
              <AvatarFallback>
                {profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.display_name || user.email}
                </p>
                {isReply && (
                  <p className="text-xs text-gray-500">
                    Répondre à un commentaire
                  </p>
                )}
              </div>
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting || loading}
                required
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-gray-500">
                  {content.length}/1000 caractères
                </div>
                
                <div className="flex items-center space-x-2">
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onCancel}
                      disabled={isSubmitting || loading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || isSubmitting || loading}
                    className="bg-slate-800 hover:bg-slate-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Publication...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        {isReply ? 'Répondre' : 'Commenter'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

