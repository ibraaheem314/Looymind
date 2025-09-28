'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, BookOpen, Code, Download, ExternalLink, Play, FileText, Video, Users, Star, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Types
type ResourceType = 'course' | 'article' | 'tool' | 'dataset' | 'video' | 'book';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  rating: number;
  downloads?: number;
  author: string;
  image_url: string;
  url: string;
  tags: string[];
  created_at: string;
}

// Mock data - à remplacer par des données Supabase
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Introduction au Machine Learning avec Python',
    description: 'Cours complet pour débuter en machine learning avec des exemples pratiques en Python. Couvre les algorithmes de base et leur implémentation.',
    type: 'course',
    category: 'Machine Learning',
    difficulty: 'beginner',
    duration: '8h',
    rating: 4.8,
    downloads: 1250,
    author: 'Dr. Aminata Diallo',
    image_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/course-1',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Deep Learning pour la Vision par Ordinateur',
    description: 'Guide avancé sur les réseaux de neurones convolutifs (CNN) et leur application dans la reconnaissance d\'images.',
    type: 'article',
    category: 'Deep Learning',
    difficulty: 'advanced',
    duration: '15min',
    rating: 4.9,
    author: 'Prof. Moussa Ndiaye',
    image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/article-2',
    tags: ['CNN', 'TensorFlow', 'Computer Vision', 'PyTorch'],
    created_at: '2024-02-10'
  },
  {
    id: '3',
    title: 'Dataset: Prix des Produits Agricoles au Sénégal',
    description: 'Dataset complet des prix historiques des produits agricoles sénégalais avec données météorologiques et économiques.',
    type: 'dataset',
    category: 'Agriculture',
    difficulty: 'intermediate',
    rating: 4.7,
    downloads: 890,
    author: 'Ministère de l\'Agriculture',
    image_url: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/dataset-3',
    tags: ['Agriculture', 'Time Series', 'CSV', 'Prix'],
    created_at: '2024-01-20'
  },
  {
    id: '4',
    title: 'Tutoriel: Créer une API REST avec FastAPI',
    description: 'Vidéo tutoriel étape par étape pour créer une API REST robuste avec FastAPI et déployer sur le cloud.',
    type: 'video',
    category: 'Développement',
    difficulty: 'intermediate',
    duration: '2h30',
    rating: 4.6,
    author: 'Fatou Sall',
    image_url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/video-4',
    tags: ['FastAPI', 'Python', 'API', 'Déploiement'],
    created_at: '2024-02-05'
  },
  {
    id: '5',
    title: 'Jupyter Notebook: Analyse de Sentiment en Wolof',
    description: 'Notebook interactif pour analyser les sentiments dans des textes en wolof en utilisant des modèles de NLP.',
    type: 'tool',
    category: 'NLP',
    difficulty: 'advanced',
    rating: 4.9,
    downloads: 650,
    author: 'Dr. Khadija Ba',
    image_url: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/tool-5',
    tags: ['NLP', 'Wolof', 'Jupyter', 'Sentiment Analysis'],
    created_at: '2024-01-30'
  },
  {
    id: '6',
    title: 'L\'Intelligence Artificielle en Afrique: Défis et Opportunités',
    description: 'Livre complet sur l\'état de l\'IA en Afrique, les défis spécifiques et les opportunités de développement.',
    type: 'book',
    category: 'Éducation',
    difficulty: 'intermediate',
    duration: '6h',
    rating: 4.8,
    author: 'Dr. Cheikh Anta Diop',
    image_url: 'https://images.pexels.com/photos/159832/book-reading-glasses-education-159832.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: '/resources/book-6',
    tags: ['Afrique', 'IA', 'Développement', 'Économie'],
    created_at: '2024-01-10'
  }
]

const typeLabels: Record<ResourceType, string> = {
  course: 'Cours',
  article: 'Article',
  tool: 'Outil',
  dataset: 'Dataset',
  video: 'Vidéo',
  book: 'Livre'
}

const typeIcons: Record<ResourceType, any> = {
  course: BookOpen,
  article: FileText,
  tool: Code,
  dataset: Download,
  video: Play,
  book: BookOpen
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}

export default function ResourcesPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const types = ['all', 'course', 'article', 'tool', 'dataset', 'video', 'book']
  const categories = ['all', 'Machine Learning', 'Deep Learning', 'Agriculture', 'Développement', 'NLP', 'Éducation']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <BookOpen className="h-4 w-4 text-gray-700" />
              <span className="text-gray-700 font-medium text-sm">Centre de Connaissances</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Ressources
              <span className="block text-gray-700">IA & Tech</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Apprenez, explorez et maîtrisez l'Intelligence Artificielle avec nos ressources gratuites.
              <br className="hidden md:block" />
              <span className="font-semibold text-gray-700">Cours</span>,
              <span className="font-semibold text-gray-700"> articles</span>,
              <span className="font-semibold text-gray-700"> outils</span> et
              <span className="font-semibold text-gray-700"> datasets</span> pour tous les niveaux.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-lg px-8 py-3 bg-slate-800 text-white hover:bg-slate-700 shadow-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Commencer à apprendre
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-lg">
                Contribuer une ressource
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: BookOpen, number: "150+", label: "Ressources disponibles" },
                { icon: Users, number: "2.5k+", label: "Apprenants actifs" },
                { icon: Star, number: "4.8/5", label: "Note moyenne" }
              ].map((stat, index) => (
                <div key={index} className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-lg mb-3">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedType === type
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {type === 'all' ? 'Tous les types' : typeLabels[type as ResourceType]}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {category === 'all' ? 'Toutes les catégories' : category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une ressource par nom, auteur ou tags..."
              className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-300 text-base text-gray-800"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-700">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockResources.map((resource, index) => {
            const TypeIcon = typeIcons[resource.type]
            return (
              <Card key={resource.id} className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
                {/* Resource Image */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={resource.image_url}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-700 text-xs font-medium">
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeLabels[resource.type]}
                    </Badge>
                  </div>
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${difficultyColors[resource.difficulty]} text-xs font-medium`}>
                      {difficultyLabels[resource.difficulty]}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {resource.description}
                  </CardDescription>
                  
                  {/* Author & Rating */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Par {resource.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  {/* Resource Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {resource.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                      {resource.downloads && (
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.downloads}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(resource.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="hover:bg-gray-100">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Link href={resource.url}>
                        Accéder
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Proposez une nouvelle ressource ou demandez à la communauté de créer ce dont vous avez besoin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-slate-800 text-white hover:bg-slate-700 shadow-md">
                <BookOpen className="mr-2 h-5 w-5" />
                Proposer une ressource
              </Button>
              <Button variant="outline" size="lg" className="hover:bg-gray-100 hover:border-gray-300 shadow-md">
                Charger plus de ressources
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
