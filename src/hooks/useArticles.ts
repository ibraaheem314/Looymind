'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  author_id: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  category: string
  image_url?: string
  views: number
  likes: number
  created_at: string
  updated_at: string
  published_at?: string
  profiles?: {
    display_name: string
    avatar_url?: string
  }
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async (filters?: {
    status?: string
    category?: string
    featured?: boolean
    author_id?: string
  }) => {
    try {
      setLoading(true)
      let query = supabase
        .from('articles')
        .select(`
          *,
          profiles!articles_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.author_id) {
        query = query.eq('author_id', filters.author_id)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
        return
      }

      setArticles(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des articles')
    } finally {
      setLoading(false)
    }
  }

  const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles!articles_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        console.error('Error fetching article:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error fetching article:', err)
      return null
    }
  }

  const createArticle = async (articleData: {
    title: string
    content: string
    excerpt: string
    category: string
    tags: string[]
    image_url?: string
    featured?: boolean
  }) => {
    try {
      const slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const { data, error } = await supabase
        .from('articles')
        .insert([{
          ...articleData,
          slug,
          status: 'draft',
          views: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des articles
      await fetchArticles()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'article')
      throw err
    }
  }

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des articles
      await fetchArticles()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'article')
      throw err
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des articles
      await fetchArticles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'article')
      throw err
    }
  }

  const publishArticle = async (id: string) => {
    return updateArticle(id, {
      status: 'published',
      published_at: new Date().toISOString()
    })
  }

  const incrementViews = async (id: string) => {
    try {
      const { error } = await supabase.rpc('increment_article_views', {
        article_id: id
      })

      if (error) {
        console.error('Error incrementing views:', error)
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  const getFeaturedArticles = () => {
    return articles.filter(article => article.featured && article.status === 'published')
  }

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category && article.status === 'published')
  }

  const getPublishedArticles = () => {
    return articles.filter(article => article.status === 'published')
  }

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    incrementViews,
    getFeaturedArticles,
    getArticlesByCategory,
    getPublishedArticles
  }
}
