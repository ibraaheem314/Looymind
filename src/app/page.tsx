'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Trophy, Users, BookOpen, Code, 
  Check, Target, ChevronDown, Search, Rocket
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

// Composant FAQ Accordion
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Est-ce que LooyMind est vraiment gratuit ?',
      answer: 'Oui, 100% gratuit ! Tous les cours, ressources, compétitions et outils sont accessibles gratuitement.'
    },
    {
      question: 'Faut-il être expert en IA pour rejoindre ?',
      answer: 'Pas du tout ! LooyMind accueille tous les niveaux, du débutant complet à l\'expert.'
    },
    {
      question: 'Les compétitions offrent-elles des prix réels ?',
      answer: 'Oui ! Les compétitions offrent des prix en FCFA (jusqu\'à 500k), des stages et des opportunités d\'emploi.'
    },
    {
      question: 'Puis-je trouver un emploi grâce à LooyMind ?',
      answer: 'Absolument ! De nombreux membres ont trouvé des stages, emplois ou missions freelance grâce à leur portfolio.'
    }
  ]

  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Minimal Kaggle Style */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Accélérez votre transformation IA
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La première communauté francophone dédiée à l'IA en Afrique. 
                Apprenez, pratiquez et innovez avec les meilleurs talents.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {isAuthenticated ? (
                  <>
                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white" asChild>
                      <Link href="/dashboard">
                        Mon Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/competitions">
                        Explorer
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white" asChild>
                      <Link href="/auth/register">
                        Commencer gratuitement
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="#how-it-works">
                        Comment ça marche
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>En français</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Communauté active</span>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="relative">
              <div className="relative bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🏆', label: 'Compétitions', color: 'bg-blue-50' },
                    { icon: '💻', label: 'Projets', color: 'bg-purple-50' },
                    { icon: '📚', label: 'Ressources', color: 'bg-orange-50' },
                    { icon: '✍️', label: 'Articles', color: 'bg-green-50' }
                  ].map((item, i) => (
                    <div key={i} className={`${item.color} rounded-xl p-6 text-center border border-gray-200`}>
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Partenaires */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 mb-8">
            Soutenu par les leaders de l'écosystème tech africain
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { name: 'Orange', subtitle: 'Partenaire Tech' },
              { name: 'UCAD', subtitle: 'Partenaire Académique' },
              { name: 'ADIE', subtitle: 'Innovation' },
              { name: 'Sénégal 2025', subtitle: 'Stratégie Numérique' }
            ].map((partner, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-gray-400">{partner.name.slice(0, 2)}</span>
                </div>
                <div className="text-xs font-medium text-gray-900">{partner.name}</div>
                <div className="text-xs text-gray-500">{partner.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Objectifs 2025 */}
      <section className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-medium text-gray-500 mb-8">
            Nos Objectifs 2025
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Talents IA' },
              { value: '50+', label: 'Compétitions' },
              { value: '200+', label: 'Projets' },
              { value: '100+', label: 'Ressources' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Left/Right Alternating */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Feature 1 - Image Right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700 mb-4">
                Compétitions
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Participez à des défis IA réels
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Résolvez des problèmes concrets avec des données africaines et gagnez des prix jusqu'à 500k FCFA.
              </p>
              <ul className="space-y-3">
                {['Datasets locaux', 'Prix en FCFA', 'Feedback expert', 'Opportunités d\'emploi'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="space-y-4">
                {[
                  { title: 'Prédiction Agriculture', prize: '300k FCFA', participants: '234' },
                  { title: 'NLP en Wolof', prize: '500k FCFA', participants: '189' }
                ].map((comp, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-semibold text-gray-900">{comp.title}</div>
                      <Trophy className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>🏆 {comp.prize}</span>
                      <span>👥 {comp.participants} participants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 - Image Left */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  {['Python', 'TensorFlow', 'Machine Learning', 'Data Analysis', 'Deep Learning', 'NLP'].map((skill, i) => (
                    <div key={i} className="bg-white rounded-lg px-4 py-3 text-center border border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{skill}</div>
                      <div className="text-xs text-gray-500 mt-1">102 cours</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-purple-50 rounded-full text-sm font-medium text-purple-700 mb-4">
                Ressources
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Apprenez en français
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Accédez à 100+ ressources, cours et tutoriels en français adaptés au contexte africain.
              </p>
              <ul className="space-y-3">
                {['Cours gratuits', 'Tutoriels vidéo', 'Documentation complète', 'Parcours personnalisés'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 - Image Right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-green-50 rounded-full text-sm font-medium text-green-700 mb-4">
                Communauté
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Collaborez et grandissez
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Partagez vos projets, trouvez des collaborateurs et connectez-vous avec la communauté IA.
              </p>
              <ul className="space-y-3">
                {['Projets collaboratifs', 'Mentorat', 'Networking', 'Événements'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="space-y-4">
                {[
                  { name: 'Aminata D.', role: 'Data Scientist', badge: '🏆 300k FCFA' },
                  { name: 'Ibrahima S.', role: 'ML Engineer', badge: '🚀 Startup' },
                  { name: 'Fatou M.', role: 'Développeuse', badge: '💼 Orange' }
                ].map((member, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                    <div className="text-xs">{member.badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Intermédiaire - Après Features */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Votre parcours IA commence ici
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Rejoignez la communauté et transformez vos compétences
          </p>
          <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900" asChild>
            <Link href="/auth/register">
              S'inscrire gratuitement
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section - Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ils ont transformé leur carrière
            </h2>
            <p className="text-lg text-gray-600">
              Rejoignez des centaines de talents qui font confiance à LooyMind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "J'ai remporté 2 compétitions et décroché un stage chez Orange en 6 mois. LooyMind a changé ma vie.",
                author: 'Aminata Diallo',
                role: 'Data Scientist',
                company: 'Orange Sénégal',
                avatar: 'AD'
              },
              {
                quote: "Reconverti en IA grâce aux ressources francophones. J'ai maintenant lancé ma propre startup IA !",
                author: 'Ibrahima Sy',
                role: 'Fondateur',
                company: 'AI4Africa',
                avatar: 'IS'
              },
              {
                quote: "J'ai trouvé 3 collaborateurs pour mon projet NLP en Wolof. Maintenant 5000+ utilisateurs quotidiens.",
                author: 'Fatou Mbaye',
                role: 'ML Engineer',
                company: 'Freelance',
                avatar: 'FM'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Rejoignez LooyMind en 3 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Users,
                title: 'Créez votre compte',
                desc: 'Inscription gratuite en 2 minutes'
              },
              {
                step: '2',
                icon: Search,
                title: 'Explorez & Apprenez',
                desc: 'Parcourez ressources et cours adaptés'
              },
              {
                step: '3',
                icon: Rocket,
                title: 'Participez & Grandissez',
                desc: 'Rejoignez compétitions et projets'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-300" />
                )}
                <div className="relative bg-white rounded-xl p-8 border border-gray-200">
                  <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white" asChild>
              <Link href="/auth/register">
                Commencer maintenant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-gray-600">
              Tout ce que vous devez savoir
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Prêt à passer à l'action ?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Inscrivez-vous gratuitement et participez à votre première compétition
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white" asChild>
              <Link href="/auth/register">
                Rejoindre gratuitement
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/competitions">
                Explorer les compétitions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
