'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Eye, Heart, Tag, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  excerpt: string
  slug: string
  author_id: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  tags: string[]
  category: string
  image_url?: string
  views: number
  likes: number
  created_at: string
  updated_at: string
  published_at?: string
  profiles?: {
    display_name: string
    avatar_url?: string
  }
}

interface ArticleCardProps {
  article: Article
  showAuthor?: boolean
  showStats?: boolean
}

export default function ArticleCard({ 
  article, 
  showAuthor = true, 
  showStats = true 
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'IA': 'bg-blue-100 text-blue-800',
      'Data Science': 'bg-green-100 text-green-800',
      'Machine Learning': 'bg-purple-100 text-purple-800',
      'Tutoriel': 'bg-orange-100 text-orange-800',
      'Actualité': 'bg-red-100 text-red-800',
      'Projet': 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden">
      {/* Image de l'article */}
      {article.image_url && (
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.featured && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                À la une
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
            {article.category}
          </Badge>
          {article.status === 'draft' && (
            <Badge variant="outline" className="text-xs">
              Brouillon
            </Badge>
          )}
        </div>

        <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-3">
          {article.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Informations de l'auteur et date */}
        {showAuthor && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              {article.profiles?.avatar_url ? (
                <Image
                  src={article.profiles.avatar_url}
                  alt={article.profiles.display_name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
              <span>{article.profiles?.display_name || 'Auteur'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {article.published_at 
                  ? formatDate(article.published_at)
                  : formatDate(article.created_at)
                }
              </span>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {showStats && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{article.likes}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>5 min de lecture</span>
            </div>
          </div>
        )}

        {/* Bouton de lecture */}
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={`/articles/${article.slug}`}>
              Lire l'article
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
