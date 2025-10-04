'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Github, Linkedin, Mail, Users, Trophy, Target, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Types
type Role = 'talent' | 'mentor' | 'company' | 'admin';

interface Talent {
  id: string;
  full_name: string;
  bio: string;
  skills: string[];
  location: string;
  avatar_url: string;
  github_url: string;
  linkedin_url: string;
  role: Role;
  stats: {
    competitions: number;
    rank: number;
    points: number;
  };
}

// Mock data - à remplacer par des données Supabase
const mockTalents: Talent[] = [
  {
    id: '1',
    full_name: 'Aminata Diallo',
    bio: 'Data Scientist passionnée par l\'application de l\'IA aux défis agricoles. Top 5% sur les compétitions de prédiction.',
    skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL', 'R'],
    location: 'Dakar, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/aminata-diallo',
    linkedin_url: 'https://linkedin.com/in/aminata-diallo',
    role: 'talent',
    stats: {
      competitions: 12,
      rank: 15,
      points: 4250
    }
  },
  {
    id: '2',
    full_name: 'Moussa Ndiaye',
    bio: 'Expert ML avec 5 ans d\'expérience. Mentor actif, spécialiste computer vision et NLP. 15+ compétitions remportées.',
    skills: ['PyTorch', 'OpenCV', 'Docker', 'AWS', 'React'],
    location: 'Thiès, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/moussa-ndiaye',
    linkedin_url: 'https://linkedin.com/in/moussa-ndiaye',
    role: 'mentor',
    stats: {
      competitions: 28,
      rank: 3,
      points: 8900
    }
  },
  {
    id: '3',
    full_name: 'Fatou Sall',
    bio: 'Étudiante Master IA UCAD. Passionnée par l\'éthique de l\'IA. Active sur projets open source et compétitions NLP.',
    skills: ['JavaScript', 'Node.js', 'MongoDB', 'Keras', 'Git'],
    location: 'Dakar, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/fatou-sall',
    linkedin_url: 'https://linkedin.com/in/fatou-sall',
    role: 'talent',
    stats: {
      competitions: 7,
      rank: 42,
      points: 1850
    }
  }
]

const roleLabels: Record<Role, string> = {
  talent: 'Talent',
  mentor: 'Mentor',
  company: 'Entreprise',
  admin: 'Admin'
}

const roleColors: Record<Role, string> = {
  talent: 'bg-blue-100 text-blue-800',
  mentor: 'bg-orange-100 text-orange-800',
  company: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800'
}

export default function TalentsPage() {
  const [selectedRole, setSelectedRole] = useState('all')
  
  const roles = ['all', 'talent', 'mentor']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Design professionnel avec identité ORANGE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/20">
        {/* Decorative elements - subtils en ORANGE */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div>
              <Badge className="bg-orange-100 text-orange-700 border-0 text-sm px-4 py-1.5 mb-4">
                Annuaire des Talents
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                Connectez-vous avec les<br/>
                <span className="text-orange-600">meilleurs talents IA</span>
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Découvrez les meilleurs data scientists du Sénégal, leurs classements et rejoignez-les dans des projets collaboratifs.
              </p>
              
              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-orange-600">500+</strong> membres actifs
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">
                    <strong className="text-orange-600">Classement</strong> en temps réel
                  </span>
                </div>
                <div className="text-sm text-slate-400">•</div>
                <div className="text-sm text-slate-600">
                  Talents vérifiés 🇸🇳
                </div>
              </div>

              <Link href="/auth/register">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30">
                  <Users className="h-5 w-5 mr-2" />
                  Rejoindre la Communauté
                </Button>
              </Link>
            </div>

            {/* Right: Leaderboard preview mockup */}
            <div className="hidden lg:block">
              <Card className="bg-white border-2 border-orange-200 shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-all hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-600" />
                    <h3 className="font-bold text-lg text-slate-900">Top Compétiteurs</h3>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">
                    Cette semaine
                  </Badge>
                </div>
                
                {/* Mini leaderboard */}
                <div className="space-y-3 mb-4">
                  {[
                    { rank: 1, name: 'Moussa N.', points: '8.9K' },
                    { rank: 2, name: 'Aminata D.', points: '7.2K' },
                    { rank: 3, name: 'Ibrahima S.', points: '6.5K' }
                  ].map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-2 rounded-lg ${user.rank === 1 ? 'bg-orange-50' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${user.rank === 1 ? 'text-orange-600' : 'text-slate-600'}`}>#{user.rank}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div>
                          <div className="font-medium text-sm text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.points} pts</div>
                        </div>
                      </div>
                      {user.rank === 1 && (
                        <Award className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                  ))}
                </div>
                
                <Button size="sm" className="w-full bg-orange-600 text-white hover:bg-orange-700">
                  Voir le classement complet →
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-sm text-slate-600">Membres actifs</div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-full mb-3">
                <Trophy className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">150+</div>
              <div className="text-sm text-slate-600">Compétitions terminées</div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">50+</div>
              <div className="text-sm text-slate-600">Mentors experts</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un membre par nom ou compétence..."
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedRole === role
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {role === 'all' ? 'Tous' : roleLabels[role as Role]}
              </button>
            ))}
          </div>
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockTalents.map((talent) => (
            <Card key={talent.id} className="group hover:shadow-md hover:border-orange-200 transition-all border border-slate-200">
              <CardHeader className="pb-3">
                {/* Avatar + Role */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={talent.avatar_url}
                        alt={talent.full_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                      />
                      {talent.stats.rank <= 10 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          {talent.stats.rank}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-orange-600 transition-colors">
                        {talent.full_name}
                      </CardTitle>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3 mr-1" />
                        {talent.location}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${roleColors[talent.role]} border-0 text-xs`}>
                    {roleLabels[talent.role]}
                  </Badge>
                </div>

                <CardDescription className="text-sm line-clamp-2">
                  {talent.bio}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Trophy className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs">{talent.stats.competitions} compét.</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <TrendingUp className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="text-xs">Rang #{talent.stats.rank}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Target className="h-3.5 w-3.5 text-purple-500" />
                    <span className="text-xs font-semibold">{talent.stats.points} pts</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {talent.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-slate-50 border-slate-200">
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                      +{talent.skills.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2">
                  {talent.github_url && (
                    <a 
                      href={talent.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">GitHub</span>
                    </a>
                  )}
                  {talent.linkedin_url && (
                    <a 
                      href={talent.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">LinkedIn</span>
                    </a>
                  )}
                </div>

                <Link href={`/talents/${talent.id}`}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 border-0 text-sm">
                    Voir le profil
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
            <CardContent className="p-12">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Rejoignez la communauté Looymind
                </h3>
                <p className="text-slate-600 mb-8">
                  Participez à des compétitions, collaborez sur des projets IA et montez dans le classement. 
                  Développez vos compétences avec les meilleurs data scientists du Sénégal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 border-0">
                      <Users className="mr-2 h-5 w-5" />
                      S'inscrire gratuitement
                    </Button>
                  </Link>
                  <Link href="/competitions">
                    <Button variant="outline" size="lg" className="border-slate-300">
                      <Trophy className="mr-2 h-5 w-5" />
                      Voir les compétitions
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
