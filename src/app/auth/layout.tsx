import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Logo en haut à gauche */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Palanteer</span>
        </Link>
      </div>
      
      {/* Contenu centré */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  )
}
