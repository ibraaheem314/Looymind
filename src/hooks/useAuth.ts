'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) await loadOrCreateProfile(session.user)
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) await loadOrCreateProfile(session.user)
        else setProfile(null)
        setLoading(false)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const loadOrCreateProfile = async (u: User) => {
    // Charger le profil existant (le TRIGGER l'a normalement déjà créé)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single()
    
    if (!error && data) {
      console.log('Profile found:', data)
      setProfile(data as Profile)
      return
    }

    console.log('Profile not found, waiting for trigger...', error)
    
    // Wait a bit then retry in case the trigger is still running
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { data: retryData, error: retryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single()
    
    if (!retryError && retryData) {
      console.log('Profile found after retry:', retryData)
      setProfile(retryData as Profile)
      return
    }
    
    console.error('Profile still not found after retry. SQL trigger may not be working.')
    console.error('Check that the on_auth_user_created trigger is active in Supabase.')
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return { 
    user, 
    profile, 
    loading, 
    isAuthenticated: !!user, 
    signOut 
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