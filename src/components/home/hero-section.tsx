'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HeroSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
              Progressez avec la plus grande communauté IA d'Afrique
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Rejoignez plus de <span className="font-semibold text-slate-900">500 talents</span> pour partager, tester et rester à jour sur les dernières techniques en IA. Découvrez un immense dépôt de modèles, données et code pour votre prochain projet.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-base px-8" asChild>
                    <Link href="/competitions">
                      Voir les compétitions
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-base px-8" asChild>
                    <Link href="/dashboard">
                      Mon Tableau de Bord
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-base px-8" asChild>
                    <Link href="/register">
                      Rejoindre Looymind
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-base px-8" asChild>
                    <Link href="/competitions">
                      Explorer
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats Inline */}
            <div className="flex flex-wrap gap-8 text-slate-600 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <span>500+ membres actifs</span>
              </div>
              <span>•</span>
              <span>25+ compétitions lancées</span>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative hidden lg:block">
            {/* Illustration simple avec des éléments */}
            <div className="relative">
              {/* Main visual */}
              <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-slate-200">
                {/* Mockup d'interface */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                  {/* Header mockup */}
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  
                  {/* Content mockup */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-xl">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                      <div className="text-2xl font-bold text-cyan-500">200k</div>
                    </div>
                    
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-cyan-500 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">👥</div>
                        <div className="text-xs text-slate-600">500+</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">💻</div>
                        <div className="text-xs text-slate-600">100+</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-xs text-slate-600">25+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl transform rotate-12 flex items-center justify-center text-3xl shadow-lg">
                🚀
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-500 rounded-xl transform -rotate-6 flex items-center justify-center text-2xl shadow-lg">
                ⚡
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
