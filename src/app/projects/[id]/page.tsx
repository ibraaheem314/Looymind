'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Eye, ArrowLeft, Loader2, Star, Github, ExternalLink, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CommentsSection from '@/components/comments/comments-section'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { projects, loading, error, fetchProjects } = useProjects()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (id && projects.length > 0) {
      const foundProject = projects.find(p => p.id === id)
      if (foundProject) {
        setProject(foundProject)
        // Increment views
        console.log(`Incrementing views for project: ${foundProject.title}`)
      } else if (!loading && !error) {
        router.push('/projects')
      }
    } else if (!loading && !error && projects.length === 0) {
      fetchProjects()
    }
  }, [id, projects, loading, error, router, fetchProjects])

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-slate-800" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/projects')} className="mb-8 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Button>

        <Card className="overflow-hidden">
          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-64 object-cover"
            />
          )}
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{project.category}</Badge>
              {project.featured && (
                <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 border-yellow-300 bg-yellow-50">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  Projet vedette
                </Badge>
              )}
              {project.status !== 'published' && (
                <Badge variant="destructive">{project.status}</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-700 mb-6">{project.description}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{project.author_name || 'Auteur'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(project.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{project.views.toLocaleString()} vues</span>
              </div>
            </div>

            {project.content && (
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.content}
                </ReactMarkdown>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Technologies utilisées :</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <Button asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    Code source
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button variant="outline" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Voir la démo
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentsSection
            entityType="project"
            entityId={project.id}
            title="Commentaires du projet"
            description="Partagez vos questions, suggestions et retours sur ce projet"
          />
        </div>
      </div>
    </div>
  )
}
