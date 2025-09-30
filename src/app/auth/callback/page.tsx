// app/auth/callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      try {
        // 1) Échanger le code contre une session
        await supabase.auth.exchangeCodeForSession(window.location.href)

        // 2) Le profil est créé automatiquement par le TRIGGER SQL
        //    Pas besoin de faire d'upsert ici !
        
        // 3) Rediriger directement vers le dashboard
        router.replace('/dashboard')
      } catch (e: any) {
        console.error('Erreur callback:', e)
        setError(e?.message || 'Erreur lors de la connexion.')
      }
    }
    run()
  }, [router])

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-6 text-center">
        <div>
          <h1 className="text-xl font-semibold mb-2">Oups</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/login" className="text-slate-800 underline">Revenir à la connexion</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="flex items-center gap-3 text-gray-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Connexion en cours…</span>
      </div>
    </div>
  )
}
