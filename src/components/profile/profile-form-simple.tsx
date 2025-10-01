'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, User, Save, X, Camera } from 'lucide-react'
// useProfile is now part of useAuth
import { useAuth } from '@/hooks/useAuth'
import type { Profile } from '@/lib/supabase'

interface ProfileFormProps {
  profile: Profile
  onUpdate?: (updatedProfile: Profile) => void
}

export default function ProfileFormSimple({ profile, onUpdate }: ProfileFormProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    first_name: (profile as any).first_name || '',
    last_name: (profile as any).last_name || '',
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    phone: (profile as any).phone || '',
    current_position: (profile as any).current_position || '',
    company: (profile as any).company || '',
    website_url: profile.website_url || '',
    github_url: profile.github_url || '',
    linkedin_url: profile.linkedin_url || '',
    role: profile.role || 'member',
    skills: profile.skills || [],
    interests: (profile as any).interests || [],
    experience_level: (profile as any).experience_level || 'debutant'
  })

  const [newSkill, setNewSkill] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const updatedProfile = await updateProfile(formData)
      
      if (updatedProfile) {
        setSuccess('Profil mis à jour avec succès')
        setIsEditing(false)
        onUpdate?.(updatedProfile)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: (profile as any).first_name || '',
      last_name: (profile as any).last_name || '',
      display_name: profile.display_name || '',
      bio: profile.bio || '',
      location: profile.location || '',
      phone: (profile as any).phone || '',
      current_position: (profile as any).current_position || '',
      company: (profile as any).company || '',
      website_url: profile.website_url || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      role: profile.role || 'member',
      skills: profile.skills || [],
      interests: (profile as any).interests || [],
      experience_level: (profile as any).experience_level || 'debutant'
    })
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)
      
      const avatarUrl = await uploadAvatar(file)
      
      if (avatarUrl) {
        setSuccess('Avatar mis à jour avec succès')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload de l\'avatar')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const [newInterest, setNewInterest] = useState('')

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  const roleLabels = {
    member: 'Membre',
    mentor: 'Mentor',
    org: 'Organisation',
    admin: 'Administrateur'
  }

  const experienceLabels = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
    expert: 'Expert'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Utilisateur
            </CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et votre présence sur la plateforme
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Messages d'erreur/succès */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Avatar et informations de base */}
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'affichage *
                </label>
                {isEditing ? (
                  <input
                    id="display_name"
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="Votre nom d'affichage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{profile.display_name || 'Non renseigné'}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-sm text-gray-600 py-2">{user?.email}</p>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Biographie
              </label>
              {isEditing ? (
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Parlez-nous de vous, vos intérêts, votre parcours..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-sm text-gray-700 py-2 whitespace-pre-line">
                  {profile.bio || 'Aucune biographie renseignée'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informations personnelles complètes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            {isEditing ? (
              <input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Votre prénom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {(profile as any).first_name || 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            {isEditing ? (
              <input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Votre nom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {(profile as any).last_name || 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            {isEditing ? (
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 XX XXX XX XX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {(profile as any).phone || 'Non renseigné'}
              </p>
            )}
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            {isEditing ? (
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="member">Membre</option>
                <option value="mentor">Mentor</option>
                <option value="org">Organisation</option>
              </select>
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Badge variant="secondary">
                  {roleLabels[profile.role as keyof typeof roleLabels]}
                </Badge>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'expérience
            </label>
            {isEditing ? (
              <select
                id="experience_level"
                value={formData.experience_level}
                onChange={(e) => handleInputChange('experience_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="expert">Expert</option>
              </select>
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {experienceLabels[(profile as any).experience_level as keyof typeof experienceLabels] || 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="current_position" className="block text-sm font-medium text-gray-700 mb-2">
              Poste actuel
            </label>
            {isEditing ? (
              <input
                id="current_position"
                type="text"
                value={formData.current_position}
                onChange={(e) => handleInputChange('current_position', e.target.value)}
                placeholder="Data Scientist, Développeur..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {(profile as any).current_position || 'Non renseigné'}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Entreprise/Institution
            </label>
            {isEditing ? (
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Orange, UCAD, Startup..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {(profile as any).company || 'Non renseigné'}
              </p>
            )}
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          {isEditing ? (
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ville, Pays"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-sm text-gray-700 py-2">
              {profile.location || 'Non renseigné'}
            </p>
          )}
        </div>

        {/* Compétences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ajouter une compétence"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addSkill} size="sm">
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 py-2">
              {profile.skills?.length ? (
                profile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucune compétence renseignée</p>
              )}
            </div>
          )}
        </div>

        {/* Centres d'intérêt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centres d'intérêt
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Ajouter un centre d'intérêt"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addInterest} size="sm">
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 py-2">
              {(profile as any).interests?.length ? (
                (profile as any).interests.map((interest: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun centre d'intérêt renseigné</p>
              )}
            </div>
          )}
        </div>

        {/* Liens sociaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            {isEditing ? (
              <input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="https://votre-site.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {profile.website_url ? (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.website_url}
                  </a>
                ) : (
                  'Non renseigné'
                )}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            {isEditing ? (
              <input
                id="github_url"
                type="text"
                value={formData.github_url}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {profile.github_url ? (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.github_url}
                  </a>
                ) : (
                  'Non renseigné'
                )}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            {isEditing ? (
              <input
                id="linkedin_url"
                type="text"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm text-gray-700 py-2">
                {profile.linkedin_url ? (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.linkedin_url}
                  </a>
                ) : (
                  'Non renseigné'
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
