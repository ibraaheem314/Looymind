'use client'

import { useEffect, useState } from 'react'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      // Si déjà complété (profil a level/goals), rediriger vers resources
      if (profile?.level && profile?.goals && profile.goals.length > 0) {
        router.push('/resources')
      } else {
        setReady(true)
      }
    }
  }, [loading, profile, router])

  if (loading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    )
  }

  return (
    <OnboardingWizard 
      userId={user?.id}
      onComplete={() => {
        // Redirection vers les ressources après complétion
        router.push('/resources')
      }}
    />
  )
}

