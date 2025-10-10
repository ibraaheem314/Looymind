import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, UserPlus, Sparkles } from 'lucide-react'
import Link from 'next/link'

type GuestRedirectProps = {
  feature: string
  description: string
  benefits?: string[]
}

export function GuestRedirect({ feature, description, benefits = [] }: GuestRedirectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20 flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full border-2 border-slate-200 shadow-2xl">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {feature}
            </h1>
            <p className="text-lg text-slate-600">
              {description}
            </p>
          </div>

          {benefits.length > 0 && (
            <div className="mb-8 p-6 bg-cyan-50/50 border-2 border-cyan-200 rounded-xl">
              <h3 className="font-semibold text-slate-900 mb-4 text-center">
                ✨ Ce que tu vas obtenir :
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-cyan-600 mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <Button asChild className="w-full bg-[#2d5986] hover:bg-[#1e3a5f] text-white h-12 text-base">
              <Link href="/auth/login?redirect=/plan">
                <LogIn className="h-5 w-5 mr-2" />
                Se connecter
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12 text-base">
              <Link href="/auth/register?redirect=/plan">
                <UserPlus className="h-5 w-5 mr-2" />
                Créer un compte
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-slate-500">
            <p>🔒 Gratuit · Sans engagement · Données privées</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

