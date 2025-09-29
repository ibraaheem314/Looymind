'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Resource } from '@/lib/supabase'

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      setResources(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des ressources')
    } finally {
      setLoading(false)
    }
  }

  const getResourceById = async (id: string): Promise<Resource | null> => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching resource:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Error fetching resource:', err)
      return null
    }
  }

  const getFeaturedResources = () => {
    return resources.filter(resource => resource.is_featured)
  }

  const getResourcesByType = (type: string) => {
    return resources.filter(resource => resource.type === type)
  }

  const getResourcesByCategory = (category: string) => {
    return resources.filter(resource => resource.category === category)
  }

  const getResourcesByDifficulty = (difficulty: string) => {
    return resources.filter(resource => resource.difficulty === difficulty)
  }

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
    getResourceById,
    getFeaturedResources,
    getResourcesByType,
    getResourcesByCategory,
    getResourcesByDifficulty
  }
}
