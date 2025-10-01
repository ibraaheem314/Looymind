'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, Eye, MessageCircle, Users, ExternalLink, Github, 
  Calendar, Clock, Code, Smartphone, Monitor, Brain, Database, FlaskConical,
  Bookmark, Share2, MoreHorizontal
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    short_description: string
    cover_image_url: string
    project_type: string
    status: string
    author_name: string
    author_avatar: string
    likes_count: number
    views_count: number
    comments_count: number
    collaborators_count: number
    created_at: string
    live_url?: string
    github_url?: string
    technologies?: string[]
    tags?: string[]
  }
  viewMode?: 'grid' | 'list'
  showActions?: boolean
  onLike?: (projectId: string, liked: boolean) => void
  onBookmark?: (projectId: string, bookmarked: boolean) => void
  onShare?: (projectId: string) => void
}

const PROJECT_TYPES = [
  { value: 'web', label: 'Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'IA', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

export default function ProjectCard({ 
  project, 
  viewMode = 'grid', 
  showActions = true,
  onLike,
  onBookmark,
  onShare
}: ProjectCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(project.likes_count)

  const getProjectTypeConfig = (type: string) => {
    return PROJECT_TYPES.find(t => t.value === type) || PROJECT_TYPES[0]
  }

  const typeConfig = getProjectTypeConfig(project.project_type)
  const TypeIcon = typeConfig.icon

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    
    if (onLike) {
      onLike(project.id, newLiked)
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newBookmarked = !bookmarked
    setBookmarked(newBookmarked)
    
    if (onBookmark) {
      onBookmark(project.id, newBookmarked)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onShare) {
      onShare(project.id)
    }
  }

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <Link href={`/projects/${project.slug}`}>
          <CardContent className="p-0">
            <div className="flex">
              {/* Image */}
              <div className="w-32 h-24 bg-gray-100 rounded-l-lg overflow-hidden flex-shrink-0">
                {project.cover_image_url ? (
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <TypeIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${typeConfig.color} border-0 text-xs`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeConfig.label}
                      </Badge>
                      <span className="text-xs text-gray-500 capitalize">{project.status}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-slate-600 mb-1">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {project.short_description}
                    </p>

                    {/* Auteur et date */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                          {project.author_avatar ? (
                            <img
                              src={project.author_avatar}
                              alt={project.author_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                              {project.author_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span>{project.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                  </div>

                  {/* Actions et stats */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {likesCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {project.comments_count}
                      </div>
                    </div>

                    {showActions && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLike}
                          className={`h-8 w-8 p-0 ${liked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBookmark}
                          className={`h-8 w-8 p-0 ${bookmarked ? 'text-blue-500' : 'text-gray-500'}`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleShare}
                          className="h-8 w-8 p-0 text-gray-500"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  // Mode grille
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <Link href={`/projects/${project.slug}`}>
        <CardContent className="p-0">
          {/* Image de couverture */}
          <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <TypeIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {/* Badge type */}
            <div className="absolute top-3 left-3">
              <Badge className={`${typeConfig.color} border-0`}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeConfig.label}
              </Badge>
            </div>

            {/* Actions rapides */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {project.live_url && (
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                {project.github_url && (
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Github className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Overlay avec actions */}
            {showActions && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLike}
                    className={`h-8 w-8 p-0 ${liked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBookmark}
                    className={`h-8 w-8 p-0 ${bookmarked ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
                    className="h-8 w-8 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-slate-600">
                {project.title}
              </h3>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {project.short_description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Auteur */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                {project.author_avatar ? (
                  <img
                    src={project.author_avatar}
                    alt={project.author_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                    {project.author_name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">{project.author_name}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {project.views_count}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {likesCount}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {project.comments_count}
                </div>
                {project.collaborators_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {project.collaborators_count}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                <Calendar className="h-3 w-3 inline mr-1" />
                {format(new Date(project.created_at), 'dd MMM', { locale: fr })}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}