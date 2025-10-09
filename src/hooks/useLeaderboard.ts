'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface LeaderboardEntry {
  id: string
  competition_id: string
  user_id: string
  submission_id: string | null
  score: number
  rank: number
  submission_count: number
  best_score: number
  last_improvement_at: string | null
  created_at: string
  updated_at: string
  // User info
  display_name: string
  avatar_url: string | null
  bio: string | null
  role: string
}

export interface LeaderboardStats {
  total_participants: number
  highest_score: number
  lowest_score: number
  average_score: number
  score_stddev: number
  total_submissions: number
}

export function useLeaderboard(competitionId: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch leaderboard avec infos utilisateur
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url,
            bio,
            role
          )
        `)
        .eq('competition_id', competitionId)
        .order('rank', { ascending: true })
        .limit(100)

      if (leaderboardError) throw leaderboardError

      // Formatter les données
      const formattedData = leaderboardData?.map((entry: any) => ({
        ...entry,
        display_name: entry.profiles?.display_name || 'Anonyme',
        avatar_url: entry.profiles?.avatar_url || null,
        bio: entry.profiles?.bio || null,
        role: entry.profiles?.role || 'user',
      })) || []

      setLeaderboard(formattedData)

      // Fetch statistiques
      const { data: statsData, error: statsError } = await supabase
        .from('leaderboard_stats')
        .select('*')
        .eq('competition_id', competitionId)
        .single()

      if (!statsError && statsData) {
        setStats(statsData)
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (competitionId) {
      fetchLeaderboard()
    }
  }, [competitionId])

  const submitScore = async (userId: string, submissionId: string, score: number) => {
    try {
      const { data, error } = await supabase.rpc('upsert_leaderboard_score', {
        p_competition_id: competitionId,
        p_user_id: userId,
        p_submission_id: submissionId,
        p_score: score,
      })

      if (error) throw error

      // Rafraîchir le leaderboard
      await fetchLeaderboard()

      return data[0] // Retourne le résultat (rank, is_improvement, etc.)
    } catch (err: any) {
      console.error('Error submitting score:', err)
      throw err
    }
  }

  return {
    leaderboard,
    stats,
    loading,
    error,
    refresh: fetchLeaderboard,
    submitScore,
  }
}

export function useUserRank(competitionId: string, userId: string | undefined) {
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!competitionId || !userId) {
      setLoading(false)
      return
    }

    const fetchUserRank = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from('leaderboard')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url,
              bio,
              role
            )
          `)
          .eq('competition_id', competitionId)
          .eq('user_id', userId)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setUserRank({
            ...data,
            display_name: data.profiles?.display_name || 'Anonyme',
            avatar_url: data.profiles?.avatar_url || null,
            bio: data.profiles?.bio || null,
            role: data.profiles?.role || 'user',
          })
        }
      } catch (err: any) {
        console.error('Error fetching user rank:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRank()
  }, [competitionId, userId])

  return {
    userRank,
    loading,
    error,
  }
}
