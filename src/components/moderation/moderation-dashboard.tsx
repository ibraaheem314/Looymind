'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  User, 
  MessageCircle, 
  FileText, 
  Code,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'

interface Report {
  id: string;
  entity_type: 'project' | 'article' | 'comment' | 'user';
  entity_id: string;
  reporter_id: string;
  reason: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
  moderator_id?: string;
  moderator_notes?: string;
}

export default function ModerationDashboard() {
  const { user, profile } = useAuth()
  const supabase = createClient()
  
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTab, setSelectedTab] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')

  // Vérifier les permissions de modération
  const canModerate = profile?.role === 'admin' || profile?.role === 'moderator'

  useEffect(() => {
    if (canModerate) {
      fetchReports()
    }
  }, [canModerate])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des signalements')
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (reportId: string, action: 'reviewed' | 'resolved' | 'dismissed', notes?: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: action,
          moderator_id: user?.id,
          moderator_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) throw error
      
      // Refresh reports
      await fetchReports()
    } catch (err) {
      console.error('Error updating report:', err)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'project': return <Code className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'comment': return <MessageCircle className="h-4 w-4" />
      case 'user': return <User className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesStatus = selectedTab === 'all' || report.status === selectedTab
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (!canModerate) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder au tableau de modération.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des signalements...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchReports}>Réessayer</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de modération</h1>
          <p className="text-gray-600">Gérez les signalements et maintenez la qualité du contenu</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            {profile?.role === 'admin' ? 'Administrateur' : 'Modérateur'}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'En attente', count: reports.filter(r => r.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'En cours', count: reports.filter(r => r.status === 'reviewed').length, color: 'text-blue-600' },
          { label: 'Résolus', count: reports.filter(r => r.status === 'resolved').length, color: 'text-green-600' },
          { label: 'Total', count: reports.length, color: 'text-gray-600' }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher dans les signalements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filtres</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="reviewed">En cours</TabsTrigger>
          <TabsTrigger value="resolved">Résolus</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun signalement</h3>
                <p className="text-gray-600">
                  {selectedTab === 'all' 
                    ? 'Aucun signalement trouvé.' 
                    : `Aucun signalement ${selectedTab === 'pending' ? 'en attente' : selectedTab === 'reviewed' ? 'en cours' : 'résolu'}.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          {getEntityIcon(report.entity_type)}
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {report.entity_type}
                          </span>
                        </div>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Raison: {reportReasons.find(r => r.value === report.reason)?.label || report.reason}
                        </h3>
                        <p className="text-gray-600 text-sm">{report.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Signalé le {new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>ID: {report.entity_id.substring(0, 8)}...</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleReportAction(report.id, 'reviewed')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Examiner
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'dismissed')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {report.status === 'reviewed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleReportAction(report.id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Résoudre
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'dismissed')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const reportReasons = [
  { value: 'spam', label: 'Spam ou contenu promotionnel' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'harassment', label: 'Harcèlement ou intimidation' },
  { value: 'hate_speech', label: 'Discours de haine' },
  { value: 'violence', label: 'Contenu violent' },
  { value: 'misinformation', label: 'Désinformation' },
  { value: 'copyright', label: 'Violation de droits d\'auteur' },
  { value: 'privacy', label: 'Violation de la vie privée' },
  { value: 'other', label: 'Autre' }
]

