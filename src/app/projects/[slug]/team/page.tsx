'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, UserPlus, Settings, Crown, Shield, User, 
  Mail, Search, Filter, MoreHorizontal, Trash2, Edit,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface TeamMember {
  id: string
  user_id: string
  name: string
  email: string
  avatar: string
  role: 'owner' | 'admin' | 'member' | 'contributor'
  joined_at: string
  permissions: string[]
  status: 'active' | 'pending' | 'invited'
}

interface ProjectTeam {
  id: string
  name: string
  description: string
  avatar_url: string
  owner_id: string
  created_at: string
  members: TeamMember[]
}

export default function ProjectTeamPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<any>(null)
  const [team, setTeam] = useState<ProjectTeam | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'contributor'>('member')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (slug) {
      fetchProjectAndTeam()
    }
  }, [slug])

  const fetchProjectAndTeam = async () => {
    setLoading(true)
    try {
      // Récupérer le projet
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (projectError) {
        setError('Projet non trouvé')
        return
      }

      setProject(projectData)

      // Récupérer l'équipe si elle existe
      if (projectData.team_id) {
        const { data: teamData, error: teamError } = await supabase
          .from('project_teams')
          .select(`
            *,
            members:project_team_members(
              id, user_id, role, permissions, joined_at,
              user:profiles!user_id(display_name, email, avatar_url)
            )
          `)
          .eq('id', projectData.team_id)
          .single()

        if (!teamError && teamData) {
          const formattedTeam: ProjectTeam = {
            ...teamData,
            members: teamData.members?.map((member: any) => ({
              id: member.id,
              user_id: member.user_id,
              name: member.user?.display_name || 'Anonyme',
              email: member.user?.email || '',
              avatar: member.user?.avatar_url || '',
              role: member.role,
              joined_at: member.joined_at,
              permissions: member.permissions || [],
              status: 'active'
            })) || []
          }
          setTeam(formattedTeam)
          setMembers(formattedTeam.members)
        }
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail || !project) return

    setInviteLoading(true)
    setError('')
    setSuccess('')

    try {
      // Vérifier si l'utilisateur existe
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .eq('email', inviteEmail)
        .single()

      if (userError || !userData) {
        setError('Utilisateur non trouvé. Vérifiez l\'email.')
        return
      }

      // Ajouter comme collaborateur
      const { error: collabError } = await supabase
        .from('project_collaborators')
        .insert([{
          project_id: project.id,
          user_id: userData.id,
          role: inviteRole,
          permissions: ['view', 'comment']
        }])

      if (collabError) {
        setError('Erreur lors de l\'invitation')
        return
      }

      setSuccess('Invitation envoyée avec succès')
      setInviteEmail('')
      setShowInviteModal(false)
      
      // Rafraîchir la liste
      fetchProjectAndTeam()
    } catch (err) {
      setError('Erreur lors de l\'invitation')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre ?')) return

    try {
      const { error } = await supabase
        .from('project_collaborators')
        .delete()
        .eq('id', memberId)

      if (error) {
        setError('Erreur lors de la suppression')
        return
      }

      setSuccess('Membre retiré avec succès')
      fetchProjectAndTeam()
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) {
        setError('Erreur lors de la mise à jour')
        return
      }

      setSuccess('Rôle mis à jour avec succès')
      fetchProjectAndTeam()
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />
      case 'member': return <User className="h-4 w-4 text-green-500" />
      case 'contributor': return <User className="h-4 w-4 text-gray-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'member': return 'bg-green-100 text-green-800'
      case 'contributor': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isOwner = user?.id === project?.author_id
  const canManage = isOwner || members.find(m => m.user_id === user?.id && ['owner', 'admin'].includes(m.role))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h1>
          <p className="text-gray-600">Ce projet n'existe pas ou n'est plus accessible.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Équipe du projet</h1>
              <p className="text-gray-600 mt-1">{project.title}</p>
            </div>
            
            {canManage && (
              <Button onClick={() => setShowInviteModal(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Inviter un membre
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{members.length}</p>
                  <p className="text-sm text-gray-600">Membres</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {members.filter(m => ['owner', 'admin'].includes(m.role)).length}
                  </p>
                  <p className="text-sm text-gray-600">Administrateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {members.filter(m => m.role === 'contributor').length}
                  </p>
                  <p className="text-sm text-gray-600">Contributeurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des membres */}
        <Card>
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
            <CardDescription>
              Gérez les membres et leurs permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucun membre trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">
                          Rejoint le {new Date(member.joined_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={`${getRoleColor(member.role)} border-0`}>
                        {member.role}
                      </Badge>

                      {canManage && member.user_id !== user?.id && (
                        <div className="flex gap-1">
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="contributor">Contributeur</option>
                            <option value="member">Membre</option>
                            {isOwner && <option value="admin">Admin</option>}
                          </select>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal d'invitation */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Inviter un membre</CardTitle>
              <CardDescription>
                Ajoutez un nouveau membre à l'équipe du projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email du membre</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="membre@example.com"
                />
              </div>

              <div>
                <Label htmlFor="role">Rôle</Label>
                <select
                  id="role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="member">Membre</option>
                  <option value="contributor">Contributeur</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleInviteMember}
                  disabled={inviteLoading || !inviteEmail}
                >
                  {inviteLoading ? 'Envoi...' : 'Inviter'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
