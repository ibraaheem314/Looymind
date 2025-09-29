'use client'

import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, LogOut, Settings, BarChart3, MapPin, Briefcase, 
  GraduationCap, Phone, Github, Linkedin, Globe, Mail,
  Calendar, Award, Target, Users
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Non connecté</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder au dashboard.</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Calcul des valeurs d'affichage avec fallbacks
  const displayName = 
    profile?.display_name || 
    user?.user_metadata?.display_name || 
    user?.user_metadata?.full_name || 
    user?.email?.split('@')[0] || 
    'Utilisateur'

  const role = profile?.role || 'member'
  const skillsCount = Array.isArray(profile?.skills) ? profile.skills.length : 0
  const interestsCount = 0 // Temporaire - type Profile n'a pas interests
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'

  // Niveaux d'expérience avec icônes
  const experienceLevel = 'debutant' // Temporaire - type Profile incomplet
  const experienceLevels = {
    'debutant': { label: 'Débutant', color: 'bg-green-100 text-green-800' },
    'intermediaire': { label: 'Intermédiaire', color: 'bg-blue-100 text-blue-800' },
    'avance': { label: 'Avancé', color: 'bg-purple-100 text-purple-800' },
    'expert': { label: 'Expert', color: 'bg-orange-100 text-orange-800' }
  }

  // Rôles avec icônes
  const roleConfig = {
    'member': { label: 'Membre', icon: User, color: 'bg-gray-100 text-gray-800' },
    'mentor': { label: 'Mentor', icon: GraduationCap, color: 'bg-blue-100 text-blue-800' },
    'org': { label: 'Organisation', icon: Briefcase, color: 'bg-purple-100 text-purple-800' },
    'admin': { label: 'Administrateur', icon: Award, color: 'bg-red-100 text-red-800' }
  }

  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.member

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bienvenue, {displayName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Mon profil
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Profil détaillé */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de profil et coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  {profile?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium">{profile.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Téléphone temporairement désactivé - type Profile incomplet */}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium">{memberSince}</p>
                    </div>
                  </div>
                </div>

                {/* Liens sociaux */}
                {/* Liens sociaux temporairement désactivés - type Profile incomplet */}
              </CardContent>
            </Card>

            {/* Parcours professionnel */}
            {profile?.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    À propos
                  </CardTitle>
                  <CardDescription>
                    Votre présentation personnelle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Compétences */}
            {profile?.skills?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Compétences techniques
                  </CardTitle>
                  <CardDescription>
                    Vos domaines d'expertise techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.skills?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Compétences techniques ({skillsCount})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Intérêts temporairement désactivés - type Profile incomplet */}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Stats et actions */}
          <div className="space-y-6">
            
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mes statistiques
                </CardTitle>
                <CardDescription>
                  Vos activités sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points</span>
                    <span className="font-semibold text-lg">{profile?.points || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compétences</span>
                    <span className="font-semibold text-lg">{skillsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rôle et niveau */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <currentRole.icon className="h-5 w-5" />
                  Profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Rôle</p>
                    <Badge className={currentRole.color}>
                      {currentRole.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Niveau d'expérience</p>
                    <Badge className={experienceLevels[experienceLevel]?.color}>
                      {experienceLevels[experienceLevel]?.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Actions rapides
                </CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/challenges" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Voir les défis
                    </Button>
                  </Link>
                  <Link href="/articles" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Lire les articles
                    </Button>
                  </Link>
                  <Link href="/projects" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Mes projets
                    </Button>
                  </Link>
                  <Link href="/talents" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Communauté
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}