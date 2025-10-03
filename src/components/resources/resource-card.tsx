'use client'

import { Resource } from '@/hooks/useResources'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, Video, FileText, Database, Wrench, 
  BookMarked, Eye, Heart, Clock, User, ExternalLink 
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ResourceCardProps {
  resource: Resource
  onLike?: () => void
  isLiked?: boolean
}

const resourceTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
  external_course: { label: 'Cours externe', icon: BookOpen, color: 'bg-blue-100 text-blue-800' },
  local_course: { label: 'Cours local 🇸🇳', icon: BookMarked, color: 'bg-orange-100 text-orange-800' },
  tutorial: { label: 'Tutoriel', icon: BookOpen, color: 'bg-cyan-100 text-cyan-800' },
  documentation: { label: 'Documentation', icon: FileText, color: 'bg-green-100 text-green-800' },
  video: { label: 'Vidéo', icon: Video, color: 'bg-red-100 text-red-800' },
  article: { label: 'Article', icon: FileText, color: 'bg-purple-100 text-purple-800' },
  tool: { label: 'Outil', icon: Wrench, color: 'bg-yellow-100 text-yellow-800' }
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Débutant', color: 'bg-green-50 text-green-700 border-green-200' },
  intermediate: { label: 'Intermédiaire', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  advanced: { label: 'Avancé', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  expert: { label: 'Expert', color: 'bg-red-50 text-red-700 border-red-200' }
}

export function ResourceCard({ resource, onLike, isLiked }: ResourceCardProps) {
  const typeConfig = resourceTypeConfig[resource.type || resource.resource_type] || resourceTypeConfig.external_course
  const TypeIcon = typeConfig?.icon || BookOpen
  
  const difficultyLabel = resource.difficulty 
    ? difficultyConfig[resource.difficulty]
    : null

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Image de couverture */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {resource.cover_image_url ? (
          <img
            src={resource.cover_image_url}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TypeIcon className="h-16 w-16 text-slate-300" />
          </div>
        )}
        
        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeConfig.color} border-0 shadow-sm`}>
            <TypeIcon className="h-3 w-3 mr-1" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Badge gratuit */}
        {resource.is_free && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white border-0 shadow-sm">
              Gratuit
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Titre */}
        <Link href={`/resources/${resource.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-slate-600 transition-colors">
            {resource.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {resource.description || 'Aucune description disponible'}
        </p>

        {/* Métadonnées */}
        <div className="space-y-2">
          {/* Catégorie & Difficulté */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {resource.category}
            </Badge>
            {difficultyLabel && (
              <Badge variant="outline" className={`text-xs ${difficultyLabel.color}`}>
                {difficultyLabel.label}
              </Badge>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t mt-auto">
        <div className="w-full space-y-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{resource.views_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{resource.likes_count}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(resource.created_at), { 
                addSuffix: true, 
                locale: fr 
              })}
            </div>
          </div>

          {/* Auteur */}
          {resource.author && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span className="truncate">{resource.author.display_name}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/resources/${resource.slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Voir la ressource
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLike}
              className={isLiked ? 'border-red-200 bg-red-50' : ''}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
