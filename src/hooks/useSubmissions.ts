'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Submission } from '@/lib/supabase'

export function useSubmissions(challengeId?: string) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (challengeId) {
      fetchSubmissionsByChallenge(challengeId)
    } else {
      fetchAllSubmissions()
    }
  }, [challengeId])

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles!submissions_user_id_fkey (
            display_name,
            avatar_url
          ),
          challenges!submissions_challenge_id_fkey (
            title,
            difficulty
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setSubmissions(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des soumissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissionsByChallenge = async (challengeId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles!submissions_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challengeId)
        .order('score', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setSubmissions(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des soumissions')
    } finally {
      setLoading(false)
    }
  }

  const createSubmission = async (submissionData: {
    challenge_id: string
    title: string
    description: string
    file_url: string
    file_type: string
    file_size: number
  }) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des soumissions
      if (challengeId) {
        await fetchSubmissionsByChallenge(challengeId)
      } else {
        await fetchAllSubmissions()
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la soumission')
      throw err
    }
  }

  const updateSubmission = async (submissionId: string, updates: Partial<Submission>) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update(updates)
        .eq('id', submissionId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des soumissions
      if (challengeId) {
        await fetchSubmissionsByChallenge(challengeId)
      } else {
        await fetchAllSubmissions()
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la soumission')
      throw err
    }
  }

  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId)

      if (error) {
        throw new Error(error.message)
      }

      // Rafraîchir la liste des soumissions
      if (challengeId) {
        await fetchSubmissionsByChallenge(challengeId)
      } else {
        await fetchAllSubmissions()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la soumission')
      throw err
    }
  }

  const getLeaderboard = () => {
    return submissions
      .filter(s => s.status === 'accepted')
      .sort((a, b) => (b.score || 0) - (a.score || 0))
  }

  const getUserSubmissions = (userId: string) => {
    return submissions.filter(s => s.user_id === userId)
  }

  return {
    submissions,
    loading,
    error,
    refetch: challengeId ? () => fetchSubmissionsByChallenge(challengeId) : fetchAllSubmissions,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    getLeaderboard,
    getUserSubmissions
  }
}
