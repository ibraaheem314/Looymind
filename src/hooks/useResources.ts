'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface Resource {
  id: string
  title: string
  slug: string
  description: string | null
  type: 'external_course' | 'local_course' | 'tool' | 'article' | 'video' | 'documentation' | 'tutorial'
  resource_type?: string // Ancien champ pour compatibilité
  url: string | null
  source: string | null
  is_local: boolean
  cover_image_url: string | null
  thumbnail_url: string | null
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
  duration_hours: number | null
  is_free: boolean
  has_certificate: boolean
  price_fcfa: number | null
  curator_notes: string | null
  language: 'fr' | 'en' | 'wolof' | 'other'
  rating_avg: number
  rating_count: number
  views_count: number
  likes_count: number
  bookmarks_count: number
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  created_by: string | null
  created_at: string
  updated_at: string
  author?: {
    display_name: string
    avatar_url: string | null
    bio?: string
    role?: string
  }
}

interface UseResourcesOptions {
  category?: string
  difficulty?: string
  resourceType?: string
  searchQuery?: string
  sortBy?: 'recent' | 'popular' | 'views'
  limit?: number
}

export function useResources(options: UseResourcesOptions = {}) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchResources()
  }, [
    options.category,
    options.difficulty,
    options.resourceType,
    options.searchQuery,
    options.sortBy,
    options.limit
  ])

  const fetchResources = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('resources')
        .select(`
          *,
          author:profiles!created_by(display_name, avatar_url, bio, role)
        `)
        .eq('status', 'published')
        .eq('visibility', 'public')

      // Filtres
      if (options.category) {
        query = query.eq('category', options.category)
      }

      if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty)
      }

      if (options.resourceType) {
        query = query.eq('type', options.resourceType)
      }

      if (options.searchQuery) {
        query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`)
      }

      // Tri
      switch (options.sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false })
          break
        case 'views':
          query = query.order('views_count', { ascending: false })
          break
        case 'recent':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      // Limite
      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setResources(data || [])
    } catch (err: any) {
      console.error('Error fetching resources:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const incrementViews = async (resourceId: string) => {
    try {
      await supabase.rpc('increment_resource_views', { resource_id: resourceId })
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  const toggleLike = async (resourceId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('resource_id', resourceId)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            user_id: userId,
            resource_id: resourceId
          })
      }

      // Refresh resources
      fetchResources()
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  return {
    resources,
    loading,
    error,
    refresh: fetchResources,
    incrementViews,
    toggleLike
  }
}

export function useResource(slug: string) {
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (slug) {
      fetchResource()
    }
  }, [slug])

  const fetchResource = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('resources')
        .select(`
          *,
          author:profiles(display_name, avatar_url, bio, role)
        `)
        .eq('slug', slug)
        .single()

      if (fetchError) throw fetchError

      setResource(data)
    } catch (err: any) {
      console.error('Error fetching resource:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    resource,
    loading,
    error,
    refresh: fetchResource
  }
}