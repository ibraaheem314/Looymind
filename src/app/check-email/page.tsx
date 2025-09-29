'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600">
            Nous avons envoyé un lien de confirmation à votre adresse email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Email de confirmation envoyé</CardTitle>
            <CardDescription className="text-center">
              {email ? (
                <>
                  Un email a été envoyé à <strong>{email}</strong>
                </>
              ) : (
                'Un email de confirmation a été envoyé à votre adresse'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Prochaines étapes :</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Consultez votre boîte de réception</li>
                    <li>Vérifiez votre dossier spam/courrier indésirable</li>
                    <li>Cliquez sur le lien de confirmation dans l'email</li>
                    <li>Vous serez automatiquement connecté</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Link href="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Vous n'avez pas reçu l'email ?</p>
              <p>Vérifiez que l'adresse email est correcte et réessayez l'inscription.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

