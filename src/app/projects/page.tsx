'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, Github, ExternalLink, Users, Star, GitFork, Calendar, Code, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Types
type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'paused';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  status: ProjectStatus;
  image_url: string;
  members: number;
  stars?: number;
  forks?: number;
  created_at: string;
  category: string;
}

// Mock data - à remplacer par des données Supabase
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AgriPredict Sénégal',
    description: 'Plateforme de prédiction agricole utilisant l\'IA pour optimiser les rendements des cultures au Sénégal. Intègre des données météorologiques, de sol et historiques.',
    tech_stack: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    github_url: 'https://github.com/example/agripredict',
    demo_url: 'https://agripredict-senegal.com',
    status: 'in_progress',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
    members: 4,
    stars: 245,
    forks: 32,
    created_at: '2024-01-15',
    category: 'Agriculture'
  },
  {
    id: '2',
    title: 'SantéIA Diagnostic',
    description: 'Système d\'aide au diagnostic médical par IA pour les centres de santé ruraux. Analyse d\'images médicales et recommandations de traitement.',
    tech_stack: ['PyTorch', 'Vue.js', 'Django', 'PostgreSQL'],
    github_url: 'https://github.com/example/santeia',
    demo_url: undefined,
    status: 'completed',
    image_url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400',
    members: 6,
    stars: 189,
    forks: 24,
    created_at: '2023-11-22',
    category: 'Santé'
  },
  {
    id: '3',
    title: 'WolofNLP Translator',
    description: 'Traducteur automatique français-wolof utilisant des modèles de deep learning. Préservation et promotion de la langue wolof à travers la technologie.',
    tech_stack: ['Transformers', 'Next.js', 'Node.js', 'MongoDB'],
    github_url: 'https://github.com/example/wolofnlp',
    demo_url: 'https://wolof-translator.com',
    status: 'planning',
    image_url: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400',
    members: 3,
    stars: 156,
    forks: 18,
    created_at: '2024-02-10',
    category: 'NLP'
  }
]

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planification',
  in_progress: 'En cours',
  completed: 'Terminé',
  paused: 'En pause'
}

const statusColors: Record<ProjectStatus, string> = {
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  paused: 'bg-gray-100 text-gray-800'
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', 'Agriculture', 'Santé', 'NLP', 'Finance', 'Éducation']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Code className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700 font-medium text-sm">Innovation Collaborative</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Projets Communautaires
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez, contribuez et lancez des projets IA qui transforment l'Afrique.
              Collaborez avec les meilleurs développeurs du continent.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Créer un projet
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                Explorer les catégories
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Lightbulb, number: "50+", label: "Projets actifs" },
                { icon: Users, number: "200+", label: "Contributeurs" },
                { icon: Star, number: "1.2k+", label: "Stars GitHub" }
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
        {/* Categories */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'Tous les projets' : category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un projet par nom, technologie ou description..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProjects.map((project, index) => (
            <Card key={project.id} className="bg-white hover:shadow-lg transition-shadow duration-300 border-gray-200 overflow-hidden">
              {/* Project Image */}
              <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-gray-700 text-xs font-medium">
                    {project.category}
                  </Badge>
                </div>
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={`${statusColors[project.status]} text-xs font-medium`}>
                    {statusLabels[project.status]}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </CardDescription>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tech_stack.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                      +{project.tech_stack.length - 3}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Project Stats */}
                <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{project.members}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="h-4 w-4" />
                      <span>{project.forks}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button size="sm" className="bg-slate-800 hover:bg-slate-700" asChild>
                    <Link href={`/projects/${project.id}`}>
                      Contribuer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-12 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous ne trouvez pas votre projet idéal ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Créez votre propre projet et invitez la communauté à collaborer avec vous pour construire l'avenir de l'IA en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700">
                <Plus className="mr-2 h-5 w-5" />
                Créer un nouveau projet
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Charger plus de projets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}