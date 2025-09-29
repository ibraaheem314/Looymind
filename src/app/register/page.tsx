'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth/register')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirection vers la page d'inscription...</p>
    </div>
  )
}

