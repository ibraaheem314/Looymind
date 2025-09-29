import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, Search, BookOpen, MessageCircle, Mail, Phone,
  ChevronDown, ChevronRight, CheckCircle, AlertCircle, Info
} from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Compte et Profil",
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: "Comment créer un compte ?",
          answer: "Cliquez sur 'S'inscrire' en haut de la page, remplissez le formulaire avec vos informations et confirmez votre email."
        },
        {
          question: "Comment modifier mon profil ?",
          answer: "Allez dans votre dashboard, cliquez sur 'Mon profil' et modifiez les informations que vous souhaitez changer."
        },
        {
          question: "Comment changer mon mot de passe ?",
          answer: "Dans votre profil, allez dans la section 'Sécurité' et cliquez sur 'Changer le mot de passe'."
        }
      ]
    },
    {
      title: "Défis et Participation",
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          question: "Comment participer à un défi ?",
          answer: "Naviguez vers la page des défis, choisissez un défi qui vous intéresse et cliquez sur 'Participer'. Suivez les instructions pour soumettre votre solution."
        },
        {
          question: "Quels sont les critères d'évaluation ?",
          answer: "Chaque défi a ses propres critères d'évaluation. Consultez la section 'Critères' sur la page du défi pour plus de détails."
        },
        {
          question: "Comment soumettre ma solution ?",
          answer: "Une fois inscrit au défi, vous aurez accès au formulaire de soumission. Téléchargez vos fichiers et ajoutez une description de votre approche."
        }
      ]
    },
    {
      title: "Projets et Collaboration",
      icon: <MessageCircle className="h-5 w-5" />,
      questions: [
        {
          question: "Comment créer un projet ?",
          answer: "Allez dans la section 'Projets', cliquez sur 'Créer un projet' et remplissez les informations requises. Votre projet sera visible par la communauté."
        },
        {
          question: "Comment rejoindre un projet existant ?",
          answer: "Sur la page du projet, cliquez sur 'Rejoindre le projet' et envoyez une demande aux créateurs du projet."
        },
        {
          question: "Comment collaborer efficacement ?",
          answer: "Utilisez les outils de communication intégrés, partagez vos idées et respectez les délais convenus avec l'équipe."
        }
      ]
    },
    {
      title: "Articles et Contenu",
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          question: "Comment écrire un article ?",
          answer: "Connectez-vous, allez dans 'Articles' et cliquez sur 'Écrire un article'. Rédigez votre contenu et publiez-le pour la communauté."
        },
        {
          question: "Quels types d'articles puis-je publier ?",
          answer: "Vous pouvez publier des tutoriels, des analyses, des retours d'expérience, des actualités IA, etc. Le contenu doit être pertinent pour la communauté."
        },
        {
          question: "Comment modifier un article ?",
          answer: "Sur la page de votre article, cliquez sur 'Modifier' si vous en êtes l'auteur. Vous pouvez modifier le contenu et republier."
        }
      ]
    },
    {
      title: "Communauté et Réseautage",
      icon: <MessageCircle className="h-5 w-5" />,
      questions: [
        {
          question: "Comment trouver des mentors ?",
          answer: "Consultez la section 'Talents' pour découvrir les mentors disponibles. Vous pouvez les contacter directement via leur profil."
        },
        {
          question: "Comment devenir mentor ?",
          answer: "Contactez-nous avec votre CV et votre expérience. Nous évaluerons votre candidature et vous informerons de la suite."
        },
        {
          question: "Comment participer aux discussions ?",
          answer: "Rejoignez les discussions sur les pages des défis et projets, ou créez vos propres sujets de discussion."
        }
      ]
    }
  ]

  const quickLinks = [
    { title: "Guide de démarrage", href: "/help/getting-started", description: "Tout ce qu'il faut savoir pour commencer" },
    { title: "Règles de la communauté", href: "/help/community-guidelines", description: "Nos règles et bonnes pratiques" },
    { title: "Guide des défis", href: "/help/challenges-guide", description: "Comment participer aux défis" },
    { title: "Guide des projets", href: "/help/projects-guide", description: "Créer et gérer des projets" },
    { title: "Support technique", href: "/contact", description: "Problèmes techniques ? Contactez-nous" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Centre d'aide
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Rechercher dans l'aide</h2>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tapez votre question ici..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
                <Button>Rechercher</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liens rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={link.href}>Consulter</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-l-4 border-blue-100 pl-4">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-slate-800 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Notre équipe de support est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-800 hover:bg-gray-100" asChild>
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Nous contacter
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800">
                <Phone className="h-4 w-4 mr-2" />
                Appeler le support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
