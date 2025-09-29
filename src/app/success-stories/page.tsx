import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Users, Calendar, ExternalLink, Github, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

// Mock data pour les success stories
const successStories = [
  {
    id: 1,
    title: "AgriPredict : IA pour l'agriculture sénégalaise",
    description: "Une startup sénégalaise qui utilise l'IA pour prédire les rendements agricoles et optimiser l'irrigation.",
    founder: "Fatou Sarr",
    founderRole: "Fondatrice & CEO",
    company: "AgriPredict",
    location: "Dakar, Sénégal",
    founded: "2023",
    team: 8,
    funding: "500,000 USD",
    impact: "500+ agriculteurs",
    technologies: ["Python", "TensorFlow", "Computer Vision"],
    achievements: [
      "Prix Innovation Agricole 2023",
      "Accélération Orange Fab",
      "500+ agriculteurs impactés"
    ],
    image: "/api/placeholder/400/300",
    featured: true,
    category: "Startup"
  },
  {
    id: 2,
    title: "MedAI Sénégal : Diagnostic médical par IA",
    description: "Projet de recherche développé à l'UCAD pour le diagnostic précoce de maladies tropicales.",
    founder: "Dr. Moussa Diop",
    founderRole: "Chercheur Principal",
    company: "UCAD - Laboratoire IA",
    location: "Dakar, Sénégal",
    founded: "2022",
    team: 12,
    funding: "Recherche académique",
    impact: "10,000+ patients",
    technologies: ["Deep Learning", "Medical Imaging", "Python"],
    achievements: [
      "Publication Nature Medicine",
      "Prix Excellence Recherche UCAD",
      "10,000+ diagnostics assistés"
    ],
    image: "/api/placeholder/400/300",
    featured: true,
    category: "Recherche"
  },
  {
    id: 3,
    title: "EduTech AI : Plateforme d'apprentissage adaptatif",
    description: "Plateforme éducative utilisant l'IA pour personnaliser l'apprentissage des élèves sénégalais.",
    founder: "Khadija Ndiaye",
    founderRole: "Fondatrice",
    company: "EduTech AI",
    location: "Thiès, Sénégal",
    founded: "2023",
    team: 15,
    funding: "300,000 USD",
    impact: "2,000+ élèves",
    technologies: ["Machine Learning", "React", "Node.js"],
    achievements: [
      "Partenariat Ministère Éducation",
      "2,000+ élèves actifs",
      "Amélioration 40% des résultats"
    ],
    image: "/api/placeholder/400/300",
    featured: false,
    category: "EdTech"
  },
  {
    id: 4,
    title: "FinTech AI : Détection de fraude bancaire",
    description: "Solution d'IA développée par des ingénieurs sénégalais pour la détection de fraude en temps réel.",
    founder: "Ibrahima Fall",
    founderRole: "Lead Data Scientist",
    company: "BankTech Solutions",
    location: "Dakar, Sénégal",
    founded: "2022",
    team: 6,
    funding: "200,000 USD",
    impact: "100,000+ transactions",
    technologies: ["Anomaly Detection", "Real-time ML", "Python"],
    achievements: [
      "Réduction 95% des fraudes",
      "Déploiement 3 banques",
      "100,000+ transactions sécurisées"
    ],
    image: "/api/placeholder/400/300",
    featured: false,
    category: "FinTech"
  },
  {
    id: 5,
    title: "ClimateAI : Prédiction météorologique pour l'Afrique",
    description: "Modèle d'IA pour la prédiction météorologique spécifique aux conditions climatiques africaines.",
    founder: "Mariama Ba",
    founderRole: "Climate Data Scientist",
    company: "African Climate Lab",
    location: "Dakar, Sénégal",
    founded: "2023",
    team: 10,
    funding: "Recherche internationale",
    impact: "5 pays africains",
    technologies: ["Time Series", "Weather Data", "Python"],
    achievements: [
      "Précision 90% vs 70% traditionnel",
      "Déploiement 5 pays",
      "Prix Innovation Climatique"
    ],
    image: "/api/placeholder/400/300",
    featured: false,
    category: "Climate"
  },
  {
    id: 6,
    title: "HealthAI : Télémédecine intelligente",
    description: "Plateforme de télémédecine utilisant l'IA pour le diagnostic à distance dans les zones rurales.",
    founder: "Dr. Cheikh Ndiaye",
    founderRole: "Médecin & Fondateur",
    company: "Rural Health AI",
    location: "Kaolack, Sénégal",
    founded: "2023",
    team: 8,
    funding: "150,000 USD",
    impact: "50+ villages",
    technologies: ["Computer Vision", "Telemedicine", "Mobile App"],
    achievements: [
      "50+ villages connectés",
      "1,000+ consultations",
      "Prix Santé Digitale"
    ],
    image: "/api/placeholder/400/300",
    featured: false,
    category: "HealthTech"
  }
]

const categories = [
  { id: 'all', label: 'Tous', count: successStories.length },
  { id: 'Startup', label: 'Startup', count: successStories.filter(s => s.category === 'Startup').length },
  { id: 'Recherche', label: 'Recherche', count: successStories.filter(s => s.category === 'Recherche').length },
  { id: 'EdTech', label: 'EdTech', count: successStories.filter(s => s.category === 'EdTech').length },
  { id: 'FinTech', label: 'FinTech', count: successStories.filter(s => s.category === 'FinTech').length },
  { id: 'Climate', label: 'Climate', count: successStories.filter(s => s.category === 'Climate').length },
  { id: 'HealthTech', label: 'HealthTech', count: successStories.filter(s => s.category === 'HealthTech').length }
]

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les projets IA qui transforment le Sénégal et inspirent la prochaine génération d'innovateurs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
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

        {/* Stories en vedette */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Projets phares
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successStories.filter(story => story.featured).map((story) => (
              <Card key={story.id} className="group hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{story.category}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">⭐ Projet phare</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-slate-600 transition-colors">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations clés */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{story.team} membres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span>{story.impact}</span>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-1">
                        {story.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Réalisations */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Réalisations</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {story.achievements.slice(0, 2).map((achievement, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Par {story.founder} • {story.company}
                      </div>
                      <Button variant="outline" size="sm" className="group">
                        Voir le projet
                        <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Toutes les success stories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les success stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <Card key={story.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{story.category}</Badge>
                    {story.featured && <Badge className="bg-yellow-100 text-yellow-800">⭐ Phare</Badge>}
                  </div>
                  <CardTitle className="text-lg group-hover:text-slate-600 transition-colors line-clamp-2">
                    {story.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{story.team} membres</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{story.impact}</span>
                      </div>
                    </div>

                    {/* Technologies (premières 2) */}
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {story.technologies.slice(0, 2).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {story.technologies.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{story.technologies.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-gray-500">
                        {story.founder}
                      </div>
                      <Button variant="outline" size="sm" className="group">
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
          <h3 className="text-2xl font-bold mb-4">Votre projet mérite d'être mis en avant !</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Partagez votre success story et inspirez d'autres innovateurs sénégalais. 
            Votre expérience peut faire la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
              Partager mon projet
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              Voir les critères
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
