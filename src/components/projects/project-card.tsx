'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink, Users, Star, GitFork, Calendar, Code, Eye } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'archived'
  github_url?: string
  demo_url?: string
  tags: string[]
  contributors_count: number
  stars_count: number
  forks_count: number
  created_at: string
  updated_at: string
  author: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

interface ProjectCardProps {
  project: Project
}

const statusLabels = {
  active: 'Actif',
  completed: 'Terminé',
  archived: 'Archivé'
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800'
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className={statusColors[project.status]}>
            {statusLabels[project.status]}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-slate-600 transition-colors line-clamp-2">
          {project.title}
        </CardTitle>
        
        <CardDescription className="text-gray-600 leading-relaxed line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {project.author.avatar_url ? (
              <img
                src={project.author.avatar_url}
                alt={project.author.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{project.author.display_name}</p>
            <p className="text-xs text-gray-500">{project.category}</p>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <Star className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {project.stars_count}
            </div>
            <div className="text-xs text-gray-600">Stars</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {project.contributors_count}
            </div>
            <div className="text-xs text-gray-600">Contributeurs</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <GitFork className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {project.forks_count}
            </div>
            <div className="text-xs text-gray-600">Forks</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {project.github_url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                Code
              </a>
            </Button>
          )}
          {project.demo_url && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Demo
              </a>
            </Button>
          )}
          <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white" asChild>
            <Link href={`/projects/${project.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}