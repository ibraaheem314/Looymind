'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, Users, Trophy, FileText, 
  AlertCircle, BarChart3, Settings, Eye
} from 'lucide-react'
import Link from 'next/link'

export default function ModerationPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (profile?.role !== 'admin' && profile?.role !== 'moderator'))) {
      router.push('/')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (!user || (profile?.role !== 'admin' && profile?.role !== 'moderator')) {
    return null
  }

  const moderationCards = [
    {
      title: 'Utilisateurs',
      description: 'Gérer les utilisateurs et leurs rôles',
      icon: Users,
      href: '/admin/users',
      count: '0',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Compétitions',
      description: 'Gérer les compétitions et soumissions',
      icon: Trophy,
      href: '/admin/competitions',
      count: '0',
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Articles',
      description: 'Modérer les articles et commentaires',
      icon: FileText,
      href: '/admin/articles',
      count: '0',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Signalements',
      description: 'Gérer les signalements de contenu',
      icon: AlertCircle,
      href: '/admin/reports',
      count: '0',
      color: 'bg-red-100 text-red-800'
    },
    {
      title: 'Statistiques',
      description: 'Voir les statistiques de la plateforme',
      icon: BarChart3,
      href: '/admin/stats',
      count: '-',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      title: 'Paramètres',
      description: 'Configuration de la plateforme',
      icon: Settings,
      href: '/admin/settings',
      count: '-',
      color: 'bg-gray-100 text-gray-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-4xl font-bold">Espace Modération</h1>
              <p className="text-xl text-white/80 mt-2">
                Gérez les signalements et maintenez la qualité du contenu
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Badge className="bg-white/20 text-white border-0 text-sm px-3 py-1">
              {profile?.role === 'admin' ? 'Administrateur' : 'Modérateur'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert pour développement */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Espace en développement</h3>
            <p className="text-sm text-blue-800">
              Les fonctionnalités de modération seront ajoutées progressivement. 
              Pour le moment, vous pouvez gérer les utilisateurs, compétitions et articles.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moderationCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-lg font-semibold">
                      {card.count}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if (card.href === '/admin/users' || 
                          card.href === '/admin/competitions' || 
                          card.href === '/admin/articles') {
                        alert('Cette fonctionnalité sera disponible prochainement')
                      } else {
                        router.push(card.href)
                      }
                    }}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Gérer les rôles utilisateurs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Modifier les rôles des utilisateurs directement depuis Supabase
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://supabase.com', '_blank')}
                >
                  Ouvrir Supabase
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Évaluer les soumissions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Attribuer des scores aux soumissions de compétitions
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Cette fonctionnalité sera disponible prochainement')}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
