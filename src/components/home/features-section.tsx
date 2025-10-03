'use client'

import { Button } from '@/components/ui/button'
import { 
  Brain, Users, Trophy, BookOpen, Code, Check
} from 'lucide-react'
import Link from 'next/link'

export default function FeaturesSection() {
  return (
    <>
      {/* Who's on Looymind Section - Style Kaggle */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Qui utilise Looymind ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🎓',
                title: 'Étudiants',
                description: 'Explorez les cours, compétitions et forums de Looymind.',
                color: 'from-cyan-400 to-blue-400'
              },
              {
                emoji: '💻',
                title: 'Développeurs',
                description: 'Utilisez les modèles, notebooks et datasets de Looymind.',
                color: 'from-purple-400 to-pink-400'
              },
              {
                emoji: '🔬',
                title: 'Chercheurs',
                description: 'Faites progresser l\'IA avec notre hub de modèles pré-entraînés.',
                color: 'from-orange-400 to-red-400'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-5xl shadow-lg`}>
                  {item.emoji}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tackle your next project - Alternated Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left - Text */}
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Lancez votre prochain projet avec Looymind
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Sur Looymind, vous trouverez toutes les ressources et connaissances nécessaires pour votre prochain projet d'IA et de Machine Learning.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">500+</div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide">Membres</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">100+</div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide">Projets</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">25+</div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide">Compétitions</div>
                </div>
              </div>

              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white" asChild>
                <Link href="/competitions">
                  Explorer les compétitions
                </Link>
              </Button>
            </div>

            {/* Right - Mockup/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                {/* Fake interface preview */}
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                  {/* Fake tabs */}
                  <div className="flex border-b border-slate-200 bg-slate-50">
                    <div className="px-4 py-2 bg-white border-r border-slate-200 text-sm font-medium text-slate-900">
                      Compétitions
                    </div>
                    <div className="px-4 py-2 text-sm text-slate-500">
                      Projets
                    </div>
                    <div className="px-4 py-2 text-sm text-slate-500">
                      Articles
                    </div>
                  </div>

                  {/* Fake content */}
                  <div className="p-4 space-y-3">
                    {[
                      { title: 'Défi Santé IA', prize: '200k FCFA', badge: 'Actif', color: 'green' },
                      { title: 'Agriculture ML', prize: '150k FCFA', badge: 'À venir', color: 'yellow' },
                      { title: 'Vision par ordinateur', prize: '100k FCFA', badge: 'Fermé', color: 'gray' }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-cyan-500 flex items-center justify-center text-white text-lg">
                            🎯
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-500">{item.prize}</div>
                          </div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          item.color === 'green' ? 'bg-green-100 text-green-700' :
                          item.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {item.badge}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Features - Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une plateforme complète pour développer vos compétences en IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: 'Compétitions',
                description: 'Participez à des défis de data science avec des prix en FCFA',
                color: 'text-cyan-600 bg-cyan-100'
              },
              {
                icon: BookOpen,
                title: 'Ressources',
                description: 'Accédez à des cours et tutoriels pour progresser',
                color: 'text-purple-600 bg-purple-100'
              },
              {
                icon: Users,
                title: 'Communauté',
                description: 'Connectez-vous avec 500+ talents IA en Afrique',
                color: 'text-orange-600 bg-orange-100'
              },
              {
                icon: Code,
                title: 'Projets',
                description: 'Partagez vos créations et collaborez',
                color: 'text-green-600 bg-green-100'
              },
              {
                icon: Brain,
                title: 'Articles',
                description: 'Lisez et publiez des articles techniques',
                color: 'text-indigo-600 bg-indigo-100'
              },
              {
                icon: Trophy,
                title: 'Classements',
                description: 'Suivez votre progression et comparez-vous',
                color: 'text-pink-600 bg-pink-100'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simple and Clean */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Rejoignez la communauté IA du Sénégal et participez à votre première compétition dès aujourd'hui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-base px-10" 
              asChild
            >
              <Link href="/register">
                Rejoindre Looymind
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50 text-base px-10" 
              asChild
            >
              <Link href="/competitions">
                Parcourir les compétitions
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Communauté active</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Contenu en français</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Prix en FCFA</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
