'use client'

import { useState, useEffect } from 'react'
import { useAuth, useProfile } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, Users, Search, Ban, AlertCircle, CheckCircle, 
  Clock, Edit, Trash2, User, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface UserProfile {
  id: string
  email: string
  display_name: string
  role: string
  account_status: string
  avatar_url: string | null
  created_at: string
  last_sign_in_at: string | null
  articles_count?: number
  projects_count?: number
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  member: { label: 'Membre', color: 'bg-gray-100 text-gray-800' },
  mentor: { label: 'Mentor', color: 'bg-blue-100 text-blue-800' },
  org: { label: 'Organisation', color: 'bg-purple-100 text-purple-800' },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800' }
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  warned: { label: 'Averti', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  suspended: { label: 'Suspendu', color: 'bg-orange-100 text-orange-800', icon: Clock },
  banned: { label: 'Banni', color: 'bg-red-100 text-red-800', icon: Ban }
}

export default function UsersModeration() {
  const { user } = useAuth()
  const { isAdmin } = useProfile()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin, filterRole, filterStatus])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterRole !== 'all') {
        query = query.eq('role', filterRole)
      }

      if (filterStatus !== 'all') {
        query = query.eq('account_status', filterStatus)
      }

      const { data, error } = await query.limit(100)

      if (error) throw error

      // Get articles and projects count for each user
      const usersWithCounts = await Promise.all(
        (data || []).map(async (profile) => {
          const [articlesResult, projectsResult] = await Promise.all([
            supabase.from('articles').select('id', { count: 'exact', head: true }).eq('author_id', profile.id),
            supabase.from('projects').select('id', { count: 'exact', head: true }).eq('author_id', profile.id)
          ])

          return {
            ...profile,
            articles_count: articlesResult.count || 0,
            projects_count: projectsResult.count || 0
          }
        })
      )

      setUsers(usersWithCounts as UserProfile[])
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setProcessingId(userId)
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      await fetchUsers()
      alert('Rôle mis à jour avec succès')
    } catch (err: any) {
      console.error('Error updating role:', err)
      alert('Erreur lors de la mise à jour du rôle')
    } finally {
      setProcessingId(null)
    }
  }

  const banUser = async (userId: string) => {
    const reason = prompt('Raison du bannissement :')
    if (!reason) return

    try {
      setProcessingId(userId)

      // Create sanction
      await supabase.from('user_sanctions').insert({
        user_id: userId,
        sanction_type: 'ban',
        reason,
        issued_by: user?.id
      })

      await fetchUsers()
      alert('Utilisateur banni avec succès')
    } catch (err: any) {
      console.error('Error banning user:', err)
      alert('Erreur lors du bannissement')
    } finally {
      setProcessingId(null)
    }
  }

  const suspendUser = async (userId: string) => {
    const days = prompt('Durée de la suspension (en jours) :')
    if (!days) return

    const reason = prompt('Raison de la suspension :')
    if (!reason) return

    try {
      setProcessingId(userId)

      const endDate = new Date()
      endDate.setDate(endDate.getDate() + parseInt(days))

      await supabase.from('user_sanctions').insert({
        user_id: userId,
        sanction_type: 'suspension',
        reason,
        issued_by: user?.id,
        end_date: endDate.toISOString()
      })

      await fetchUsers()
      alert('Utilisateur suspendu avec succès')
    } catch (err: any) {
      console.error('Error suspending user:', err)
      alert('Erreur lors de la suspension')
    } finally {
      setProcessingId(null)
    }
  }

  const reactivateUser = async (userId: string) => {
    if (!confirm('Réactiver cet utilisateur ?')) return

    try {
      setProcessingId(userId)

      // Deactivate all active sanctions
      await supabase
        .from('user_sanctions')
        .update({ active: false })
        .eq('user_id', userId)
        .eq('active', true)

      // Update profile status
      await supabase
        .from('profiles')
        .update({ account_status: 'active' })
        .eq('id', userId)

      await fetchUsers()
      alert('Utilisateur réactivé avec succès')
    } catch (err: any) {
      console.error('Error reactivating user:', err)
      alert('Erreur lors de la réactivation')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredUsers = users.filter(u =>
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">
              Vous devez être administrateur pour accéder à cette page.
            </p>
            <Link href="/dashboard">
              <Button>Retour au Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600 mt-1">
                Gérer les rôles, permissions et sanctions des utilisateurs
              </p>
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
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter by Role */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tous les rôles</option>
                <option value="member">Membres</option>
                <option value="mentor">Mentors</option>
                <option value="org">Organisations</option>
                <option value="admin">Admins</option>
              </select>

              {/* Filter by Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="warned">Avertis</option>
                <option value="suspended">Suspendus</option>
                <option value="banned">Bannis</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.account_status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Suspendus</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {users.filter(u => u.account_status === 'suspended').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bannis</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.account_status === 'banned').length}
                  </p>
                </div>
                <Ban className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-gray-600">
                Essayez avec d'autres filtres
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userProfile) => {
              const roleConfig = ROLE_LABELS[userProfile.role] || ROLE_LABELS.member
              const statusConfig = STATUS_LABELS[userProfile.account_status] || STATUS_LABELS.active
              const StatusIcon = statusConfig.icon

              return (
                <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                          {userProfile.avatar_url ? (
                            <img
                              src={userProfile.avatar_url}
                              alt={userProfile.display_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-blue-600" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {userProfile.display_name || 'Sans nom'}
                            </h3>
                            <Badge className={roleConfig.color}>
                              {roleConfig.label}
                            </Badge>
                            <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{userProfile.email}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📝 {userProfile.articles_count || 0} articles</span>
                            <span>🚀 {userProfile.projects_count || 0} projets</span>
                            <span>
                              Inscrit le {format(new Date(userProfile.created_at), 'dd MMM yyyy', { locale: fr })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {userProfile.id !== user?.id && (
                        <div className="flex items-center gap-2 ml-4">
                          {/* Change Role */}
                          <select
                            value={userProfile.role}
                            onChange={(e) => updateUserRole(userProfile.id, e.target.value)}
                            disabled={processingId === userProfile.id}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="member">Membre</option>
                            <option value="mentor">Mentor</option>
                            <option value="org">Org</option>
                            <option value="admin">Admin</option>
                          </select>

                          {userProfile.account_status === 'active' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => suspendUser(userProfile.id)}
                                disabled={processingId === userProfile.id}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Suspendre
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => banUser(userProfile.id)}
                                disabled={processingId === userProfile.id}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Bannir
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => reactivateUser(userProfile.id)}
                              disabled={processingId === userProfile.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Réactiver
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

