'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, Settings, BarChart3, Target, Users, 
  Trophy, TrendingUp, BookOpen, Code, 
  Bell, Calendar, Award, Zap, Activity, Edit, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DraftArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  created_at: string
  updated_at: string
}

function DraftsSection({ userId }: { userId: string }) {
  const [drafts, setDrafts] = useState<DraftArticle[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDrafts()
  }, [userId])

  const fetchDrafts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, created_at, updated_at')
      .eq('author_id', userId)
      .eq('status', 'draft')
      .order('updated_at', { ascending: false })
      .limit(5)

    if (!error && data) {
      setDrafts(data as DraftArticle[])
    }
    setLoading(false)
  }

  const deleteDraft = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce brouillon ?')) return

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (!error) {
      setDrafts(drafts.filter(d => d.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-2" />
        <p className="text-sm">Chargement...</p>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium">Aucun brouillon</p>
        <p className="text-sm mt-2">
          Commencez à rédiger un article
        </p>
        <Link href="/articles/create">
          <Button size="sm" className="mt-4">
            <Edit className="h-4 w-4 mr-2" />
            Écrire un article
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {drafts.map(draft => (
        <div key={draft.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{draft.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">{draft.excerpt || 'Aucun extrait'}</p>
            <p className="text-xs text-gray-400 mt-1">
              Modifié {format(new Date(draft.updated_at), 'dd MMM yyyy', { locale: fr })}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Link href={`/articles/create?draft=${draft.id}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => deleteDraft(draft.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {drafts.length >= 5 && (
        <Link href="/articles?filter=drafts">
          <Button variant="link" size="sm" className="w-full">
            Voir tous mes brouillons →
          </Button>
        </Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()

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

  const displayName = 
    profile?.display_name || 
    user?.user_metadata?.display_name || 
    user?.user_metadata?.full_name || 
    user?.email?.split('@')[0] || 
    'Utilisateur'

  const role = profile?.role || 'member'
  const roleConfig = {
    'member': { label: 'Membre', color: 'bg-gray-100 text-gray-800' },
    'mentor': { label: 'Mentor', color: 'bg-blue-100 text-blue-800' },
    'org': { label: 'Organisation', color: 'bg-purple-100 text-purple-800' },
    'admin': { label: 'Administrateur', color: 'bg-red-100 text-red-800' }
  }
  const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.member

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              
              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold">
                  Bienvenue, {displayName} 👋
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${currentRole.color} border-0`}>
                    {currentRole.label}
                  </Badge>
                  <span className="text-white/70 text-sm">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/profile">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Points</p>
                      <p className="text-2xl font-bold">{profile?.points || 0}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Challenges</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Articles</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Projets</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Code className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mes Brouillons
                </CardTitle>
                <CardDescription>
                  Articles en cours de rédaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DraftsSection userId={user.id} />
              </CardContent>
            </Card>

            {/* Progression */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Votre Progression
                </CardTitle>
                <CardDescription>
                  Suivez votre évolution sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Niveau */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Niveau</span>
                      <span className="text-sm text-gray-500">1 / 10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>

                  {/* Compétences */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Compétences validées</span>
                      <span className="text-sm text-gray-500">
                        {Array.isArray(profile?.skills) ? profile.skills.length : 0} compétences
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((Array.isArray(profile?.skills) ? profile.skills.length : 0) * 5, 100)}%` 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Badges obtenus
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        🎯 Nouveau membre
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/challenges" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50">
                    <Target className="h-4 w-4 mr-2" />
                    Parcourir les défis
                  </Button>
                </Link>
                <Link href="/articles" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Lire les articles
                  </Button>
                </Link>
                <Link href="/projects" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50">
                    <Code className="h-4 w-4 mr-2" />
                    Créer un projet
                  </Button>
                </Link>
                <Link href="/talents" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50">
                    <Users className="h-4 w-4 mr-2" />
                    Explorer la communauté
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats globales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques Globales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rang Global</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taux de Réussite</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Contributions</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Jours Actifs</span>
                  <span className="font-semibold">1</span>
                </div>
              </CardContent>
            </Card>

            {/* Événements à venir */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Événements à Venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Aucun événement prévu</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}