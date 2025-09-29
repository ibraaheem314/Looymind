import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, Reply, Heart, Flag, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useState } from 'react'
import type { Comment } from '@/lib/supabase'
import ReportForm from '@/components/moderation/report-form'

interface CommentCardProps {
  comment: Comment;
  onReply?: (parentId: string) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  currentUserId?: string;
  level?: number;
}

export default function CommentCard({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onLike, 
  currentUserId,
  level = 0 
}: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(comment.likes || 0)
  const [showReportForm, setShowReportForm] = useState(false)

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    }
  }

  const isAuthor = currentUserId === comment.author_id
  const canModerate = currentUserId && ['admin', 'moderator'].includes(comment.author_role || '')

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <Card className="mb-4 hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author_avatar} alt={comment.author_name} />
              <AvatarFallback>
                {comment.author_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {comment.author_name || 'Utilisateur anonyme'}
                  </h4>
                  {comment.author_role && (
                    <Badge variant="outline" className="text-xs">
                      {comment.author_role}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {(isAuthor || canModerate) && (
                    <div className="flex items-center space-x-1">
                      {isAuthor && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(comment)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(comment.id)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none text-gray-800 mb-3">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`h-8 px-2 text-xs ${
                      isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                    {likesCount}
                  </Button>
                  
                  {level < 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply?.(comment.id)}
                      className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Répondre
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReportForm(true)}
                    className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Signaler
                  </Button>
                </div>
                
                {comment.replies_count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplies(!showReplies)}
                    className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {showReplies ? 'Masquer' : 'Voir'} {comment.replies_count} réponse{comment.replies_count > 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              currentUserId={currentUserId}
              level={level + 1}
            />
          )          )}
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ReportForm
              entityType="comment"
              entityId={comment.id}
              onClose={() => setShowReportForm(false)}
              onSuccess={() => setShowReportForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
