'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Lock, User, MapPin, Eye, EyeOff, AlertCircle, CheckCircle, Briefcase, GraduationCap, Building, Code } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    display_name: '', first_name: '', last_name: '',
    role: 'member' as 'member' | 'mentor' | 'org' | 'admin',
    experience_level: 'debutant' as 'debutant' | 'intermediaire' | 'avance' | 'expert',
    current_position: '', company: '', location: '', bio: '',
    skills: [] as string[], interests: [] as string[],
    github_url: '', linkedin_url: '', website_url: '', phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailTimeout, setEmailTimeout] = useState<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated && !authLoading) router.push('/dashboard')
  }, [isAuthenticated, authLoading, router])

  // Nettoyage du timeout
  useEffect(() => {
    return () => {
      if (emailTimeout) {
        clearTimeout(emailTimeout)
      }
    }
  }, [emailTimeout])

  const skillsOptions = ['Python','JavaScript','R','SQL','Machine Learning','Deep Learning','Data Analysis','Data Visualization','Statistics','Big Data','Cloud Computing','DevOps','Web Development','Mobile Development','UI/UX Design','Product Management','Business Intelligence','NLP','Computer Vision','Time Series','Reinforcement Learning','MLOps']
  const interestsOptions = ['Intelligence Artificielle','Data Science','Machine Learning','Deep Learning','Big Data','Analytics','Business Intelligence','Computer Vision','NLP','Robotics','IoT','Blockchain','Cybersecurity','Cloud Computing','DevOps','Web Development','Mobile Development','UI/UX','Product Management','Startup','Recherche','Académique','Industrie','Finance','Santé','Agriculture','Éducation','Environnement']

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // TEMPORAIRE : Désactiver la vérification en temps réel pour éviter les boucles
    // La vérification sera faite lors de la soumission
  }

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailError('')
      return
    }

    setCheckingEmail(true)
    setEmailError('')

    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        // Si l'API ne fonctionne pas, on ignore la vérification en temps réel
        setEmailError('')
        return
      }

      const data = await response.json()
      
      if (!data.available) {
        setEmailError(data.error || 'Cet email est déjà utilisé')
      } else {
        setEmailError('')
      }
    } catch (err) {
      // Ignorer les erreurs de vérification en temps réel
      setEmailError('')
    } finally {
      setCheckingEmail(false)
    }
  }

  const addSkill = (skill: string) =>
    !formData.skills.includes(skill) && setFormData(p => ({ ...p, skills: [...p.skills, skill] }))

  const removeSkill = (skill: string) =>
    setFormData(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))

  const addInterest = (interest: string) =>
    !formData.interests.includes(interest) && setFormData(p => ({ ...p, interests: [...p.interests, interest] }))

  const removeInterest = (interest: string) =>
    setFormData(p => ({ ...p, interests: p.interests.filter(i => i !== interest) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Étapes 1 → 2 → 3
    if (currentStep !== 3) {
      nextStep()
      return
    }

    setLoading(true); setError(''); setSuccess(false)

    // 🔒 VÉRIFICATION FINALE : Email déjà utilisé
    if (emailError) {
      setError('Veuillez corriger l\'erreur d\'email avant de continuer')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas'); setLoading(false); return
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères'); setLoading(false); return
    }

    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // TEMPORAIRE : Désactiver la vérification préalable pour éviter les boucles
      // La vérification sera faite par Supabase Auth directement

      const emailRedirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo,
          data: {
            full_name: `${formData.first_name} ${formData.last_name}`.trim(),
            first_name: formData.first_name,
            last_name: formData.last_name,
            display_name: formData.display_name || `${formData.first_name} ${formData.last_name}`.trim(),
            role: formData.role,
            experience_level: formData.experience_level,
            location: formData.location,
            current_position: formData.current_position,
            company: formData.company,
            github_url: formData.github_url,
            linkedin_url: formData.linkedin_url,
            website_url: formData.website_url,
            phone: formData.phone,
            interests: formData.interests,
            skills: formData.skills,
            bio: formData.bio,
          }
        }
      })

      if (authError) {
        // 🔒 GESTION SPÉCIFIQUE DES ERREURS D'EMAIL DUPLIQUÉ
        const errorMessage = authError.message.toLowerCase()
        
        if (errorMessage.includes('already registered') || 
            errorMessage.includes('user already registered') ||
            errorMessage.includes('email already in use') ||
            errorMessage.includes('duplicate')) {
          setError('Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.')
        } else if (errorMessage.includes('invalid email')) {
          setError('Adresse email invalide. Veuillez vérifier votre saisie.')
        } else if (errorMessage.includes('password')) {
          setError('Le mot de passe ne respecte pas les critères requis.')
        } else {
          setError(`Erreur lors de l'inscription : ${authError.message}`)
        }
        setLoading(false)
        return
      }

      // ✅ NE PAS considérer "user === null" comme une erreur si confirm email est ON
      // if (!authData.user) { setError('Erreur lors de la création du compte'); return }

        // ✅ Chemin 1 : confirmation email activée → pas de session ⇒ on affiche succès + redir /check-email
        if (!authData.session) {
          setSuccess(true)                // ✅ montre le bandeau de succès
          router.push(`/check-email?email=${encodeURIComponent(formData.email)}`)     // ✅ page claire "Vérifie ta boîte mail" avec email
          return
        }

      // Chemin 2 : pas de confirmation (session directe) → maj profil puis dashboard
      const userId = authData.user!.id
      await supabase.from('profiles').update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name || `${formData.first_name} ${formData.last_name}`.trim(),
        bio: formData.bio,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        website_url: formData.website_url,
        phone: formData.phone,
        current_position: formData.current_position,
        company: formData.company,
        experience_level: formData.experience_level,
        skills: formData.skills,
        interests: formData.interests,
        role: formData.role,
        location: formData.location,
      }).eq('id', userId)

      setSuccess(true)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep >= 3) return
    if (currentStep === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Veuillez remplir tous les champs obligatoires'); return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas'); return
      }
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères'); return
      }
    }
    if (currentStep === 2) {
      if (!formData.role) { setError('Veuillez sélectionner un type de compte'); return }
    }
    setError('')
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)
  const getStepIcon = (n: number) => (n === 1 ? <User className="h-5 w-5" /> : n === 2 ? <Briefcase className="h-5 w-5" /> : <Code className="h-5 w-5" />)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rejoignez Looymind</h1>
          <p className="text-gray-600">Créez votre compte et rejoignez la communauté IA du Sénégal</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1,2,3].map(step => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step ? 'bg-slate-800 border-slate-800 text-white' : 'border-gray-300 text-gray-400'}`}>
                {getStepIcon(step)}
              </div>
              {step < 3 && <div className={`w-16 h-0.5 mx-2 ${currentStep > step ? 'bg-slate-800' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentStep === 1 ? 'Informations personnelles' : currentStep === 2 ? 'Profil professionnel' : 'Compétences et intérêts'}</CardTitle>
            <CardDescription>
              {currentStep === 1 ? 'Commencez par vos informations de base'
               : currentStep === 2 ? 'Parlez-nous de votre parcours professionnel'
               : 'Définissez vos compétences et centres d’intérêt'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input id="first_name" value={formData.first_name} onChange={e => handleInputChange('first_name', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input id="last_name" value={formData.last_name} onChange={e => handleInputChange('last_name', e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_name">Nom d’affichage</Label>
                    <Input id="display_name" value={formData.display_name} onChange={e => handleInputChange('display_name', e.target.value)} />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={e => handleInputChange('email', e.target.value)} 
                        className={`pl-10 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`} 
                        required 
                      />
                      {checkingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800" />
                        </div>
                      )}
                    </div>
                    {emailError && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="Minimum 8 caractères" className="pl-10 pr-10" required />
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                      <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="location" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="pl-10" placeholder="Dakar, Sénégal" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Type de compte *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {[
                        { value: 'member', label: 'Membre', icon: User, desc: 'Talent ou étudiant' },
                        { value: 'mentor', label: 'Mentor', icon: GraduationCap, desc: 'Expert qui guide' },
                        { value: 'org', label: 'Organisation', icon: Building, desc: 'Entreprise ou institution' },
                        { value: 'admin', label: 'Administrateur', icon: Briefcase, desc: 'Gestion de la plateforme' }
                      ].map(r => (
                        <label key={r.value} className="relative">
                          <input type="radio" name="role" value={r.value} checked={formData.role === r.value} onChange={e => handleInputChange('role', e.target.value)} className="sr-only" />
                          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.role === r.value ? 'border-slate-800 bg-slate-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-center space-x-3">
                              <r.icon className="h-5 w-5 text-gray-600" />
                              <div>
                                <div className="font-medium">{r.label}</div>
                                <div className="text-sm text-gray-500">{r.desc}</div>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience_level">Niveau d’expérience *</Label>
                    <select id="experience_level" value={formData.experience_level} onChange={e => handleInputChange('experience_level', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                      <option value="debutant">Débutant (0–1 an)</option>
                      <option value="intermediaire">Intermédiaire (1–3 ans)</option>
                      <option value="avance">Avancé (3–5 ans)</option>
                      <option value="expert">Expert (5+ ans)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="current_position">Poste actuel</Label>
                    <Input id="current_position" value={formData.current_position} onChange={e => handleInputChange('current_position', e.target.value)} placeholder="Data Scientist, Développeur, Étudiant..." />
                  </div>

                  <div>
                    <Label htmlFor="company">Entreprise/Institution</Label>
                    <Input id="company" value={formData.company} onChange={e => handleInputChange('company', e.target.value)} placeholder="Orange Sénégal, UCAD, Startup..." />
                  </div>

                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea id="bio" value={formData.bio} onChange={e => handleInputChange('bio', e.target.value)} placeholder="Parlez-nous de vous, votre parcours, vos passions..." rows={3} />
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Compétences techniques</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="flex items-center gap-1">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">×</button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skillsOptions.map(skill => (
                        <button key={skill} type="button" onClick={() => addSkill(skill)}
                          disabled={formData.skills.includes(skill)}
                          className={`p-2 text-sm rounded border transition-colors ${formData.skills.includes(skill) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:border-slate-800 hover:bg-slate-50'}`}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Centres d’intérêt</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {formData.interests.map(interest => (
                        <Badge key={interest} variant="outline" className="flex items-center gap-1">
                          {interest}
                          <button type="button" onClick={() => removeInterest(interest)} className="ml-1 hover:text-red-500">×</button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {interestsOptions.map(interest => (
                        <button key={interest} type="button" onClick={() => addInterest(interest)}
                          disabled={formData.interests.includes(interest)}
                          className={`p-2 text-sm rounded border transition-colors ${formData.interests.includes(interest) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 hover:border-slate-800 hover:bg-slate-50'}`}>
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github_url">GitHub</Label>
                      <Input id="github_url" value={formData.github_url} onChange={e => handleInputChange('github_url', e.target.value)} placeholder="https://github.com/username" />
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <Input id="linkedin_url" value={formData.linkedin_url} onChange={e => handleInputChange('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* ✅ ne plus dépendre de !authLoading pour afficher le succès */}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Compte créé ! Vérifie ton email pour confirmer et te connecter.</span>
                </div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>Précédent</Button>
                ) : <div />}
                <Button type="submit" disabled={loading}>
                  {currentStep < 3 ? 'Suivant' : (loading ? 'Création du compte...' : 'Créer mon compte')}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-slate-800 hover:text-slate-600 font-medium">Se connecter</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
