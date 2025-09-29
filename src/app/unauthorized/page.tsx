import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Accès non autorisé
          </CardTitle>
          <CardDescription className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              Cette page nécessite des privilèges administrateur ou un rôle spécifique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Mon tableau de bord
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
