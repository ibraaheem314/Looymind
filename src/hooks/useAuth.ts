'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/auth-helpers-nextjs'
import type { Profile } from '@/lib/supabase'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user
  }
}

export function useProfile() {
  const { profile, loading } = useAuth()
  
  const isAdmin = profile?.role === 'admin'
  const isMentor = profile?.role === 'mentor'
  const isOrg = profile?.role === 'org'
  const isMember = profile?.role === 'member'
  
  return {
    profile,
    loading,
    isAdmin,
    isMentor,
    isOrg,
    isMember,
    hasRole: (role: string) => profile?.role === role,
    hasAnyRole: (roles: string[]) => profile ? roles.includes(profile.role) : false
  }
}
