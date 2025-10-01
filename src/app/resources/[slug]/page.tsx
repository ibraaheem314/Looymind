'use client'

import { use, useEffect } from 'react'
import { useResource } from '@/hooks/useResources'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, ExternalLink, Eye, Heart, User, Calendar,
  BookOpen, Video, FileText, Database, Wrench, BookMarked,
  Share2, Download, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

const resourceTypeConfig = {
  tutorial: { label: 'Tutoriel', icon: BookOpen, color: 'bg-blue-100 text-blue-800' },
  documentation: { label: 'Documentation', icon: FileText, color: 'bg-green-100 text-green-800' },
  video: { label: 'Vidéo', icon: Video, color: 'bg-red-100 text-red-800' },
  dataset: { label: 'Dataset', icon: Database, color: 'bg-purple-100 text-purple-800' },
  tool: { label: 'Outil', icon: Wrench, color: 'bg-orange-100 text-orange-800' },
  book: { label: 'Livre', icon: BookMarked, color: 'bg-pink-100 text-pink-800' }
}

const difficultyConfig = {
  debutant: { label: 'Débutant', color: 'bg-green-100 text-green-800' },
  intermediaire: { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  avance: { label: 'Avancé', color: 'bg-red-100 text-red-800' }
}

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { resource, loading, error } = useResource(resolvedParams.slug)
  const { user } = useAuth()

  // Increment views on mount
  useEffect(() => {
    if (resource) {
      incrementViews()
    }
  }, [resource])

  const incrementViews = async () => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      
      await supabase
        .from('resources')
        .update({ views_count: (resource?.views_count || 0) + 1 })
        .eq('id', resource?.id)
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-slate-800" />
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Ressource introuvable</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Cette ressource n\'existe pas ou a été supprimée.'}
            </p>
            <Link href="/resources">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux ressources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typeConfig = resourceTypeConfig[resource.resource_type]
  const TypeIcon = typeConfig.icon
  const difficultyLabel = resource.difficulty ? difficultyConfig[resource.difficulty] : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/resources">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux ressources
            </Button>
          </Link>

          <div className="flex items-start gap-4">
            {/* Icon/Image */}
            <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
              {resource.cover_image_url ? (
                <img
                  src={resource.cover_image_url}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TypeIcon className="h-10 w-10 text-white/70" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${typeConfig.color} border-0`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeConfig.label}
                </Badge>
                {difficultyLabel && (
                  <Badge className={`${difficultyLabel.color} border-0`}>
                    {difficultyLabel.label}
                  </Badge>
                )}
                {resource.is_free && (
                  <Badge className="bg-green-500 text-white border-0">
                    Gratuit
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
              <p className="text-slate-200 text-lg mb-4">
                {resource.description || 'Aucune description disponible'}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{resource.views_count} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{resource.likes_count} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(resource.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description complète */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de cette ressource</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {resource.description || 'Aucune description disponible pour cette ressource.'}
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Commentaires (à implémenter) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <p>Système de commentaires à venir</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Accéder à la ressource
                  </Button>
                </a>
                
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>

                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </CardContent>
            </Card>

            {/* Auteur */}
            {resource.author && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Auteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                      {resource.author.avatar_url ? (
                        <img
                          src={resource.author.avatar_url}
                          alt={resource.author.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {resource.author.display_name}
                      </p>
                      {(resource.author as any).role && (
                        <p className="text-sm text-gray-500 capitalize">
                          {(resource.author as any).role}
                        </p>
                      )}
                    </div>
                  </div>
                  {(resource.author as any).bio && (
                    <p className="text-sm text-gray-600 mt-3">
                      {(resource.author as any).bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Métadonnées */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium">{resource.category}</span>
                </div>
                {resource.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Niveau</span>
                    <Badge className={`${difficultyLabel?.color} border-0`}>
                      {difficultyLabel?.label}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{typeConfig.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Publié le</span>
                  <span className="font-medium">
                    {format(new Date(resource.created_at), 'd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-medium text-green-600">
                    {resource.is_free ? 'Gratuit' : 'Payant'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
