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
import { useUserStats } from '@/hooks/useUserStats'
import type { Profile } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const stats = useUserStats(user?.id)
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'activity'>('profile')
  const [error, setError] = useState<string | null>(null)

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
    const handleCreateProfile = async () => {
      if (!user) return
      
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        
        const m = user.user_metadata ?? {}
        const profileData = {
          id: user.id,
          email: user.email,
          display_name: m.display_name ?? m.full_name ?? user.email?.split('@')[0] ?? 'Utilisateur',
          first_name: m.first_name ?? null,
          last_name: m.last_name ?? null,
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
        
        console.log('📋 Création manuelle du profil:', profileData)
        
        const { data, error: insertError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' })
          .select()
          .single()
        
        if (insertError) {
          console.error('❌ Erreur:', insertError)
          alert(`Erreur: ${insertError.message}`)
        } else {
          console.log('✅ Profil créé:', data)
          window.location.reload()
        }
      } catch (err: any) {
        console.error('❌ Exception:', err)
        alert(`Exception: ${err.message}`)
      }
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Profil non trouvé</h2>
            <p className="text-gray-600 mb-4">Votre profil n'a pas encore été créé.</p>
            <div className="space-y-2">
              <Button onClick={handleCreateProfile} className="w-full">
                Créer mon profil
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Actualiser
              </Button>
            </div>
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
      {/* Header avec navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.display_name || 'Mon Profil'}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {profile.role === 'member' ? 'Membre' : 
                 profile.role === 'mentor' ? 'Mentor' :
                 profile.role === 'org' ? 'Organisation' : 'Admin'}
              </Badge>
              {(profile as any)?.experience_level && (
                <Badge variant="outline">
                  {(profile as any).experience_level === 'debutant' ? 'Débutant' :
                   (profile as any).experience_level === 'intermediaire' ? 'Intermédiaire' :
                   (profile as any).experience_level === 'avance' ? 'Avancé' : 'Expert'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-slate-500 text-slate-600'
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
            <Card>
              <CardHeader>
                <CardTitle>Informations du Profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles et professionnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nom d'affichage</p>
                    <p className="text-lg">{profile?.display_name || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Rôle</p>
                    <Badge>{profile?.role || 'member'}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bio</p>
                    <p className="text-gray-600">{profile?.bio || 'Aucune biographie'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Compétences</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Aucune compétence renseignée</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button asChild>
                      <a href="/profile/edit">Modifier mon profil</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles publiés</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.articlesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projets actifs</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.projectsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brouillons</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.draftsCount}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Likes</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.totalLikes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Vues</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.totalViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Commentaires</span>
                    <span className="font-bold">{stats.loading ? '...' : stats.totalComments}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
