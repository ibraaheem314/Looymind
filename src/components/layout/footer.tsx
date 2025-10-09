import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <img 
                  src="/Logo.png" 
                  alt="Palanteer Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">Palanteer</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md text-sm leading-relaxed">
              La première communauté hybride IA du Sénégal. Connectons les talents, 
              partageons les connaissances et construisons l'avenir de l'IA en Afrique.
            </p>
            <div className="flex space-x-2">
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-all duration-200"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-all duration-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="mailto:contact@looymind.com" 
                className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/competitions" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Défis IA
                </Link>
              </li>
              <li>
                <Link 
                  href="/projects" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Projets
                </Link>
              </li>
              <li>
                <Link 
                  href="/talents" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Talents
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Ressources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Aide
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Palanteer. Tous droits réservés. Fait avec <span className="text-red-500">❤️</span> au Sénégal.
          </p>
        </div>
      </div>
    </footer>
  )
}
