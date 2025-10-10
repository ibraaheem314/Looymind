'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, Trophy, Users, BookOpen, Code, 
  Brain, Target, Award, Check, Sparkles, 
  Rocket, TrendingUp, Zap, GraduationCap,
  MessageSquare, Database, Star, Play,
  BarChart3, Heart, Eye, Mail
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      
      {/* ========================================
          HERO SECTION - Design Premium avec animations organiques
      ======================================== */}
      <section className="relative bg-gradient-to-b from-[#0a0e1a] via-[#0d1117] to-[#0f172a] overflow-hidden" id="main-content">
        {/* Aurora gradient mesh - Effet "northern lights" subtil */}
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent animate-aurora" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-600/15 via-cyan-400/10 to-transparent animate-aurora-reverse" />
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3lhbiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" aria-hidden="true" />
        
        {/* Particules flottantes organiques - Mouvement 3D naturel */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Particule 1 - Large, lente, cyan */}
          <div className="absolute top-[20%] left-[15%] w-3 h-3 animate-float-organic-1">
            <div className="w-full h-full bg-cyan-400 rounded-full blur-[2px] opacity-40" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping-slow opacity-30" />
          </div>
          
          {/* Particule 2 - Moyenne, medium, blue */}
          <div className="absolute top-[30%] right-[20%] w-2 h-2 animate-float-organic-2">
            <div className="w-full h-full bg-blue-400 rounded-full blur-[1.5px] opacity-35" />
          </div>
          
          {/* Particule 3 - Petite, rapide, cyan */}
          <div className="absolute bottom-[35%] left-[25%] w-1.5 h-1.5 animate-float-organic-3">
            <div className="w-full h-full bg-cyan-300 rounded-full blur-[1px] opacity-45" />
            <div className="absolute inset-0 bg-cyan-300 rounded-full animate-ping-slow opacity-25 animation-delay-500" />
          </div>
          
          {/* Particule 4 - Moyenne, lente, cyan */}
          <div className="absolute top-[60%] right-[30%] w-2.5 h-2.5 animate-float-organic-4">
            <div className="w-full h-full bg-cyan-500 rounded-full blur-[2px] opacity-30" />
          </div>
          
          {/* Particule 5 - Petite, medium, blue */}
          <div className="absolute top-[45%] left-[45%] w-1 h-1 animate-float-organic-5">
            <div className="w-full h-full bg-blue-300 rounded-full blur-[0.5px] opacity-50" />
          </div>
          
          {/* Particule 6 - Moyenne, rapide, cyan */}
          <div className="absolute bottom-[25%] right-[35%] w-2 h-2 animate-float-organic-6">
            <div className="w-full h-full bg-cyan-400 rounded-full blur-[1.5px] opacity-40" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping-slow opacity-20 animation-delay-1000" />
          </div>
          
          {/* Lignes de connexion animées - Data flow effect */}
          <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="cyan" stopOpacity="0" />
                <stop offset="50%" stopColor="cyan" stopOpacity="0.4" />
                <stop offset="100%" stopColor="cyan" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="15%" y1="20%" x2="45%" y2="45%" stroke="url(#line-gradient)" strokeWidth="1" className="animate-dash" />
            <line x1="80%" y1="30%" x2="55%" y2="60%" stroke="url(#line-gradient)" strokeWidth="1" className="animate-dash animation-delay-300" />
            <line x1="25%" y1="35%" x2="65%" y2="25%" stroke="url(#line-gradient)" strokeWidth="1" className="animate-dash animation-delay-600" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Badge - Style sobre et professionnel avec breathing animation */}
            <div className="inline-flex items-center gap-2 bg-slate-800/60 backdrop-blur-md border border-cyan-500/20 rounded-full px-6 py-2.5 mb-8 animate-fadeIn shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="text-sm font-semibold text-slate-100">🇸🇳 Plateforme IA #1 en Afrique</span>
              <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full ml-2 animate-pulse shadow-lg shadow-cyan-500/30">BETA</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.2] text-white animate-fadeInUp">
              Devenez un expert en
              <span className="block mt-3 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Intelligence Artificielle
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-100">
              Ressources éducatives, articles pratiques et communauté active : 
              tout ce dont vous avez besoin pour apprendre l'IA en français.
            </p>

            {/* CTA Buttons - Système de design premium */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp animation-delay-200">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="btn-primary text-lg px-10 py-6 group" asChild>
                    <Link href="/dashboard">
                      <Zap className="h-5 w-5 mr-2 btn-primary-icon" />
                      Mon Dashboard
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="btn-secondary-dark text-lg px-10 py-6 group" asChild>
                    <Link href="/resources">
                      <BookOpen className="h-5 w-5 mr-2 btn-primary-icon" />
                      Explorer les ressources
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="btn-tertiary-dark text-lg px-10 py-6 group" asChild>
                    <Link href="/articles">
                      <BookOpen className="h-5 w-5 mr-2 btn-primary-icon" />
                      Lire les articles
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="btn-primary btn-arrow-slide text-lg px-10 py-6 group" asChild>
                    <Link href="/auth/register">
                      <span className="relative z-10 flex items-center">
                        Commencer gratuitement
                        <ArrowRight className="h-5 w-5 ml-2 arrow" />
                      </span>
                      <div className="btn-overlay" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="btn-secondary-dark text-lg px-10 py-6 group" asChild>
                    <Link href="/resources">
                      <BookOpen className="h-5 w-5 mr-2 btn-primary-icon" />
                      Explorer les ressources
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="btn-tertiary-dark text-lg px-10 py-6 group" asChild>
                    <Link href="/articles">
                      <BookOpen className="h-5 w-5 mr-2 btn-primary-icon" />
                      Lire les articles
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-300 text-sm animate-fadeInUp animation-delay-300">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-slate-400" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-slate-400" />
                <span>En Français</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-slate-400" />
                <span>Communauté Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-slate-400" />
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
          SECTION 0: C'est quoi Palanteer ? (Simple et clair)
      ======================================== */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Message principal */}
          <div className="text-center mb-12 animate-fadeInUp">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5 mb-4">
              La Plateforme IA du Sénégal
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              <span className="text-cyan-600">Palanteer</span>, c'est quoi ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              La plateforme éducative qui réunit <strong>ressources IA</strong>, 
              <strong> articles pratiques</strong> et une <strong>communauté active</strong> 
              — pour tous les talents, du débutant à l'expert.
            </p>
          </div>

          {/* 3 Piliers - Focus Éducation */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 bg-white border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition-all group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-xl mb-6 group-hover:bg-cyan-100 transition-colors">
                <BookOpen className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Ressources</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cours, tutoriels et guides 100% en français pour apprendre l'IA à votre rythme
              </p>
            </Card>

            <Card className="text-center p-8 bg-white border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition-all group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-xl mb-6 group-hover:bg-cyan-100 transition-colors">
                <Code className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Articles</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Partagez vos connaissances et apprenez des expériences de la communauté
              </p>
            </Card>

            <Card className="text-center p-8 bg-white border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition-all group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-xl mb-6 group-hover:bg-cyan-100 transition-colors">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Communauté</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connectez avec des talents, mentors et professionnels de l'IA au Sénégal
              </p>
            </Card>
          </div>

          {/* One-liner mémorable - Simplifié */}
          <div className="mt-12 text-center">
            <p className="text-2xl md:text-3xl font-bold text-slate-900">
              Apprenez. Pratiquez. <span className="text-cyan-600">Excellez.</span>
            </p>
            <p className="text-slate-600 mt-4 text-lg">
              Votre tremplin vers une carrière en IA 🚀
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION: Comment ça marche
      ======================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Comment ça marche */}
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5 mb-4">
              Comment ça marche
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Commencez en <span className="text-cyan-600">3 étapes simples</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Accédez aux ressources, apprenez et partagez vos connaissances
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Ligne de connexion entre étapes (desktop) */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent" aria-hidden="true" />

            {/* Étape 1 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform relative z-10">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Inscrivez-vous</h3>
              <p className="text-slate-600">
                Créez votre compte gratuit et accédez à toutes les ressources.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform relative z-10">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Apprenez</h3>
              <p className="text-slate-600">
                Parcourez les ressources, suivez des cours et lisez des articles.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform relative z-10">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Partagez</h3>
              <p className="text-slate-600">
                Publiez vos articles et contribuez à la communauté.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button size="lg" className="btn-primary text-lg px-10 py-6 group" asChild>
              <Link href="/auth/register">
                Créer mon compte gratuit
                <ArrowRight className="h-5 w-5 ml-2 arrow" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      {/* ========================================
          SECTION: La Solution + Fonctionnalités (FUSIONNÉES)
      ======================================== */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden" id="features">
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
                  Pourquoi Palanteer ?
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Tout pour réussir en <span className="text-cyan-600">IA</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Une plateforme complète pensée pour les talents africains francophones
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Trophy className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Compétitions IA</h3>
                    <p className="text-slate-600 text-sm">Participez à des défis data science, soumettez vos modèles et gagnez des prix</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Ressources & Tutoriels</h3>
                    <p className="text-slate-600 text-sm">Tutoriels en français, guides pratiques et contenus pédagogiques de qualité</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Code className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Portfolio & Projets</h3>
                    <p className="text-slate-600 text-sm">Publiez vos projets IA et construisez votre portfolio professionnel</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Suivi & Progression</h3>
                    <p className="text-slate-600 text-sm">Classements en temps réel, badges et métriques de progression</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-100 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Communauté Active</h3>
                    <p className="text-slate-600 text-sm">Échangez avec des compétiteurs, mentors et professionnels de l'IA</p>
                  </div>
                </div>
              </div>

              {/* Mini testimonial inline */}
              <div className="bg-cyan-50/50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                <p className="text-sm text-slate-700 italic mb-2">
                  "Palanteer m'a permis de décrocher mon premier emploi en data science. Les compétitions sont top!"
                </p>
                <p className="text-xs text-slate-600 font-semibold">— Moussa N., Data Scientist</p>
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
                {/* Community stats - Structuration optimale: Cyan (ligne 1) + Slate + Bleu Nuit (ligne 2) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Ligne 1: Objectifs 2025-2027 (Cyan) */}
                  <Card className="bg-cyan-50 border-2 border-cyan-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Brain className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-cyan-600 mb-1">Obj. 2027</div>
                      <div className="text-sm text-slate-600">1000+ Talents</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-cyan-50 border-2 border-cyan-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-cyan-600 mb-1">Obj. 2026</div>
                      <div className="text-sm text-slate-600">200+ Ressources</div>
                    </CardContent>
                  </Card>
                  {/* Ligne 2: Articles (Slate) + Lancement (Bleu Nuit) */}
                  <Card className="bg-slate-50 border-2 border-slate-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Code className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-slate-700 mb-1">Obj. 2026</div>
                      <div className="text-sm text-slate-600">100+ Articles</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#2d5986]/10 border-2 border-[#2d5986]/20 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-10 w-10 text-[#2d5986] mx-auto mb-3" />
                      <div className="text-3xl font-bold text-[#2d5986] mb-1">2025</div>
                      <div className="text-sm text-slate-600">Lancement</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Badge */}
                <div className="mt-6 inline-flex items-center gap-3 bg-[#2d5986] text-white px-6 py-4 rounded-2xl shadow-lg">
                  <Sparkles className="h-6 w-6" />
                  <div>
                    <div className="font-bold">Lancement 2025</div>
                    <div className="text-sm opacity-90">Objectifs 2025-2027</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Texte à droite */}
            <div className="animate-slideInRight">
              <div className="inline-block mb-4">
                <Badge className="bg-cyan-100 text-cyan-700 border-0 text-sm px-4 py-1.5">
                  Notre Vision
                </Badge>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Nos objectifs pour <span className="text-cyan-600">2025-2027</span>
              </h2>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Notre vision pour un écosystème IA francophone au Sénégal
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { stat: 'Objectif 2027', label: '1000+ talents formés en IA', icon: TrendingUp },
                  { stat: 'Objectif 2026', label: '200+ ressources éducatives', icon: Star },
                  { stat: 'Objectif 2026', label: '100+ articles publiés', icon: Users }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-100 rounded-xl">
                      <item.icon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-cyan-600">{item.stat}</div>
                      <div className="text-slate-700 font-medium">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <blockquote className="border-l-4 border-cyan-500 pl-6 py-4 bg-cyan-50/50 rounded-r-xl">
                <p className="text-slate-700 italic mb-3">
                  "Notre vision : faire du Sénégal un hub de l'IA francophone en Afrique. 
                  Nous croyons en la capacité de nos talents à transformer le continent."
                </p>
                <footer className="text-cyan-600 font-semibold">
                  — Équipe Palanteer, Lancement 2025
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BANDE ORGANISATIONS
      ======================================== */}
      <section className="py-16 bg-gradient-to-r from-[#2d5986] to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" aria-hidden="true" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:text-left text-center flex-1">
              <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-1.5 mb-4">
                Pour les créateurs de contenu
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Vous êtes expert en IA ?
              </h2>
              <p className="text-xl text-white/90 mb-2">
                Partagez vos connaissances et aidez la communauté à progresser.
              </p>
              <p className="text-white/75">
                Créez des articles, proposez des ressources et contribuez à l'écosystème IA francophone.
              </p>
            </div>
            
            <div className="lg:flex-shrink-0">
              <Button size="lg" className="btn-inverse text-lg px-10 py-6 group" asChild>
                <Link href="/articles/create">
                  <Code className="h-5 w-5 mr-2 btn-primary-icon" />
                  Créer un article
                </Link>
              </Button>
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
              Prêt à propulser votre carrière en <span className="text-cyan-600">IA</span> ?
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Rejoignez des centaines de talents qui apprennent et partagent leurs connaissances 
              pour construire l'avenir de l'IA en Afrique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="btn-brand text-lg px-10 py-7 group" asChild>
                <Link href="/auth/register">
                  <Zap className="h-5 w-5 mr-2 btn-primary-icon" />
                  Commencer Gratuitement
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="btn-tertiary text-lg px-10 py-7 group" asChild>
                <Link href="/resources">
                  Explorer les ressources
                  <ArrowRight className="h-5 w-5 ml-2 arrow" />
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

            {/* Liens communauté */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-600 mb-6 text-sm">
                Rejoignez la communauté Palanteer et restez informé des dernières nouveautés
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="btn-secondary text-lg px-10 py-6 group" asChild>
                  <a href="https://discord.gg/palanteer" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-5 w-5 mr-2 btn-primary-icon" />
                    Rejoindre le Discord
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="btn-tertiary text-lg px-10 py-6 group" asChild>
                  <Link href="/newsletter">
                    <Mail className="h-5 w-5 mr-2 btn-primary-icon" />
                    S'abonner à la Newsletter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
