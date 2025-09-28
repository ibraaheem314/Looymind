'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MapPin, Github, Linkedin, Mail, Users, Brain, Code, Network } from 'lucide-react'
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
}

// Mock data - à remplacer par des données Supabase
const mockTalents: Talent[] = [
  {
    id: '1',
    full_name: 'Aminata Diallo',
    bio: 'Data Scientist passionnée par l\'application de l\'IA aux défis agricoles africains. Spécialisée en machine learning et analyse prédictive.',
    skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL', 'R'],
    location: 'Dakar, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/aminata-diallo',
    linkedin_url: 'https://linkedin.com/in/aminata-diallo',
    role: 'talent'
  },
  {
    id: '2',
    full_name: 'Moussa Ndiaye',
    bio: 'Ingénieur ML avec 5 ans d\'expérience. Mentor actif dans la communauté tech sénégalaise. Expert en computer vision et NLP.',
    skills: ['PyTorch', 'OpenCV', 'Docker', 'AWS', 'React'],
    location: 'Thiès, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/moussa-ndiaye',
    linkedin_url: 'https://linkedin.com/in/moussa-ndiaye',
    role: 'mentor'
  },
  {
    id: '3',
    full_name: 'Fatou Sall',
    bio: 'Étudiante en Master IA à l\'UCAD. Passionnée par l\'éthique de l\'IA et son impact social. Contribue à plusieurs projets open source.',
    skills: ['JavaScript', 'Node.js', 'MongoDB', 'Keras', 'Git'],
    location: 'Dakar, Sénégal',
    avatar_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=150',
    github_url: 'https://github.com/fatou-sall',
    linkedin_url: 'https://linkedin.com/in/fatou-sall',
    role: 'talent'
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
  mentor: 'bg-green-100 text-green-800',
  company: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800'
}

export default function TalentsPage() {
  const [selectedRole, setSelectedRole] = useState('all')
  
  const roles = ['all', 'talent', 'mentor', 'company', 'admin']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Network className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">Communauté Talents</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Talents IA Sénégal
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez les experts et passionnés d'IA du Sénégal et d'Afrique.
              Connectez-vous avec des mentors et collaborateurs.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700">
                <Users className="mr-2 h-5 w-5" />
                Rejoindre la communauté
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                Devenir mentor
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Users, number: "500+", label: "Talents connectés" },
                { icon: Brain, number: "50+", label: "Mentors experts" },
                { icon: Code, number: "25+", label: "Entreprises partenaires" }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Role Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedRole === role
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {role === 'all' ? 'Tous les profils' : roleLabels[role as Role]}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un talent par nom, compétence ou localisation..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTalents.map((talent, index) => (
            <Card key={talent.id} className="bg-white hover:shadow-lg transition-shadow duration-300 border-gray-200 overflow-hidden">
              <CardHeader className="text-center pb-4">
                {/* Avatar */}
                <div className="relative mx-auto mb-4">
                  <div className="bg-slate-800 p-1 rounded-full">
                    <img
                      src={talent.avatar_url}
                      alt={talent.full_name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Role Badge */}
                <div className="flex justify-center mb-3">
                  <Badge className={roleColors[talent.role]}>
                    {roleLabels[talent.role]}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                  {talent.full_name}
                </CardTitle>
                
                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{talent.location}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                <CardDescription className="text-center line-clamp-3 text-gray-600 leading-relaxed">
                  {talent.bio}
                </CardDescription>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {talent.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                      +{talent.skills.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center space-x-2">
                  {talent.github_url && (
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50" asChild>
                      <a href={talent.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {talent.linkedin_url && (
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50" asChild>
                      <a href={talent.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="w-full bg-slate-800 hover:bg-slate-700" asChild>
                  <Link href={`/talents/${talent.id}`}>
                    Voir le profil complet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous cherchez des collaborateurs ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté de talents IA et connectez-vous avec des experts, mentors et entreprises innovantes au Sénégal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
                <Users className="mr-2 h-5 w-5" />
                Rejoindre la communauté
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Devenir mentor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}