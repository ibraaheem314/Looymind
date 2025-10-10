import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, MessageSquare, Trophy, BookOpen, Code } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0e1a] text-white border-t border-slate-800/50">
      {/* Subtle gradient overlay - Plus discret */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" aria-hidden="true" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Logo et description - 4 colonnes (réduit) */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9">
                <img 
                  src="/Logo.png" 
                  alt="Palanteer Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                Palanteer
              </span>
            </div>
            <p className="text-slate-400 mb-5 max-w-sm text-sm leading-relaxed">
              Plateforme éducative IA pour les talents sénégalais. Accédez à des ressources, 
              partagez vos connaissances et construisez l'avenir de l'IA en Afrique.
            </p>
            
            {/* Badge BETA - Plus subtil */}
            <Badge className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-300/90 text-xs mb-5">
              Plateforme en BETA
            </Badge>

            {/* Social Links - Minimalistes et subtils */}
            <div className="flex space-x-2">
              <a 
                href="https://github.com/palanteer" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com/palanteer" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com/company/palanteer" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://discord.gg/palanteer" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Discord"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a 
                href="mailto:contact@palanteer.com" 
                className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation - 2 colonnes */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-3 text-white text-sm">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/resources" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Ressources
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources/paths" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Parcours d'apprentissage
                </Link>
              </li>
              <li>
                <Link 
                  href="/articles" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                >
                  Articles
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
            </ul>
          </div>

          {/* Support - 2 colonnes */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-3 text-white text-sm">
              Support
            </h3>
            <ul className="space-y-2.5">
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

          {/* Communauté - 4 colonnes */}
          <div className="col-span-1 md:col-span-4">
            <h3 className="font-semibold mb-3 text-white text-sm">
              Communauté
            </h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Rejoignez des centaines de talents passionnés par l'IA
            </p>
            <Link 
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200 text-sm font-medium group shadow-sm"
            >
              Rejoindre Palanteer
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            
            <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-slate-500 text-xs mb-1.5">Newsletter</p>
              <p className="text-slate-400 text-xs">
                Restez informé des nouveautés et événements
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-slate-800/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <p className="text-center md:text-left">
              © 2025 Palanteer. Tous droits réservés. Fait avec <span className="text-red-500">❤️</span> au Sénégal.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                CGU
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                Confidentialité
              </Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-slate-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
