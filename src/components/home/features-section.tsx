'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Users, Trophy, BookOpen, Lightbulb, Target, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const features = [
  {
    icon: Trophy,
    title: 'Défis IA Compétitifs',
    description: 'Participez à des compétitions de machine learning avec des datasets réels et des prix attractifs en XOF.',
    href: '/challenges'
  },
  {
    icon: Users,
    title: 'Communauté d\'Apprentissage',
    description: 'Connectez-vous avec plus de 500 talents, mentors et experts IA du Sénégal et d\'Afrique.',
    href: '/talents'
  },
  {
    icon: Lightbulb,
    title: 'Projets Collaboratifs',
    description: 'Créez et rejoignez des projets IA innovants pour résoudre des problèmes locaux africains.',
    href: '/projects'
  },
  {
    icon: BookOpen,
    title: 'Ressources Éducatives',
    description: 'Accédez à des cours, tutoriels et ressources en français adaptés au contexte africain.',
    href: '/resources'
  },
  {
    icon: Target,
    title: 'Opportunités Carrière',
    description: 'Découvrez des opportunités d\'emploi et de stage dans le domaine de l\'IA au Sénégal.',
    href: '/jobs'
  },
  {
    icon: Brain,
    title: 'Innovation Locale',
    description: 'Développez des solutions IA adaptées aux défis spécifiques du Sénégal et de l\'Afrique.',
    href: '/innovation'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm">
            <Brain className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 font-medium text-sm">Écosystème Complet</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi choisir
            <span className="block text-gray-600">Looymind ?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une plateforme complète pour développer vos compétences en IA, 
            collaborer avec la communauté et contribuer à l'innovation technologique au Sénégal.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-slate-300 group">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed mb-6">
                  {feature.description}
                </CardDescription>
                
                <Button variant="ghost" className="group p-0 h-auto font-medium text-gray-700 hover:text-gray-900" asChild>
                  <Link href={feature.href}>
                    En savoir plus
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-900 text-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à rejoindre la révolution IA ?
          </h3>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Commencez votre parcours dès aujourd'hui et façonnez l'avenir de l'Intelligence Artificielle en Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg" asChild>
              <Link href="/register">
                Rejoindre maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white" asChild>
              <Link href="/about">
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}