'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings,
  Activity,
  Trophy,
  Target,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import ProfileFormSimple from '@/components/profile/profile-form-simple'
import UserStats from '@/components/profile/user-stats'
import type { Profile } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { profile, loading, error } = useProfile(user?.id)
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'activity'>('profile')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">
              Vous devez être connecté pour accéder à votre profil.
            </p>
            <Button asChild>
              <a href="/login">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
            <p className="text-gray-600 mb-4">Votre profil n'a pas encore été créé.</p>
            <Button onClick={() => window.location.reload()}>
              Créer mon profil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'activity', label: 'Activité', icon: Activity }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.display_name || 'Profil utilisateur'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {profile.role === 'member' ? 'Membre' : 
                   profile.role === 'mentor' ? 'Mentor' :
                   profile.role === 'org' ? 'Organisation' : 'Admin'}
                </Badge>
                {profile.experience_level && (
                  <Badge variant="outline">
                    {profile.experience_level === 'debutant' ? 'Débutant' :
                     profile.experience_level === 'intermediaire' ? 'Intermédiaire' :
                     profile.experience_level === 'avance' ? 'Avancé' : 'Expert'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'profile' && (
            <ProfileFormSimple 
              profile={profile} 
              onUpdate={(updatedProfile) => {
                // Le hook useProfile se mettra à jour automatiquement
                console.log('Profile updated:', updatedProfile)
              }}
            />
          )}

          {activeTab === 'stats' && user?.id && (
            <UserStats userId={user.id} />
          )}

          {activeTab === 'activity' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activité Récente
                </CardTitle>
                <CardDescription>
                  Votre historique d'activité sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Historique d'activité à venir</p>
                  <p className="text-sm">Suivez vos interactions et contributions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
