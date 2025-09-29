'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MailCheck, Mail } from 'lucide-react'

export default function CheckEmailPage() {
  const params = useSearchParams()
  const email = params.get('email') || ''

  // petit masquage d'email pour l'UI
  const masked = email
    ? email.replace(/^(.)(.*)(.@.*)$/, (_, a, mid, rest) => a + '•'.repeat(Math.max(2, mid.length)) + rest)
    : null

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-green-50 flex items-center justify-center">
          <MailCheck className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold">Vérifie ta boîte mail</h1>
        <p className="text-gray-600">
          Nous t’avons envoyé un lien de confirmation{masked ? <> à <strong>{masked}</strong></> : ''}.
          Clique sur ce lien pour activer ton compte et te connecter.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Retour à l’accueil</Button>
          </Link>
        </div>
        <p className="text-xs text-gray-500 pt-4">
          Pas de mail ? Vérifie le dossier spam, ou réessaie l’inscription.
        </p>
      </div>
    </div>
  )
}
