'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, ExternalLink, Eye, Heart, User, Calendar,
  BookOpen, Video, FileText, Code, Wrench, GraduationCap,
  Share2, Loader2, Globe, Clock, Award, BookMarked, Shield
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { createClient } from '@/lib/supabase'
import ModerationModal from '@/components/moderation/moderation-modal'
import { useRouter } from 'next/navigation'

const resourceTypeConfig = {
  external_course: { label: 'Cours externe', icon: Globe, color: 'bg-blue-100 text-blue-800' },
  local_course: { label: 'Cours local', icon: GraduationCap, color: 'bg-green-100 text-green-800' },
  documentation: { label: 'Documentation', icon: FileText, color: 'bg-slate-100 text-slate-800' },
  video: { label: 'Vidéo', icon: Video, color: 'bg-red-100 text-red-800' },
  tutorial: { label: 'Tutoriel', icon: Code, color: 'bg-purple-100 text-purple-800' },
  tool: { label: 'Outil', icon: Wrench, color: 'bg-orange-100 text-orange-800' },
  article: { label: 'Article', icon: BookMarked, color: 'bg-pink-100 text-pink-800' }
}

const difficultyConfig = {
  beginner: { label: 'Débutant', color: 'bg-green-100 text-green-800' },
  intermediate: { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  advanced: { label: 'Avancé', color: 'bg-orange-100 text-orange-800' },
  expert: { label: 'Expert', color: 'bg-red-100 text-red-800' }
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModerateModal, setShowModerateModal] = useState(false)
  const { user, profile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchResource()
  }, [params.slug])

  const fetchResource = async () => {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          author:profiles!created_by(
            id,
            display_name,
            avatar_url,
            role,
            bio
          )
        `)
        .eq('slug', params.slug)
        .eq('status', 'published')
        .eq('visibility', 'public')
        .single()

      if (error) throw error

      setResource(data)
      
      // Increment views
      await supabase
        .from('resources')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id)
    } catch (err: any) {
      console.error('Error fetching resource:', err)
      setError(err.message || 'Erreur lors du chargement de la ressource')
    } finally {
      setLoading(false)
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

  const typeConfig = resourceTypeConfig[resource.type as keyof typeof resourceTypeConfig] || resourceTypeConfig.external_course
  const TypeIcon = typeConfig.icon
  const difficultyLabel = resource.difficulty ? difficultyConfig[resource.difficulty as keyof typeof difficultyConfig] : null

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Design Kaggle+Zindi */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/resources">
              <Button variant="ghost" className="text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux ressources
              </Button>
            </Link>

            {profile?.role === 'admin' && resource.created_by !== user?.id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowModerateModal(true)}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Modérer
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Icon/Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex items-center justify-center aspect-square">
                {resource.cover_image_url ? (
                  <img
                    src={resource.cover_image_url}
                    alt={resource.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <TypeIcon className="h-32 w-32 text-green-500" />
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${typeConfig.color} border-0 text-sm px-3 py-1`}>
                  <TypeIcon className="h-3.5 w-3.5 mr-1.5" />
                  {typeConfig.label}
                </Badge>
                {resource.is_local && (
                  <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-3 py-1">
                    🇸🇳 Cours local
                  </Badge>
                )}
                {difficultyLabel && (
                  <Badge className={`${difficultyLabel.color} border-0 text-sm px-3 py-1`}>
                    {difficultyLabel.label}
                  </Badge>
                )}
                {resource.is_free && (
                  <Badge className="bg-green-500 text-white border-0 text-sm px-3 py-1">
                    Gratuit
                  </Badge>
                )}
                {resource.has_certificate && (
                  <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-3 py-1">
                    <Award className="h-3.5 w-3.5 mr-1.5" />
                    Certificat
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">{resource.title}</h1>
              
              {resource.source && (
                <p className="text-lg text-slate-600 mb-4">
                  Par <span className="font-semibold text-green-600">{resource.source}</span>
                </p>
              )}

              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                {resource.description || 'Aucune description disponible'}
              </p>

              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{resource.views_count} vues</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{resource.likes_count} likes</span>
                </div>
                {resource.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{resource.duration_hours}h de cours</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(resource.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </span>
                </div>
              </div>

              {/* CTA Principal */}
              {resource.url && (
                resource.type === 'article' && resource.url.startsWith('/') ? (
                  <Link href={resource.url}>
                    <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 text-base px-8">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Lire l'article
                    </Button>
                  </Link>
                ) : (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Button size="lg" className="bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30 text-base px-8">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Accéder à la ressource
                    </Button>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* What You'll Learn */}
            {resource.curator_notes && (
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <GraduationCap className="h-5 w-5" />
                    Ce que vous allez apprendre
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {resource.curator_notes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compétences couvertes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="px-3 py-1.5 text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Auteur / Curator */}
            {resource.author && Array.isArray(resource.author) && resource.author[0] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajouté par</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {resource.author[0].avatar_url ? (
                        <img
                          src={resource.author[0].avatar_url}
                          alt={resource.author[0].display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-lg">
                        {resource.author[0].display_name}
                      </p>
                      {resource.author[0].role && (
                        <p className="text-sm text-green-600 capitalize font-medium">
                          {resource.author[0].role}
                        </p>
                      )}
                      {resource.author[0].bio && (
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {resource.author[0].bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* CTA Card */}
            {resource.url && (
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6 space-y-3">
                  {resource.type === 'article' && resource.url.startsWith('/') ? (
                    <Link href={resource.url} className="block">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg" size="lg">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Lire l'article
                      </Button>
                    </Link>
                  ) : (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg" size="lg">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Commencer maintenant
                      </Button>
                    </a>
                  )}
                  
                  <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
                    <Heart className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>

                  <Button variant="outline" className="w-full border-green-200 hover:bg-green-50">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Informations détaillées */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Type
                  </span>
                  <Badge className={`${typeConfig.color} border-0`}>
                    {typeConfig.label}
                  </Badge>
                </div>
                
                {resource.source && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Source
                    </span>
                    <span className="font-semibold text-green-600">
                      {resource.source}
                      {resource.type === 'article' && resource.is_local && (
                        <Badge className="ml-2 bg-cyan-100 text-cyan-700 border-0 text-xs">
                          🇸🇳 Communauté
                        </Badge>
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Catégorie
                  </span>
                  <span className="font-medium capitalize">{resource.category.replace('-', ' ')}</span>
                </div>
                
                {resource.difficulty && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Niveau
                    </span>
                    <Badge className={`${difficultyLabel?.color} border-0`}>
                      {difficultyLabel?.label}
                    </Badge>
                  </div>
                )}

                {resource.duration_hours && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Durée
                    </span>
                    <span className="font-medium">{resource.duration_hours}h</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Langue</span>
                  <span className="font-medium uppercase">{resource.language}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Prix</span>
                  <Badge className={resource.is_free ? "bg-green-500 text-white border-0" : "bg-orange-100 text-orange-800 border-0"}>
                    {resource.is_free ? 'Gratuit' : (resource.price_fcfa ? `${resource.price_fcfa} FCFA` : 'Payant')}
                  </Badge>
                </div>

                {resource.has_certificate && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Certificat</span>
                    <Badge className="bg-purple-100 text-purple-700 border-0">
                      ✓ Disponible
                    </Badge>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Ajouté {formatDistanceToNow(new Date(resource.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Moderation Modal */}
      {profile?.role === 'admin' && resource && (
        <ModerationModal
          open={showModerateModal}
          onOpenChange={setShowModerateModal}
          contentType="article"
          contentId={resource.id}
          contentTitle={resource.title}
          authorId={resource.created_by || ''}
          authorName={resource.author?.display_name || 'Utilisateur inconnu'}
          onSuccess={() => {
            router.push('/resources')
          }}
        />
      )}
    </div>
  )
}
