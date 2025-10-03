'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, Search, Trash2, Eye, EyeOff, Star, 
  ArrowLeft, Shield, TrendingUp, MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  slug: string
  status: string
  author: { display_name: string }[]
  created_at: string
  likes_count: number
  views_count: number
  comments_count: number
}

interface Project {
  id: string
  title: string
  slug: string
  status: string
  author: { display_name: string }[]
  created_at: string
  likes_count: number
  views_count: number
}

interface Comment {
  id: string
  content: string
  author: { display_name: string }[]
  created_at: string
  article?: { title: string }[]
  project?: { title: string }[]
}

export default function ContentModeration() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [articles, setArticles] = useState<Article[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('articles')
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchContent()
    }
  }, [isAdmin, activeTab])

  const fetchContent = async () => {
    setLoading(true)
    try {
      if (activeTab === 'articles') {
        const { data } = await supabase
          .from('articles')
          .select('id, title, slug, status, created_at, likes_count, views_count, comments_count, author:profiles!author_id(display_name)')
          .order('created_at', { ascending: false })
          .limit(50)
        setArticles((data || []) as Article[])
      } else if (activeTab === 'projects') {
        const { data } = await supabase
          .from('projects')
          .select('id, title, slug, status, created_at, likes_count, views_count, author:profiles!author_id(display_name)')
          .order('created_at', { ascending: false })
          .limit(50)
        setProjects((data || []) as Project[])
      } else if (activeTab === 'comments') {
        const { data } = await supabase
          .from('comments')
          .select('id, content, created_at, author:profiles!author_id(display_name), article:articles(title), project:projects(title)')
          .order('created_at', { ascending: false })
          .limit(50)
        setComments((data || []) as Comment[])
      }
    } catch (err) {
      console.error('Error fetching content:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Supprimer cet article définitivement ?')) return
    try {
      setProcessingId(id)
      const { error } = await supabase.from('articles').delete().eq('id', id)
      if (error) throw error
      await fetchContent()
      alert('Article supprimé')
    } catch (err: any) {
      alert('Erreur lors de la suppression')
    } finally {
      setProcessingId(null)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Supprimer ce projet définitivement ?')) return
    try {
      setProcessingId(id)
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      await fetchContent()
      alert('Projet supprimé')
    } catch (err: any) {
      alert('Erreur lors de la suppression')
    } finally {
      setProcessingId(null)
    }
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Supprimer ce commentaire définitivement ?')) return
    try {
      setProcessingId(id)
      const { error } = await supabase.from('comments').delete().eq('id', id)
      if (error) throw error
      await fetchContent()
      alert('Commentaire supprimé')
    } catch (err: any) {
      alert('Erreur lors de la suppression')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredComments = comments.filter(c =>
    c.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">Vous devez être administrateur.</p>
            <Link href="/dashboard"><Button>Retour</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-purple-500" />
                Modération du Contenu
              </h1>
              <p className="text-gray-600 mt-1">Articles, projets et commentaires</p>
            </div>
            <Link href="/admin/moderation">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher du contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles ({articles.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Projets ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Commentaires ({comments.length})
            </TabsTrigger>
          </TabsList>

          {/* Articles */}
          <TabsContent value="articles">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Aucun article trouvé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            <Badge className={article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {article.status === 'published' ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Par {article.author?.[0]?.display_name || 'Anonyme'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>❤️ {article.likes_count}</span>
                            <span>👁️ {article.views_count}</span>
                            <span>💬 {article.comments_count}</span>
                            <span>{format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteArticle(article.id)}
                            disabled={processingId === article.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects */}
          <TabsContent value="projects">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Aucun projet trouvé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              {project.status || 'Actif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Par {project.author?.[0]?.display_name || 'Anonyme'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>❤️ {project.likes_count}</span>
                            <span>👁️ {project.views_count}</span>
                            <span>{format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProject(project.id)}
                            disabled={processingId === project.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Comments */}
          <TabsContent value="comments">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
              </div>
            ) : filteredComments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">Aucun commentaire trouvé</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <Card key={comment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900 mb-2">{comment.content}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            Par {comment.author?.[0]?.display_name || 'Anonyme'}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Sur: {comment.article?.[0]?.title || comment.project?.[0]?.title || 'Inconnu'}
                            </span>
                            <span>{format(new Date(comment.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteComment(comment.id)}
                          disabled={processingId === comment.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

