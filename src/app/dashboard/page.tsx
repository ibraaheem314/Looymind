'use client'

import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, LogOut, Settings, BarChart3, MapPin, Briefcase, 
  GraduationCap, Phone, Github, Linkedin, Globe, Mail,
  Calendar, Award, Target, Users, Building
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

  // Calcul des valeurs d'affichage avec fallbacks
  const displayName = 
    profile?.display_name || 
    user?.user_metadata?.display_name || 
    user?.user_metadata?.full_name || 
    user?.email?.split('@')[0] || 
    'Utilisateur'

  const firstName = (profile as any)?.first_name || user?.user_metadata?.first_name || ''
  const lastName = (profile as any)?.last_name || user?.user_metadata?.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim() || displayName

  const role = profile?.role || user?.user_metadata?.role || 'member'
  const skillsCount = Array.isArray(profile?.skills) ? profile.skills.length : 0
  const interestsCount = Array.isArray((profile as any)?.interests) ? (profile as any).interests.length : 0
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'

  // Niveaux d'expérience avec icônes
  const experienceLevel = (profile as any)?.experience_level || user?.user_metadata?.experience_level || 'debutant'
  const experienceLevels = {
    'debutant': { label: 'Débutant', color: 'bg-green-100 text-green-800' },
    'intermediaire': { label: 'Intermédiaire', color: 'bg-blue-100 text-blue-800' },
    'avance': { label: 'Avancé', color: 'bg-purple-100 text-purple-800' },
    'expert': { label: 'Expert', color: 'bg-orange-100 text-orange-800' }
  }

  // Informations professionnelles
  const currentPosition = (profile as any)?.current_position || user?.user_metadata?.current_position || ''
  const company = (profile as any)?.company || user?.user_metadata?.company || ''
  const location = profile?.location || user?.user_metadata?.location || ''
  const bio = profile?.bio || user?.user_metadata?.bio || ''

  // Liens sociaux
  const githubUrl = (profile as any)?.github_url || user?.user_metadata?.github_url || ''
  const linkedinUrl = (profile as any)?.linkedin_url || user?.user_metadata?.linkedin_url || ''
  const websiteUrl = (profile as any)?.website_url || user?.user_metadata?.website_url || ''
  const phone = (profile as any)?.phone || user?.user_metadata?.phone || ''

  // Compétences et intérêts
  const skills = profile?.skills || user?.user_metadata?.skills || []
  const interests = (profile as any)?.interests || user?.user_metadata?.interests || []

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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne gauche - Profil détaillé */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations personnelles - ÉTAPE 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base et coordonnées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  {location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium">{location}</p>
                      </div>
                    </div>
                  )}
                  
                  {phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{phone}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium">{memberSince}</p>
                    </div>
                  </div>
                </div>

                {/* Liens sociaux */}
                {(githubUrl || linkedinUrl || websiteUrl) && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Liens sociaux</h4>
                    <div className="flex flex-wrap gap-3">
                      {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                      {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                      {websiteUrl && (
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                          <Globe className="h-4 w-4" />
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations professionnelles - ÉTAPE 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Parcours professionnel
                </CardTitle>
                <CardDescription>
                  Votre expérience et votre rôle dans la communauté
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPosition && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Poste actuel</p>
                        <p className="font-medium">{currentPosition}</p>
                      </div>
                    </div>
                  )}
                  
                  {company && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Entreprise/Institution</p>
                        <p className="font-medium">{company}</p>
                      </div>
                    </div>
                  )}
                </div>

                {bio && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Biographie</h4>
                    <p className="text-gray-700 leading-relaxed">{bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compétences et intérêts - ÉTAPE 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Compétences et centres d'intérêt
                </CardTitle>
                <CardDescription>
                  Vos domaines d'expertise et centres d'intérêt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Compétences techniques ({skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Centres d'intérêt ({interests.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {skills.length === 0 && interests.length === 0 && (
                  <p className="text-gray-500 text-sm">Aucune compétence ou centre d'intérêt renseigné</p>
                )}
              </CardContent>
            </Card>
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
                    <span className="font-semibold text-lg">{skills.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Centres d'intérêt</span>
                    <span className="font-semibold text-lg">{interests.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Liens sociaux</span>
                    <span className="font-semibold text-lg">
                      {[githubUrl, linkedinUrl, websiteUrl].filter(Boolean).length}
                    </span>
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
                    <Badge className={experienceLevels[experienceLevel as keyof typeof experienceLevels]?.color}>
                      {experienceLevels[experienceLevel as keyof typeof experienceLevels]?.label}
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