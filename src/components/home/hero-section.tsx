'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
                <div className="w-5 h-5">
                  <img src="/Logo.png" alt="Looymind" className="w-full h-full object-contain" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Première communauté IA du Sénégal</span>
              </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            L'IA au service du
            <span className="block text-gray-600">
              Sénégal
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Rejoignez la révolution de l'Intelligence Artificielle en Afrique. 
            Apprenez, collaborez et innovez avec les meilleurs talents du continent.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button size="lg" className="text-base px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white shadow-lg">
              <Link href="/challenges" className="flex items-center">
                Découvrir les défis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Link href="/projects">
                Explorer les projets
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, number: "500+", label: "Talents connectés" },
              { icon: Trophy, number: "25+", label: "Défis IA lancés" },
              { icon: Brain, number: "100+", label: "Projets réalisés" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-200 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}