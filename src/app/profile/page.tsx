'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Edit, 
  Save,
  Plus,
  X
} from 'lucide-react'

// Mock data pour le profil utilisateur
const mockProfile = {
  id: '1',
  email: 'aminata.diallo@email.com',
  full_name: 'Aminata Diallo',
  bio: 'Data Scientist passionnée par l\'application de l\'IA aux défis agricoles africains. Spécialisée en machine learning et analyse prédictive avec 3 ans d\'expérience.',
  skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL', 'R', 'Pandas', 'NumPy'],
  location: 'Dakar, Sénégal',
  avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
  github_url: 'https://github.com/aminata-diallo',
  linkedin_url: 'https://linkedin.com/in/aminata-diallo',
  role: 'talent' as const,
  created_at: '2024-01-01',
  updated_at: '2024-01-15'
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [newSkill, setNewSkill] = useState('')

  const handleSave = () => {
    // TODO: Sauvegarder le profil via Supabase
    console.log('Saving profile:', profile)
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const roleLabels = {
    talent: 'Talent',
    mentor: 'Mentor',
    company: 'Entreprise',
    admin: 'Admin'
  }

  const roleColors = {
    talent: 'bg-blue-100 text-blue-800',
    mentor: 'bg-green-100 text-green-800',
    company: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={roleColors[profile.role]}>
                        {roleLabels[profile.role]}
                      </Badge>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            className="text-sm bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm">{profile.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de moi</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Parlez-nous de vous, vos expériences, vos passions..."
                  />
                ) : (
                  <p className="text-gray-700">{profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Compétences */}
            <Card>
              <CardHeader>
                <CardTitle>Compétences techniques</CardTitle>
                <CardDescription>
                  Ajoutez vos compétences pour être trouvé plus facilement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="relative group">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ajouter une compétence..."
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liens sociaux */}
            <Card>
              <CardHeader>
                <CardTitle>Liens professionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Github className="h-5 w-5 text-gray-600" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.github_url || ''}
                      onChange={(e) => setProfile({...profile, github_url: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {profile.github_url}
                    </a>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-gray-600" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={profile.linkedin_url || ''}
                      onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {profile.linkedin_url}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Défis participés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Défis complétés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">#15</div>
                  <div className="text-sm text-gray-600">Classement global</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">2,450</div>
                  <div className="text-sm text-gray-600">Points totaux</div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Récompenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-medium">Top 3</div>
                    <div className="text-xs text-gray-500">2 fois</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-medium">Précision</div>
                    <div className="text-xs text-gray-500">95%+</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-xs font-medium">Série</div>
                    <div className="text-xs text-gray-500">5 défis</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-medium">Rapidité</div>
                    <div className="text-xs text-gray-500">Expert</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Voir mes soumissions
                </Button>
                <Button className="w-full" variant="outline">
                  Mes projets
                </Button>
                <Button className="w-full" variant="outline">
                  Paramètres du compte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
