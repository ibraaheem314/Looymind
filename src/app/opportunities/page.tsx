import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Building, Users, DollarSign, Clock, ExternalLink, Filter, Search } from 'lucide-react'
import Link from 'next/link'

// Mock data pour les opportunités
const opportunities = [
  {
    id: 1,
    title: "Data Scientist Senior - Orange Sénégal",
    company: "Orange Sénégal",
    location: "Dakar, Sénégal",
    type: "CDI",
    salary: "800,000 - 1,200,000 XOF",
    experience: "3-5 ans",
    postedAt: "2024-01-15",
    deadline: "2024-02-15",
    description: "Nous recherchons un Data Scientist expérimenté pour rejoindre notre équipe IA et contribuer à nos projets d'innovation.",
    requirements: [
      "Master en Data Science ou équivalent",
      "3+ ans d'expérience en Machine Learning",
      "Maîtrise de Python, R, SQL",
      "Expérience avec TensorFlow/PyTorch"
    ],
    benefits: ["Assurance santé", "Formation continue", "Télétravail partiel"],
    category: "Emploi",
    featured: true,
    logo: "/api/placeholder/60/60"
  },
  {
    id: 2,
    title: "Stage Data Analyst - Startup IA",
    company: "TechInnovate",
    location: "Dakar, Sénégal",
    type: "Stage",
    salary: "150,000 XOF",
    experience: "Étudiant",
    postedAt: "2024-01-12",
    deadline: "2024-01-30",
    description: "Stage de 6 mois pour un étudiant en Data Science souhaitant découvrir l'écosystème startup.",
    requirements: [
      "Licence/Master en cours",
      "Bases en Python et SQL",
      "Motivation et curiosité"
    ],
    benefits: ["Mentorat", "Projets concrets", "Possibilité d'embauche"],
    category: "Stage",
    featured: false,
    logo: "/api/placeholder/60/60"
  },
  {
    id: 3,
    title: "Appel à Projets IA - Ministère",
    company: "Ministère de l'Économie Numérique",
    location: "Dakar, Sénégal",
    type: "Appel à projets",
    salary: "Jusqu'à 5,000,000 XOF",
    experience: "Tous niveaux",
    postedAt: "2024-01-10",
    deadline: "2024-03-15",
    description: "Financement de projets IA innovants pour le développement du Sénégal numérique.",
    requirements: [
      "Projet innovant en IA",
      "Impact social ou économique",
      "Équipe sénégalaise"
    ],
    benefits: ["Financement", "Accompagnement", "Visibilité"],
    category: "Financement",
    featured: true,
    logo: "/api/placeholder/60/60"
  },
  {
    id: 4,
    title: "Formation IA - Certification Google",
    company: "Google Africa",
    location: "En ligne",
    type: "Formation",
    salary: "Gratuit",
    experience: "Débutant",
    postedAt: "2024-01-08",
    deadline: "2024-02-01",
    description: "Formation gratuite en Intelligence Artificielle avec certification Google Cloud.",
    requirements: [
      "Niveau bac+2 minimum",
      "Anglais technique",
      "Ordinateur avec connexion"
    ],
    benefits: ["Certification", "Réseau professionnel", "Projets pratiques"],
    category: "Formation",
    featured: false,
    logo: "/api/placeholder/60/60"
  },
  {
    id: 5,
    title: "Mentor IA - Programme Accélération",
    company: "Dakar Innovation Hub",
    location: "Dakar, Sénégal",
    type: "Mentorat",
    salary: "Bénévolat",
    experience: "5+ ans",
    postedAt: "2024-01-05",
    deadline: "2024-01-25",
    description: "Rejoignez notre programme de mentorat pour accompagner les jeunes talents IA.",
    requirements: [
      "Expertise en IA/Data Science",
      "Expérience professionnelle",
      "Disponibilité 2h/semaine"
    ],
    benefits: ["Réseau", "Impact social", "Reconnaissance"],
    category: "Mentorat",
    featured: false,
    logo: "/api/placeholder/60/60"
  },
  {
    id: 6,
    title: "Consultant IA - Projet International",
    company: "UNDP Sénégal",
    location: "Dakar, Sénégal",
    type: "Consultance",
    salary: "2,000,000 - 3,000,000 XOF",
    experience: "5+ ans",
    postedAt: "2024-01-03",
    deadline: "2024-02-10",
    description: "Consultance pour un projet d'IA au service du développement durable.",
    requirements: [
      "Expertise en IA appliquée",
      "Expérience internationale",
      "Français et anglais"
    ],
    benefits: ["Projet impact", "Réseau international", "Rémunération attractive"],
    category: "Consultance",
    featured: false,
    logo: "/api/placeholder/60/60"
  }
]

const categories = [
  { id: 'all', label: 'Toutes', count: opportunities.length },
  { id: 'Emploi', label: 'Emplois', count: opportunities.filter(o => o.category === 'Emploi').length },
  { id: 'Stage', label: 'Stages', count: opportunities.filter(o => o.category === 'Stage').length },
  { id: 'Formation', label: 'Formations', count: opportunities.filter(o => o.category === 'Formation').length },
  { id: 'Financement', label: 'Financements', count: opportunities.filter(o => o.category === 'Financement').length },
  { id: 'Mentorat', label: 'Mentorat', count: opportunities.filter(o => o.category === 'Mentorat').length },
  { id: 'Consultance', label: 'Consultances', count: opportunities.filter(o => o.category === 'Consultance').length }
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getDaysRemaining = (deadline: string) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Opportunités
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les emplois, stages, formations et financements disponibles dans l'écosystème IA sénégalais
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres et recherche */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une opportunité..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category.id === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunités en vedette */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Opportunités en vedette</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.filter(opp => opp.featured).map((opportunity) => (
              <Card key={opportunity.id} className="group hover:shadow-lg transition-shadow border-l-4 border-l-slate-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={opportunity.logo}
                        alt={opportunity.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg group-hover:text-slate-600 transition-colors">
                          {opportunity.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{opportunity.company}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{opportunity.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <CardDescription className="text-base">
                      {opportunity.description}
                    </CardDescription>

                    {/* Informations clés */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>{opportunity.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{opportunity.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{opportunity.type}</span>
                      </div>
                    </div>

                    {/* Requirements (premiers 2) */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Exigences principales</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {opportunity.requirements.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-slate-500">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Clôture : {formatDate(opportunity.deadline)}
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          getDaysRemaining(opportunity.deadline) > 7 
                            ? 'bg-green-100 text-green-800' 
                            : getDaysRemaining(opportunity.deadline) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getDaysRemaining(opportunity.deadline) > 0 
                            ? `${getDaysRemaining(opportunity.deadline)} jours restants`
                            : 'Expiré'
                          }
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="group">
                        Postuler
                        <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Toutes les opportunités */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les opportunités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={opportunity.logo}
                        alt={opportunity.company}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-base group-hover:text-slate-600 transition-colors line-clamp-2">
                          {opportunity.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{opportunity.company}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">{opportunity.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CardDescription className="text-sm line-clamp-2">
                      {opportunity.description}
                    </CardDescription>

                    {/* Informations clés */}
                    <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="truncate">{opportunity.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{opportunity.type}</span>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {formatDate(opportunity.deadline)}
                      </div>
                      <Button variant="outline" size="sm" className="group text-xs">
                        Voir
                        <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Vous avez une opportunité à partager ?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Publiez vos offres d'emploi, stages, formations ou appels à projets 
            et touchez la communauté IA sénégalaise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
              Publier une opportunité
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              Voir les tarifs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
