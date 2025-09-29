'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { Comment } from '@/lib/supabase'

interface UseCommentsProps {
  entityType: 'project' | 'article' | 'challenge';
  entityId: string;
}

export function useComments(entityType: string, entityId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          *,
          replies:comments!parent_id(*)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setComments(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des commentaires')
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, supabase])

  const createComment = async (content: string, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          entity_type: entityType,
          entity_id: entityId,
          parent_id: parentId || null,
          author_id: user.id,
          author_name: user.user_metadata?.display_name || user.email,
          author_avatar: user.user_metadata?.avatar_url,
          author_role: user.user_metadata?.role || 'member'
        })
        .select()
        .single()

      if (error) throw error

      // Refresh comments
      await fetchComments()
      return data
    } catch (err) {
      console.error('Error creating comment:', err)
      throw err
    }
  }

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)

      if (error) throw error

      // Refresh comments
      await fetchComments()
    } catch (err) {
      console.error('Error updating comment:', err)
      throw err
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      // Refresh comments
      await fetchComments()
    } catch (err) {
      console.error('Error deleting comment:', err)
      throw err
    }
  }

  const likeComment = async (commentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      // Check if user already liked this comment
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          })
      }

      // Refresh comments
      await fetchComments()
    } catch (err) {
      console.error('Error liking comment:', err)
      throw err
    }
  }

  useEffect(() => {
    if (entityId) {
      fetchComments()
    }
  }, [entityId, fetchComments])

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment
  }
}

