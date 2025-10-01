'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, Heart, Reply, Edit, Trash2, MoreHorizontal,
  Send, ThumbsUp, ThumbsDown, Flag, User, Clock
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Comment {
  id: string
  content: string
  author_id: string
  author_name: string
  author_avatar: string
  created_at: string
  updated_at: string
  is_edited: boolean
  parent_id?: string
  replies?: Comment[]
  likes_count: number
  user_liked: boolean
}

interface ProjectCommentsProps {
  projectId: string
  onCommentCountChange?: (count: number) => void
}

export default function ProjectComments({ projectId, onCommentCountChange }: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [projectId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('project_comments')
        .select(`
          id, content, author_id, created_at, updated_at, is_edited, parent_id,
          author:profiles!author_id(display_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return
      }

      // Organiser les commentaires en arbre (parents + réponses)
      const commentsMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      data?.forEach((comment: any) => {
        const formattedComment: Comment = {
          id: comment.id,
          content: comment.content,
          author_id: comment.author_id,
          author_name: comment.author?.display_name || 'Anonyme',
          author_avatar: comment.author?.avatar_url || '',
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          is_edited: comment.is_edited,
          parent_id: comment.parent_id,
          likes_count: 0, // TODO: Implémenter les likes de commentaires
          user_liked: false,
          replies: []
        }

        commentsMap.set(comment.id, formattedComment)

        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id)
          if (parent) {
            if (!parent.replies) parent.replies = []
            parent.replies.push(formattedComment)
          }
        } else {
          rootComments.push(formattedComment)
        }
      })

      setComments(rootComments)
      
      // Calculer le nombre total de commentaires
      const totalCount = rootComments.reduce((sum, comment) => {
        return sum + 1 + (comment.replies?.length || 0)
      }, 0)
      
      if (onCommentCountChange) {
        onCommentCountChange(totalCount)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const { error } = await supabase
        .from('project_comments')
        .insert([{
          project_id: projectId,
          author_id: user.id,
          content: newComment.trim(),
          parent_id: replyingTo || null
        }])

      if (error) {
        setError('Erreur lors de l\'ajout du commentaire')
        return
      }

      setNewComment('')
      setReplyingTo(null)
      fetchComments()
    } catch (err) {
      setError('Erreur lors de l\'ajout du commentaire')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const { error } = await supabase
        .from('project_comments')
        .update({
          content: editContent.trim(),
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)

      if (error) {
        setError('Erreur lors de la modification')
        return
      }

      setEditingComment(null)
      setEditContent('')
      fetchComments()
    } catch (err) {
      setError('Erreur lors de la modification')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

    try {
      const { error } = await supabase
        .from('project_comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        setError('Erreur lors de la suppression')
        return
      }

      fetchComments()
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const canEditComment = (comment: Comment) => {
    return user?.id === comment.author_id
  }

  const canDeleteComment = (comment: Comment) => {
    return user?.id === comment.author_id
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {comment.author_avatar ? (
            <img
              src={comment.author_avatar}
              alt={comment.author_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-medium">
              {comment.author_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{comment.author_name}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
              {comment.is_edited && (
                <Badge variant="outline" className="text-xs">
                  Modifié
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              Répondre
            </Button>
            
            {canEditComment(comment) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingComment(comment.id)
                  setEditContent(comment.content)
                }}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
            )}
            
            {canDeleteComment(comment) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            )}
          </div>

          {/* Formulaire de réponse */}
          {replyingTo === comment.id && (
            <form onSubmit={handleSubmitComment} className="mt-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrivez votre réponse..."
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={submitting || !newComment.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  {submitting ? 'Envoi...' : 'Répondre'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setNewComment('')
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {/* Formulaire d'édition */}
          {editingComment === comment.id && (
            <form onSubmit={(e) => {
              e.preventDefault()
              handleEditComment(comment.id)
            }} className="mt-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={!editContent.trim()}>
                  Sauvegarder
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent('')
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {/* Réponses */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Commentaires
          {comments.length > 0 && (
            <Badge variant="outline">{comments.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Partagez vos retours et discutez du projet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire de nouveau commentaire */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez vos pensées sur ce projet..."
              rows={4}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Envoi...' : 'Commenter'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Connectez-vous pour commenter</p>
          </div>
        )}

        {/* Liste des commentaires */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">Aucun commentaire</p>
            <p className="text-sm">Soyez le premier à commenter ce projet !</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
