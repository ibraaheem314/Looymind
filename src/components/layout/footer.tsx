import Link from 'next/link'
import { Brain, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <div className="w-14 h-14">
                <img 
                  src="/Logo.png" 
                  alt="Looymind Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              La première communauté hybride IA du Sénégal. Connectons les talents, 
              partageons les connaissances et construisons l'avenir de l'IA en Afrique.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/challenges" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Défis IA
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Projets
                </Link>
              </li>
              <li>
                <Link 
                  href="/talents" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Talents
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Ressources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Aide
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Looymind. Tous droits réservés. Fait avec ❤️ au Sénégal.
          </p>
        </div>
      </div>
    </footer>
  )
}