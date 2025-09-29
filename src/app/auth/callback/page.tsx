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
        // 1) Échange le code de l’URL contre une session
        await supabase.auth.exchangeCodeForSession(window.location.href)

        // 2) Récupère l'utilisateur et ses métadonnées
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const m = user.user_metadata ?? {}
          const patch: Record<string, any> = {
            id: user.id,                              // 👈 indispensable pour l’upsert
            email: user.email,
            display_name: m.display_name ?? m.full_name ?? null,
            first_name: m.first_name ?? m.full_name?.split(' ')?.[0] ?? null,
            last_name: m.last_name ?? (m.full_name?.split(' ')?.slice(1).join(' ') || null),
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
          }
          Object.keys(patch).forEach(k => patch[k] == null && delete patch[k])

          // 3) Upsert (crée si pas de ligne, sinon met à jour)
          await supabase.from('profiles')
            .upsert(patch, { onConflict: 'id' })
        }

        // 4) Go dashboard
        router.replace('/dashboard')
      } catch (e: any) {
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
