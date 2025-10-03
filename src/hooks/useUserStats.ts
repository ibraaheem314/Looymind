'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

interface UserStats {
  articlesCount: number
  projectsCount: number
  draftsCount: number
  competitionsCount: number
  totalLikes: number
  totalViews: number
  totalComments: number
  loading: boolean
}

export function useUserStats(userId: string | undefined): UserStats {
  const [stats, setStats] = useState<UserStats>({
    articlesCount: 0,
    projectsCount: 0,
    draftsCount: 0,
    competitionsCount: 0,
    totalLikes: 0,
    totalViews: 0,
    totalComments: 0,
    loading: true
  })

  useEffect(() => {
    if (!userId) {
      setStats(prev => ({ ...prev, loading: false }))
      return
    }

    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    if (!userId) return

    try {
      const supabase = createClient()

      // Récupérer les statistiques des articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, status, likes_count, views_count, comments_count')
        .eq('author_id', userId)

      // Récupérer les statistiques des projets
      const { data: projects } = await supabase
        .from('projects')
        .select('id, status, likes_count, views_count, comments_count')
        .eq('author_id', userId)

      // Calculer les totaux
      const articlesPublished = articles?.filter(a => a.status === 'published').length || 0
      const drafts = articles?.filter(a => a.status === 'draft').length || 0
      const projectsPublished = projects?.filter(p => p.status === 'active').length || 0

      const totalArticleLikes = articles?.reduce((sum, a) => sum + (a.likes_count || 0), 0) || 0
      const totalProjectLikes = projects?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0

      const totalArticleViews = articles?.reduce((sum, a) => sum + (a.views_count || 0), 0) || 0
      const totalProjectViews = projects?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0

      const totalArticleComments = articles?.reduce((sum, a) => sum + (a.comments_count || 0), 0) || 0
      const totalProjectComments = projects?.reduce((sum, p) => sum + (p.comments_count || 0), 0) || 0

      setStats({
        articlesCount: articlesPublished,
        projectsCount: projectsPublished,
        draftsCount: drafts,
        competitionsCount: 0, // TODO: implémenter quand les soumissions seront prêtes
        totalLikes: totalArticleLikes + totalProjectLikes,
        totalViews: totalArticleViews + totalProjectViews,
        totalComments: totalArticleComments + totalProjectComments,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  return stats
}

