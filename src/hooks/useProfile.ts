'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useProfile(userId?: string) {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (authProfile && (!userId || authProfile.id === userId)) {
      setProfile(authProfile as Profile)
      setLoading(authLoading)
      setError(null)
    }
  }, [authProfile, authLoading, userId])

  useEffect(() => {
    if (userId) {
      fetchProfile(userId)
    } else if (!authProfile) {
      setLoading(false)
    }
  }, [userId])

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        // Si le profil n'existe pas, on ne considère pas ça comme une erreur
        if (error.code === 'PGRST116') {
          setProfile(null)
          setLoading(false)
          return
        }

        if (error.code === '42501' && authProfile && authProfile.id === id) {
          setProfile(authProfile as Profile)
          setError(null)
          setLoading(false)
          return
        }

        setError(error.message)
        return
      }

      setProfile(data)
    } catch (err) {
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      setProfile(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!profile) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Mettre à jour l'URL de l'avatar dans le profil
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path)

      await updateProfile({ avatar_url: publicUrl.publicUrl })
      
      return publicUrl.publicUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload de l\'avatar')
      throw err
    }
  }

  const getProfileStats = async (id: string) => {
    try {
      const [submissionsResult, projectsResult] = await Promise.all([
        supabase
          .from('submissions')
          .select('id, score, status, created_at, challenges!submissions_challenge_id_fkey(title)')
          .eq('user_id', id),
        supabase
          .from('projects')
          .select('id, title, status, created_at')
          .eq('user_id', id)
      ])

      const submissions = submissionsResult.data || []
      const projects = projectsResult.data || []

      const stats = {
        totalSubmissions: submissions.length,
        acceptedSubmissions: submissions.filter(s => s.status === 'accepted').length,
        bestScore: Math.max(...submissions.map(s => s.score || 0), 0),
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in_progress').length,
        completedProjects: projects.filter(p => p.status === 'completed').length
      }

      return stats
    } catch (err) {
      console.error('Error fetching profile stats:', err)
      return null
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    getProfileStats,
    refetch: userId ? () => fetchProfile(userId) : undefined
  }
}
