'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useUserStats } from '../../hooks/useUserStats'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, Settings, BarChart3, Target, Users, 
  Trophy, TrendingUp, BookOpen, Code, 
  Award, Zap, Edit, Trash2, Eye, Heart, MessageCircle, ExternalLink, Calendar
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

interface RecentArticle {
  id: string
  title: string
  slug: string
  status: string
  likes_count: number
  views_count: number
  comments_count: number
  created_at: string
}

interface RecentProject {
  id: string
  title: string
  slug: string
  project_type: string
  likes_count: number
  views_count: number
  created_at: string
}

// Section Brouillons
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
      <div className="text-center py-6 text-gray-500 animate-fadeIn">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-2" />
        <p className="text-sm">Chargement...</p>
      </div>
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 animate-fadeIn">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-medium">Aucun brouillon</p>
        <p className="text-sm mt-2">
          Commencez à rédiger un article
        </p>
        <Link href="/articles/create">
          <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Écrire un article
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft, index) => (
        <div 
          key={draft.id} 
          className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:border-slate-300 hover:shadow-sm smooth-transition animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
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

// Section Articles Récents
function RecentArticlesSection({ userId }: { userId: string }) {
  const [articles, setArticles] = useState<RecentArticle[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchArticles()
  }, [userId])

  const fetchArticles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, status, likes_count, views_count, comments_count, created_at')
      .eq('author_id', userId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3)

    if (!error && data) {
      setArticles(data as RecentArticle[])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-2" />
        <p className="text-sm">Chargement...</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Aucun article publié</p>
        <Link href="/articles/create">
          <Button size="sm" variant="outline" className="mt-3">
            Publier votre premier article
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((article, index) => (
        <Link 
          key={article.id} 
          href={`/articles/${article.slug}`}
          className="block"
        >
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md smooth-transition animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <h4 className="font-medium text-sm mb-2 line-clamp-2">{article.title}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.views_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {article.likes_count}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {article.comments_count}
              </span>
              <span className="ml-auto text-gray-400">
                {format(new Date(article.created_at), 'dd MMM', { locale: fr })}
              </span>
            </div>
          </div>
        </Link>
      ))}
      {articles.length >= 3 && (
        <Link href="/articles">
          <Button variant="link" size="sm" className="w-full">
            Voir tous mes articles →
          </Button>
        </Link>
      )}
    </div>
  )
}

// Section Projets Récents
function RecentProjectsSection({ userId }: { userId: string }) {
  const [projects, setProjects] = useState<RecentProject[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [userId])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, slug, project_type, likes_count, views_count, created_at')
      .eq('author_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)

    if (!error && data) {
      setProjects(data as RecentProject[])
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-2" />
        <p className="text-sm">Chargement...</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Code className="h-10 w-10 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Aucun projet créé</p>
        <Link href="/projects/create">
          <Button size="sm" variant="outline" className="mt-3">
            Créer votre premier projet
          </Button>
        </Link>
      </div>
    )
  }

  const projectTypeEmoji: Record<string, string> = {
    web: '🌐',
    mobile: '📱',
    desktop: '💻',
    ai: '🤖',
    data: '📊',
    research: '🔬'
  }

  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <Link 
          key={project.id} 
          href={`/projects/${project.slug}`}
          className="block"
        >
          <div 
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md smooth-transition animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm line-clamp-2 flex-1">{project.title}</h4>
              <span className="text-xl ml-2">{projectTypeEmoji[project.project_type] || '📁'}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {project.views_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {project.likes_count}
              </span>
              <span className="ml-auto text-gray-400">
                {format(new Date(project.created_at), 'dd MMM', { locale: fr })}
              </span>
            </div>
          </div>
        </Link>
      ))}
      {projects.length >= 3 && (
        <Link href="/projects">
          <Button variant="link" size="sm" className="w-full">
            Voir tous mes projets →
          </Button>
        </Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const stats = useUserStats(user?.id)

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
            <Link href="/auth/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Se connecter</Button>
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
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 animate-fadeInScale">
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
              <Card className="hover:shadow-lg smooth-transition cursor-pointer animate-fadeInUp" onClick={() => window.location.href = '/articles'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Articles</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.articlesCount}
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg smooth-transition cursor-pointer animate-fadeInUp animation-delay-100" onClick={() => window.location.href = '/projects'}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Projets</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.projectsCount}
                      </p>
                    </div>
                    <Code className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg smooth-transition animate-fadeInUp animation-delay-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Brouillons</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.draftsCount}
                      </p>
                    </div>
                    <Edit className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg smooth-transition animate-fadeInUp animation-delay-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Likes</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.totalLikes}
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nouvelles Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="hover:shadow-lg smooth-transition animate-fadeInUp animation-delay-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Vues</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.totalViews}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-cyan-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg smooth-transition animate-fadeInUp animation-delay-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Commentaires</p>
                      <p className="text-2xl font-bold">
                        {stats.loading ? '...' : stats.totalComments}
                      </p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Brouillons */}
            <Card className="animate-fadeInUp animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
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

            {/* Articles Récents */}
            <Card className="animate-fadeInUp animation-delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Mes Articles Récents
                </CardTitle>
                <CardDescription>
                  Vos derniers articles publiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentArticlesSection userId={user.id} />
              </CardContent>
            </Card>

            {/* Projets Récents */}
            <Card className="animate-fadeInUp animation-delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Mes Projets Récents
                </CardTitle>
                <CardDescription>
                  Vos derniers projets créés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentProjectsSection userId={user.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Actions rapides */}
            <Card className="animate-fadeInUp animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/competitions" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50 smooth-transition">
                    <Trophy className="h-4 w-4 mr-2" />
                    Voir les compétitions
                  </Button>
                </Link>
                <Link href="/articles/create" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50 smooth-transition">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Écrire un article
                  </Button>
                </Link>
                <Link href="/projects/create" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50 smooth-transition">
                    <Code className="h-4 w-4 mr-2" />
                    Créer un projet
                  </Button>
                </Link>
                <Link href="/resources" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50 smooth-transition">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explorer les ressources
                  </Button>
                </Link>
                <Link href="/talents" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start hover:bg-slate-50 smooth-transition">
                    <Users className="h-4 w-4 mr-2" />
                    Découvrir la communauté
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Progression */}
            <Card className="animate-fadeInUp animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Votre Progression
                </CardTitle>
                <CardDescription>
                  Suivez votre évolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Compétences */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Compétences</span>
                      <span className="text-sm text-gray-500">
                        {Array.isArray(profile?.skills) ? profile.skills.length : 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full smooth-transition" 
                        style={{ 
                          width: `${Math.min((Array.isArray(profile?.skills) ? profile.skills.length : 0) * 5, 100)}%` 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Contributions */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Contributions</span>
                      <span className="text-sm text-gray-500">
                        {(stats.articlesCount || 0) + (stats.projectsCount || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full smooth-transition" 
                        style={{ 
                          width: `${Math.min(((stats.articlesCount || 0) + (stats.projectsCount || 0)) * 10, 100)}%` 
                        }} 
                      />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Badges
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        🎯 Nouveau membre
                      </Badge>
                      {(stats.articlesCount || 0) >= 1 && (
                        <Badge variant="outline" className="text-xs">
                          ✍️ Premier article
                        </Badge>
                      )}
                      {(stats.projectsCount || 0) >= 1 && (
                        <Badge variant="outline" className="text-xs">
                          🚀 Premier projet
                        </Badge>
                      )}
                      {(stats.totalLikes || 0) >= 10 && (
                        <Badge variant="outline" className="text-xs">
                          ❤️ 10 Likes
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats globales */}
            <Card className="animate-fadeInUp animation-delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Publications</span>
                  <span className="font-semibold">{(stats.articlesCount || 0) + (stats.projectsCount || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Engagement</span>
                  <span className="font-semibold">{(stats.totalLikes || 0) + (stats.totalComments || 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Portée Totale</span>
                  <span className="font-semibold">{stats.totalViews || 0} vues</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Niveau d'exp.</span>
                  <span className="font-semibold capitalize">{profile?.experience_level || 'Débutant'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
