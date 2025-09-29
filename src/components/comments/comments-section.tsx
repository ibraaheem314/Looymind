'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react'
import CommentCard from './comment-card'
import CommentForm from './comment-form'
import { useComments } from '@/hooks/useComments'
import { useAuth } from '@/hooks/useAuth'

interface CommentsSectionProps {
  entityType: 'project' | 'article' | 'challenge';
  entityId: string;
  title?: string;
  description?: string;
}

export default function CommentsSection({ 
  entityType, 
  entityId, 
  title = "Commentaires",
  description = "Partagez vos pensées et questions avec la communauté"
}: CommentsSectionProps) {
  const { user } = useAuth()
  const { 
    comments, 
    loading, 
    error, 
    fetchComments, 
    createComment, 
    updateComment, 
    deleteComment, 
    likeComment 
  } = useComments(entityType, entityId)
  
  const [showForm, setShowForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<any>(null)

  useEffect(() => {
    fetchComments()
  }, [entityId, entityType])

  const handleCreateComment = async (content: string) => {
    try {
      await createComment(content, replyingTo)
      setReplyingTo(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleUpdateComment = async (content: string) => {
    if (!editingComment) return
    
    try {
      await updateComment(editingComment.id, content)
      setEditingComment(null)
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return
    
    try {
      await deleteComment(commentId)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId)
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId)
    setShowForm(true)
  }

  const handleEdit = (comment: any) => {
    setEditingComment(comment)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setReplyingTo(null)
    setEditingComment(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-800 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des commentaires...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Erreur lors du chargement des commentaires</p>
          <Button onClick={fetchComments} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        {showForm ? (
          <CommentForm
            onSubmit={editingComment ? handleUpdateComment : handleCreateComment}
            onCancel={handleCancel}
            placeholder={
              editingComment 
                ? "Modifiez votre commentaire..." 
                : replyingTo 
                  ? "Répondez à ce commentaire..." 
                  : "Partagez vos pensées..."
            }
            parentId={replyingTo}
            isReply={!!replyingTo}
          />
        ) : (
          <div className="mb-6">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ajouter un commentaire
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun commentaire pour le moment
              </h3>
              <p className="text-gray-600 mb-4">
                Soyez le premier à partager vos pensées !
              </p>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ajouter un commentaire
                </Button>
              )}
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
                currentUserId={user?.id}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {comments.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline" size="sm">
              Charger plus de commentaires
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

