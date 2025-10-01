'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, Heart, MessageCircle, Calendar, User, Eye, 
  Share2, Bookmark, Edit, Trash2, Flag
} from 'lucide-react'
import Link from 'next/link'
import CommentsSection from '@/components/articles/comments-section'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author_id: string
  category: string
  tags: string[]
  likes_count: number
  comments_count: number
  views_count: number
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  author?: {
    id: string
    display_name: string
    role: string
    avatar_url?: string
  }
}

export default function ArticleDetailPage() {
  const { user } = useAuth()
  const { slug } = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [error, setError] = useState('')

  const categories = [
    { value: 'ia', label: 'Intelligence Artificielle' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'deep-learning', label: 'Deep Learning' },
    { value: 'nlp', label: 'NLP' },
    { value: 'computer-vision', label: 'Computer Vision' },
    { value: 'big-data', label: 'Big Data' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'dev', label: 'Développement' },
    { value: 'tutorial', label: 'Tutoriel' },
    { value: 'news', label: 'Actualités' }
  ]

  useEffect(() => {
    if (slug) {
      fetchArticle(slug as string)
    }
  }, [slug])

  useEffect(() => {
    if (article && user) {
      checkIfLiked()
      incrementViews()
    }
  }, [article, user])

  const fetchArticle = async (articleSlug: string) => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles(id, display_name, role, avatar_url)
        `)
        .eq('slug', articleSlug)
        .eq('status', 'published')
        .single()

      if (error) {
        setError('Article non trouvé')
        console.error('Error fetching article:', error)
        return
      }

      setArticle(data)
      setLikesCount(data.likes_count || 0)
      setCommentsCount(data.comments_count || 0)
      setViewsCount(data.views_count || 0)
    } catch (err) {
      setError('Erreur lors du chargement de l\'article')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = async () => {
    if (!user || !article) return

    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('article_id', article.id)
        .eq('user_id', user.id)
        .single()

      setLiked(!!data)
    } catch (err) {
      console.error('Error checking like status:', err)
    }
  }

  const incrementViews = async () => {
    if (!article) return

    try {
      const supabase = createClient()
      
      console.log('🔍 Attempting to add view for article:', article.id, 'User:', user?.id)
      
      // Tenter d'ajouter une vue unique
      const { data, error } = await supabase
        .from('article_views')
        .insert([{
          article_id: article.id,
          user_id: user?.id || null,
        }])
        .select()
      
      // Si pas d'erreur, la vue a ete ajoutee (trigger incremente automatiquement)
      if (!error && data) {
        console.log('✅ New unique view registered:', data)
        // Rafraichir le compteur de vues
        setViewsCount(prev => {
          console.log('📊 Views count updated from', prev, 'to', prev + 1)
          return prev + 1
        })
      } else if (error && error.code === '23505') {
        // Code 23505 = duplicate key (NORMAL pour les vues uniques)
        console.log('ℹ️ View already exists (normal behavior)')
      } else if (error) {
        console.error('❌ Unexpected error:', error)
      }
    } catch (err) {
      console.error('❌ Error incrementing views:', err)
    }
  }

  const toggleLike = async () => {
    if (!user || !article) return

    try {
      const supabase = createClient()

      if (liked) {
        // Remove like
        console.log('👎 Removing like for article:', article.id)
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('article_id', article.id)
          .eq('user_id', user.id)
        
        if (!error) {
          console.log('✅ Like removed successfully')
          setLiked(false)
          
          // Rafraîchir le compteur depuis la base de données
          const { data: updatedArticle } = await supabase
            .from('articles')
            .select('likes_count')
            .eq('id', article.id)
            .single()
          
          if (updatedArticle) {
            console.log('📊 Likes count refreshed from DB:', updatedArticle.likes_count)
            setLikesCount(updatedArticle.likes_count)
          }
        } else {
          console.error('❌ Error removing like:', error)
        }
      } else {
        // Add like
        console.log('👍 Adding like for article:', article.id)
        const { data, error } = await supabase
          .from('likes')
          .insert([{
            article_id: article.id,
            user_id: user.id,
            project_id: null,
            comment_id: null,
            resource_id: null
          }])
          .select()
        
        if (!error) {
          console.log('✅ Like added successfully:', data)
          setLiked(true)
          
          // Rafraîchir le compteur depuis la base de données
          const { data: updatedArticle } = await supabase
            .from('articles')
            .select('likes_count')
            .eq('id', article.id)
            .single()
          
          if (updatedArticle) {
            console.log('📊 Likes count refreshed from DB:', updatedArticle.likes_count)
            setLikesCount(updatedArticle.likes_count)
          }
        } else {
          console.error('❌ Error adding like:', error)
        }
      }
    } catch (err) {
      console.error('❌ Error toggling like:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatContent = (content: string) => {
    // Simple Markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Article non trouvé</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/articles">
              <Button>Retour aux articles</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAuthor = user?.id === article.author_id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/articles">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux articles
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {isAuthor && (
                <Link href={`/articles/${article.slug}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="space-y-8">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {categories.find(c => c.value === article.category)?.label || article.category}
              </Badge>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Eye className="h-3 w-3" />
                {viewsCount} vues
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{article.author?.display_name || 'Auteur anonyme'}</span>
                {article.author?.role && (
                  <Badge variant="outline" className="text-xs">
                    {article.author.role}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(article.created_at)}
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4">${formatContent(article.content)}</p>` 
                }}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user && (
                    <Button 
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={toggleLike}
                      className={liked ? "bg-red-500 hover:bg-red-600" : ""}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                      {likesCount} J'aime
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    {commentsCount} commentaires
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user && !isAuthor && (
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Signaler
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentsSection 
            articleId={article.id} 
            onCommentCountChange={(count) => setCommentsCount(count)}
          />
        </article>
      </div>
    </div>
  )
}