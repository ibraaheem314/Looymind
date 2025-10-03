'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, ArrowLeft, Shield, Eye, Trash2, CheckCircle, XCircle, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Resource {
  id: string
  title: string
  slug: string
  type: string
  url: string
  source: string
  language: string
  difficulty: string
  is_local: boolean
  created_at: string
}

export default function ResourcesModeration() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchResources()
    }
  }, [isAdmin])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      setResources((data || []) as Resource[])
    } catch (err) {
      console.error('Error fetching resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteResource = async (id: string) => {
    if (!confirm('Supprimer cette ressource définitivement ?')) return
    try {
      setProcessingId(id)
      const { error } = await supabase.from('resources').delete().eq('id', id)
      if (error) throw error
      await fetchResources()
      alert('Ressource supprimée')
    } catch (err: any) {
      alert('Erreur lors de la suppression')
    } finally {
      setProcessingId(null)
    }
  }

  const difficultyColors: Record<string, string> = {
    'beginner': 'bg-green-100 text-green-800',
    'intermediate': 'bg-blue-100 text-blue-800',
    'advanced': 'bg-orange-100 text-orange-800',
    'expert': 'bg-red-100 text-red-800'
  }

  const typeColors: Record<string, string> = {
    'course': 'bg-purple-100 text-purple-800',
    'tutorial': 'bg-blue-100 text-blue-800',
    'article': 'bg-green-100 text-green-800',
    'video': 'bg-red-100 text-red-800',
    'tool': 'bg-indigo-100 text-indigo-800',
    'documentation': 'bg-gray-100 text-gray-800'
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
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
                <Activity className="h-8 w-8 text-indigo-500" />
                Modération des Ressources
              </h1>
              <p className="text-gray-600 mt-1">Valider et gérer les ressources éducatives</p>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{resources.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Externes</p>
              <p className="text-2xl font-bold text-blue-600">
                {resources.filter(r => !r.is_local).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Locales</p>
              <p className="text-2xl font-bold text-purple-600">
                {resources.filter(r => r.is_local).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Français</p>
              <p className="text-2xl font-bold text-green-600">
                {resources.filter(r => r.language === 'fr').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          </div>
        ) : resources.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune ressource
              </h3>
              <p className="text-gray-600">Les ressources apparaîtront ici</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        {resource.is_local ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            🏠 Local
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">
                            🌐 Externe
                          </Badge>
                        )}
                        <Badge className={typeColors[resource.type] || 'bg-gray-100 text-gray-800'}>
                          {resource.type}
                        </Badge>
                        <Badge className={difficultyColors[resource.difficulty] || 'bg-gray-100 text-gray-800'}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📚 {resource.source}</span>
                        <span>🌍 {resource.language === 'fr' ? 'Français' : resource.language === 'en' ? 'Anglais' : resource.language}</span>
                        <span>{format(new Date(resource.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                      </div>
                      {!resource.is_local && resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {resource.url}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/resources/${resource.slug}`} target="_blank">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteResource(resource.id)}
                        disabled={processingId === resource.id}
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
      </div>
    </div>
  )
}

