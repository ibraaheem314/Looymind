'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, Send, ThumbsUp, Reply, MoreVertical,
  Trash2, Edit2, X, Check
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Comment {
  id: string
  content: string
  author_id: string
  parent_id: string | null
  article_id: string
  likes_count: number
  is_edited: boolean
  created_at: string
  updated_at: string
  author?: {
    id: string
    display_name: string
    avatar_url?: string
    role: string
  }
  replies?: Comment[]
}

interface CommentsSectionProps {
  articleId: string
  onCommentCountChange?: (count: number) => void
}

export default function CommentsSection({ articleId, onCommentCountChange }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(id, display_name, avatar_url, role)
        `)
        .eq('article_id', articleId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              author:profiles(id, display_name, avatar_url, role)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })

          return { ...comment, replies: replies || [] }
        })
      )

      setComments(commentsWithReplies as Comment[])
      
      // Calculer le nombre total de commentaires (parents + réponses)
      const totalCount = commentsWithReplies.reduce((sum, comment) => {
        return sum + 1 + (comment.replies?.length || 0)
      }, 0)
      
      // Notifier le parent du nouveau compteur
      if (onCommentCountChange) {
        onCommentCountChange(totalCount)
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return

    try {
      setSubmitting(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment.trim(),
          article_id: articleId,
          author_id: user.id
        }])

      if (error) throw error

      setNewComment('')
      await fetchComments()
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return

    try {
      setSubmitting(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('comments')
        .insert([{
          content: replyContent.trim(),
          article_id: articleId,
          author_id: user.id,
          parent_id: parentId
        }])

      if (error) throw error

      setReplyContent('')
      setReplyingTo(null)
      await fetchComments()
    } catch (err) {
      console.error('Error posting reply:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      setSubmitting(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('comments')
        .update({
          content: editContent.trim(),
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)

      if (error) throw error

      setEditingId(null)
      setEditContent('')
      await fetchComments()
    } catch (err) {
      console.error('Error editing comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      await fetchComments()
    } catch (err) {
      console.error('Error deleting comment:', err)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800',
      'mentor': 'bg-blue-100 text-blue-800',
      'org': 'bg-purple-100 text-purple-800',
      'member': 'bg-gray-100 text-gray-800'
    }
    return colors[role as keyof typeof colors] || colors.member
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = user?.id === comment.author_id
    const isEditing = editingId === comment.id

    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'mt-4'}`}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {comment.author?.avatar_url ? (
              <img src={comment.author.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 font-medium">
                {comment.author?.display_name?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {comment.author?.display_name || 'Anonyme'}
              </span>
              {comment.author?.role && (
                <Badge className={`text-xs ${getRoleColor(comment.author.role)}`}>
                  {comment.author.role}
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
              </span>
              {comment.is_edited && (
                <span className="text-xs text-gray-400">(modifié)</span>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                    disabled={submitting}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Enregistrer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null)
                      setEditContent('')
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                  <ThumbsUp className="h-3 w-3" />
                  {comment.likes_count > 0 && comment.likes_count}
                </button>
                {!isReply && user && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                  >
                    <Reply className="h-3 w-3" />
                    Répondre
                  </button>
                )}
                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment.id)
                        setEditContent(comment.content)
                      }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-3 w-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Écrivez votre réponse..."
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Répondre
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyContent('')
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* New Comment Form */}
        {user ? (
          <div className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis sur cet article..."
              className="min-h-[100px] mb-2"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={submitting || !newComment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">
              Vous devez être connecté pour commenter
            </p>
            <Button size="sm" asChild>
              <a href="/login">Se connecter</a>
            </Button>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun commentaire pour le moment</p>
            <p className="text-sm">Soyez le premier à commenter cet article !</p>
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
