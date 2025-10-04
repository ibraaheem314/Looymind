'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Trophy, Users, BookOpen, Code, 
  Brain, Target, Award, Check, Sparkles, 
  Rocket, TrendingUp, Zap, GraduationCap,
  MessageSquare, Database, Star, Play,
  BarChart3, Heart, Eye
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ========================================
          HERO SECTION - Bleu nuit profond du logo (plus sombre)
      ======================================== */}
      <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5986] to-[#1e3a5f] overflow-hidden">
        {/* Floating elements - Subtils et élégants */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-blob animation-delay-200" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Badge - Style Andakia */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2.5 mb-8 animate-fadeIn">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-semibold text-white">🇸🇳 Plateforme IA #1 en Afrique</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] text-white animate-fadeInUp">
              Devenez un expert en
              <span className="block mt-3 bg-gradient-to-r from-cyan-300 via-blue-200 to-blue-300 bg-clip-text text-transparent">
                Intelligence Artificielle
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-100">
              Participez à des compétitions, apprenez avec des ressources francophones, 
              partagez vos projets et collaborez avec les meilleurs talents du continent.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeInUp animation-delay-200">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-gray-50 hover:text-[#2d5986] text-lg px-10 py-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold" asChild>
                    <Link href="/dashboard">
                      <Zap className="h-5 w-5 mr-2" />
                      Mon Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:border-white text-lg px-10 py-6 transition-all duration-300" asChild>
                    <Link href="/competitions">
                      <Trophy className="h-5 w-5 mr-2" />
                      Voir les compétitions
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-gray-50 hover:text-[#2d5986] text-lg px-10 py-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold" asChild>
                    <Link href="/auth/register">
                      Commencer gratuitement
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 hover:border-white text-lg px-10 py-6 transition-all duration-300" asChild>
                    <Link href="#features">
                      <Play className="h-5 w-5 mr-2" />
                      Découvrir la plateforme
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100 text-sm animate-fadeInUp animation-delay-300">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-300" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-300" />
                <span>En Français</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-300" />
                <span>Communauté Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-300" />
                <span>Basé au Sénégal</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator - Transition fluide style Andakia */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* ========================================
          SECTION 0: C'est quoi LooyMind ? (Simple et clair)
      ======================================== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message principal */}
          <div className="text-center mb-16 animate-fadeInUp">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5 mb-4">
              La Plateforme IA du Sénégal
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              <span className="text-cyan-500">LooyMind</span>, c'est quoi ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              La première plateforme francophone d'Afrique qui réunit <strong>compétitions IA</strong>, 
              <strong> ressources d'apprentissage</strong>, <strong>projets collaboratifs</strong> et une 
              <strong> communauté active</strong> — tout en un seul endroit.
            </p>
          </div>

          {/* 4 Piliers - Version simple et claire */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center p-8 border-2 border-cyan-200 bg-cyan-50/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-10 w-10 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Compétitions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Résolvez des défis IA réels, gagnez des prix en FCFA et prouvez vos compétences
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-green-200 bg-green-50/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Ressources</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cours, tutoriels et outils 100% en français, adaptés au contexte africain
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-purple-200 bg-purple-50/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Code className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Projets</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Partagez vos créations, construisez votre portfolio et trouvez des collaborateurs
              </p>
            </Card>

            <Card className="text-center p-8 border-2 border-orange-200 bg-orange-50/30 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Communauté</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connectez-vous avec mentors, talents et organisations du continent
              </p>
            </Card>
          </div>

          {/* One-liner mémorable */}
          <div className="mt-16 text-center">
            <p className="text-2xl md:text-3xl font-bold text-slate-900">
              <span className="text-cyan-500">Apprenez.</span>{' '}
              <span className="text-purple-500">Pratiquez.</span>{' '}
              <span className="text-orange-500">Excellez.</span>
            </p>
            <p className="text-slate-700 mt-4 text-xl font-semibold">
              Votre tremplin vers une carrière en IA 🚀
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 1: Le Problème (Texte Gauche + Stats Droite)
      ======================================== */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Texte à gauche */}
            <div className="animate-slideInLeft">
              <div className="inline-block mb-4">
                <Badge className="bg-orange-100 text-orange-700 border-0 text-sm px-4 py-1.5">
                  L'Opportunité
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                L'IA en Afrique a besoin de <span className="text-orange-500">champions francophones</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Les talents africains sont brillants, mais ils font face à des obstacles :
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Peu de ressources en français adaptées au contexte local',
                  'Manque de compétitions et challenges pratiques',
                  'Difficulté à trouver des collaborateurs et mentors',
                  'Pas de plateforme centralisée pour la communauté'
                ].map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-orange-100 rounded-full">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    </div>
                    <p className="text-slate-700">{problem}</p>
                  </div>
                ))}
              </div>

              <p className="text-lg font-semibold text-orange-600">
                → C'est votre opportunité de briller ! 🚀
              </p>
            </div>

            {/* Stats à droite */}
            <div className="animate-slideInRight">
              <div className="relative">
                {/* Mockup stats card */}
                <Card className="bg-white border-2 border-slate-200 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">État de l'IA en Afrique</h3>
                      <p className="text-slate-600">Données 2024</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-cyan-50 rounded-xl border border-cyan-100">
                        <div className="text-4xl font-bold text-cyan-600 mb-2">5%</div>
                        <div className="text-sm text-slate-600">Contenu francophone</div>
                      </div>
                      <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
                        <div className="text-sm text-slate-600">Plateformes locales</div>
                      </div>
                      <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                        <div className="text-4xl font-bold text-purple-600 mb-2">60%</div>
                        <div className="text-sm text-slate-600">Talents isolés</div>
                      </div>
                      <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="text-4xl font-bold text-orange-600 mb-2">3x</div>
                        <div className="text-sm text-slate-600">Potentiel de croissance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg transform rotate-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-bold">Opportunité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2: La Solution (Dashboard Gauche + Texte Droite)
      ======================================== */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Decorative curves - Kaggle style */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Dashboard mockup à gauche */}
            <div className="order-2 lg:order-1 animate-slideInLeft">
              <div className="relative">
                {/* Main dashboard card */}
                <Card className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Aminata Diallo</div>
                        <div className="text-sm text-slate-500">Data Scientist</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600 mb-1">12</div>
                        <div className="text-xs text-slate-600">Compétitions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                        <div className="text-xs text-slate-600">Projets</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">#15</div>
                        <div className="text-xs text-slate-600">Classement</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium">Prédiction Prix Dakar</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">Top 10</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Code className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-medium">NLP en Wolof</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">En cours</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating notification */}
                <div className="absolute -bottom-6 -right-6 bg-white border-2 border-green-200 rounded-xl p-4 shadow-xl max-w-xs">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Nouveau badge débloqué!</div>
                      <div className="text-xs text-slate-600">Top 20 Compétiteur 🏆</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Texte à droite */}
            <div className="order-1 lg:order-2 animate-slideInRight">
              <div className="inline-block mb-4">
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5">
                  La Solution
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                <span className="text-cyan-500">LooyMind</span>, votre plateforme tout-en-un
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Nous avons créé l'écosystème complet dont vous avez besoin pour exceller en IA :
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Trophy className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Compétitions Réelles</h3>
                    <p className="text-slate-600 text-sm">Résolvez des problèmes concrets et gagnez des prix en FCFA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Ressources Francophones</h3>
                    <p className="text-slate-600 text-sm">Cours, tutoriels et outils adaptés au contexte africain</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Communauté Active</h3>
                    <p className="text-slate-600 text-sm">Connectez-vous avec mentors, talents et organisations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Code className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Projets Collaboratifs</h3>
                    <p className="text-slate-600 text-sm">Partagez vos créations et trouvez des collaborateurs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 3: Fonctionnalités (Texte Gauche + Preview Droite)
      ======================================== */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        {/* Decorative curves - Kaggle style */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Texte à gauche */}
            <div className="animate-slideInLeft">
              <div className="inline-block mb-4">
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5">
                  Fonctionnalités
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Tout ce dont vous avez besoin pour <span className="text-cyan-500">progresser</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                LooyMind regroupe tous les outils essentiels pour votre apprentissage et votre carrière en IA.
              </p>

              <div className="space-y-6">
                <Card className="border-2 border-cyan-200 bg-cyan-50/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-cyan-100 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-2">Classement & Leaderboard</h3>
                        <p className="text-slate-600 text-sm">Suivez votre progression, comparez-vous aux meilleurs et débloquez des badges.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 bg-green-50/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-2">Apprentissage Structuré</h3>
                        <p className="text-slate-600 text-sm">Parcours guidés du débutant à l'expert avec des ressources triées et validées.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 bg-orange-50/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <MessageSquare className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-2">Communauté & Support</h3>
                        <p className="text-slate-600 text-sm">Discutez, partagez, apprenez. Une communauté bienveillante et active.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Preview à droite */}
            <div className="animate-slideInRight">
              <div className="relative">
                {/* Features grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-cyan-50 border-2 border-cyan-200 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-cyan-100 rounded-2xl mb-4">
                        <Trophy className="h-8 w-8 text-cyan-600" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-600 mb-1">25+</div>
                      <div className="text-sm font-medium text-slate-700">Compétitions</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-2 border-green-200 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-green-100 rounded-2xl mb-4">
                        <BookOpen className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">100+</div>
                      <div className="text-sm font-medium text-slate-700">Ressources</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-purple-100 rounded-2xl mb-4">
                        <Code className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">150+</div>
                      <div className="text-sm font-medium text-slate-700">Projets</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-2 border-orange-200 hover:shadow-xl transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-orange-100 rounded-2xl mb-4">
                        <Users className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">500+</div>
                      <div className="text-sm font-medium text-slate-700">Membres</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Floating testimonial */}
                <div className="mt-6 bg-white border-2 border-slate-200 rounded-xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 mb-3 italic">
                    "LooyMind m'a permis de décrocher mon premier emploi en data science. 
                    Les compétitions sont top!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                    <div>
                      <div className="font-semibold text-sm">Moussa Ndiaye</div>
                      <div className="text-xs text-slate-500">Data Scientist @ Orange Sénégal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 4: Impact (Photos Gauche + Texte Droite)
      ======================================== */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Decorative curves - Kaggle style */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Visuel communauté à gauche */}
            <div className="animate-slideInLeft">
              <div className="relative">
                {/* Community stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-cyan-50 border-2 border-cyan-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Brain className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-cyan-600 mb-1">500+</div>
                      <div className="text-sm text-slate-600">Talents Formés</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-2 border-blue-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Trophy className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-blue-600 mb-1">25</div>
                      <div className="text-sm text-slate-600">Compétitions</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-2 border-purple-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Rocket className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-purple-600 mb-1">150</div>
                      <div className="text-sm text-slate-600">Projets Lancés</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-2 border-orange-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Star className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                      <div className="text-4xl font-bold text-orange-600 mb-1">4.9</div>
                      <div className="text-sm text-slate-600">Note Moyenne</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Badge */}
                <div className="mt-6 inline-flex items-center gap-3 bg-[#2d5986] text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Sparkles className="h-6 w-6" />
                  <div>
                    <div className="font-bold">Impact Mesuré</div>
                    <div className="text-sm opacity-90">Données réelles, communauté active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Texte à droite */}
            <div className="animate-slideInRight">
              <div className="inline-block mb-4">
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5">
                  Notre Impact
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Une communauté qui <span className="text-cyan-500">transforme des vies</span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Depuis notre lancement, LooyMind a permis à des centaines de talents sénégalais 
                de développer leurs compétences et de lancer leur carrière en IA.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { stat: '85%', label: 'ont trouvé un emploi ou stage dans les 6 mois', icon: TrendingUp },
                  { stat: '92%', label: 'recommandent LooyMind à leurs pairs', icon: Star },
                  { stat: '3x', label: 'augmentation du réseau professionnel', icon: Users }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-100 rounded-xl">
                      <item.icon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-600">{item.stat}</div>
                      <div className="text-slate-600">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 bg-cyan-50/50 rounded-r-xl">
                <p className="text-slate-700 italic mb-3">
                  "J'ai découvert ma passion pour le NLP grâce aux ressources de LooyMind. 
                  Aujourd'hui, je travaille sur des projets qui impactent mon pays."
                </p>
                <footer className="text-cyan-600 font-semibold">
                  — Fatou Sall, NLP Engineer
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 5: CTA Final - Centré et puissant (Kaggle style)
      ======================================== */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Decorative curves - Kaggle style */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-subtlePulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl animate-subtlePulse animation-delay-200"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="animate-fadeInUp">
            {/* Icon with gradient background */}
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/30">
              <Rocket className="h-10 w-10 text-white animate-subtlePulse" />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Prêt à propulser votre carrière en <span className="text-cyan-500">IA</span> ?
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Rejoignez des centaines de talents qui développent leurs compétences et 
              construisent l'avenir de l'IA en Afrique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-[#2d5986] hover:bg-[#1e3a5f] text-white text-lg px-10 py-7 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold" asChild>
                <Link href="/auth/register">
                  <Zap className="h-5 w-5 mr-2" />
                  Commencer Gratuitement
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-lg px-10 py-7" asChild>
                <Link href="/competitions">
                  Explorer les compétitions
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-500" />
                <span>Inscription en 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-500" />
                <span>Aucune carte bancaire requise</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-cyan-500" />
                <span>Accès immédiat</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
