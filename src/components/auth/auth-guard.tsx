'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string | string[]
  fallback?: React.ReactNode
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireRole,
  fallback 
}: AuthGuardProps) {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Check role requirement
    if (requireRole && profile) {
      const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole]
      const hasRequiredRole = requiredRoles.includes(profile.role)
      
      if (!hasRequiredRole) {
        router.push('/unauthorized')
        return
      }
    }
  }, [loading, isAuthenticated, profile, requireAuth, requireRole, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  // Show fallback if requirements not met
  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  if (requireRole && profile) {
    const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole]
    const hasRequiredRole = requiredRoles.includes(profile.role)
    
    if (!hasRequiredRole) {
      return fallback || null
    }
  }

  return <>{children}</>
}
