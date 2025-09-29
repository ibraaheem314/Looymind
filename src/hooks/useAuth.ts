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
    // 1) Tenter de charger le profil existant
    const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).single()
    if (!error && data) {
      setProfile(data as Profile)
      return
    }

    // 2) Créer le profil depuis les métadonnées si absent
    const m = u.user_metadata ?? {}
    const toInsert: any = {
      id: u.id,
      email: u.email,
      display_name: m.display_name ?? m.full_name ?? u.email?.split('@')[0] ?? 'Utilisateur',
      first_name: m.first_name ?? m.full_name?.split(' ')?.[0] ?? null,
      last_name: m.last_name ?? m.full_name?.split(' ')?.slice(1).join(' ') ?? null,
      role: m.role ?? 'member',
      experience_level: m.experience_level ?? 'debutant',
      location: m.location ?? null,
      current_position: m.current_position ?? null,
      company: m.company ?? null,
      bio: m.bio ?? null,
      github_url: m.github_url ?? null,
      linkedin_url: m.linkedin_url ?? null,
      website_url: m.website_url ?? null,
      phone: m.phone ?? null,
      skills: Array.isArray(m.skills) ? m.skills : [],
      interests: Array.isArray(m.interests) ? m.interests : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Nettoyer les valeurs null
    Object.keys(toInsert).forEach(k => toInsert[k] == null && delete toInsert[k])

    try {
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .upsert(toInsert, { onConflict: 'id' })
        .select()
        .single()
        
      if (insertError) {
        console.error('Error creating profile:', insertError)
        return
      }
      
      if (created) setProfile(created as Profile)
    } catch (error) {
      console.error('Error in loadOrCreateProfile:', error)
    }
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