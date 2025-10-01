'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, Heart, MessageCircle, Users, GitBranch, 
  Calendar, Clock, TrendingUp, Star, Code,
  ExternalLink, Github, Play, FileText
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProjectStatsProps {
  project: {
    id: string
    title: string
    views_count: number
    likes_count: number
    comments_count: number
    collaborators_count: number
    created_at: string
    started_at?: string
    completed_at?: string
    launched_at?: string
    live_url?: string
    github_url?: string
    demo_url?: string
    documentation_url?: string
    technologies?: Array<{
      technology: string
      category: string
      proficiency_level: string
    }>
    tags?: string[]
  }
  showDetails?: boolean
  showActions?: boolean
}

export default function ProjectStats({ 
  project, 
  showDetails = true, 
  showActions = true 
}: ProjectStatsProps) {
  const [stats, setStats] = useState({
    views: project.views_count,
    likes: project.likes_count,
    comments: project.comments_count,
    collaborators: project.collaborators_count
  })

  const getEngagementScore = () => {
    const total = stats.views + stats.likes + stats.comments
    if (total === 0) return 0
    
    const engagement = ((stats.likes + stats.comments) / stats.views) * 100
    return Math.min(Math.round(engagement), 100)
  }

  const getProjectDuration = () => {
    if (!project.started_at) return null
    
    const start = new Date(project.started_at)
    const end = project.completed_at ? new Date(project.completed_at) : new Date()
    const duration = end.getTime() - start.getTime()
    
    const days = Math.floor(duration / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    
    if (months > 0) return `${months} mois`
    if (weeks > 0) return `${weeks} semaines`
    return `${days} jours`
  }

  const getProjectStatus = () => {
    if (project.completed_at) return { label: 'Terminé', color: 'bg-green-100 text-green-800' }
    if (project.launched_at) return { label: 'Lancé', color: 'bg-blue-100 text-blue-800' }
    if (project.started_at) return { label: 'En cours', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Planifié', color: 'bg-gray-100 text-gray-800' }
  }

  const status = getProjectStatus()
  const engagementScore = getEngagementScore()
  const duration = getProjectDuration()

  return (
    <div className="space-y-4">
      {/* Stats principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-2xl font-bold">{stats.views}</span>
              </div>
              <p className="text-sm text-gray-600">Vues</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-2xl font-bold">{stats.likes}</span>
              </div>
              <p className="text-sm text-gray-600">Likes</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-2xl font-bold">{stats.comments}</span>
              </div>
              <p className="text-sm text-gray-600">Commentaires</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold">{stats.collaborators}</span>
              </div>
              <p className="text-sm text-gray-600">Collaborateurs</p>
            </div>
          </div>

          {/* Score d'engagement */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Engagement</span>
              <span className="text-sm text-gray-600">{engagementScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations du projet */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Statut */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Statut</span>
              <Badge className={`${status.color} border-0`}>
                {status.label}
              </Badge>
            </div>

            {/* Durée */}
            {duration && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Durée</span>
                <span className="text-sm font-medium">{duration}</span>
              </div>
            )}

            {/* Dates */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Créé</span>
                <span>{format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              
              {project.started_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Démarré</span>
                  <span>{format(new Date(project.started_at), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
              )}
              
              {project.completed_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Terminé</span>
                  <span>{format(new Date(project.completed_at), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liens externes */}
      {showActions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Liens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Site web</span>
              </a>
            )}
            
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <Github className="h-4 w-4 text-gray-700" />
                <span className="text-sm">Code source</span>
              </a>
            )}
            
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <Play className="h-4 w-4 text-green-500" />
                <span className="text-sm">Démo</span>
              </a>
            )}
            
            {project.documentation_url && (
              <a
                href={project.documentation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Documentation</span>
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.technologies.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium">{tech.technology}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {tech.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {tech.proficiency_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
