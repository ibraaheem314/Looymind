'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, TrendingUp, Heart, MessageCircle, FileText, Code, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TopContributor {
  id: string
  display_name: string
  avatar_url: string | null
  email: string
  role: string
  contributions: {
    competitions_rank: number
    competitions_score: number
    articles_count: number
    projects_count: number
    likes_given: number
    comments_count: number
  }
}

export default function TalentsPage() {
  const [topByCompetitions, setTopByCompetitions] = useState<TopContributor[]>([])
  const [topByContent, setTopByContent] = useState<TopContributor[]>([])
  const [topByEngagement, setTopByEngagement] = useState<TopContributor[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'competitions' | 'content' | 'engagement'>('competitions')

  const supabase = createClient()

  useEffect(() => {
    fetchTopContributors()
  }, [])

  const fetchTopContributors = async () => {
    setLoading(true)
    try {
      console.log('🏆 Récupération des Top Contributors...')
      
      // Top 10 par score de compétitions
      console.log('📊 Récupération des scores de compétitions...')
      const { data: competitionsData } = await supabase
        .from('leaderboard')
        .select(`
          score,
          user_id,
          profiles (
            id,
            display_name,
            avatar_url,
            email,
            role
          )
        `)
        .order('score', { ascending: false })
        .limit(10)

      console.log('✅ Scores de compétitions récupérés:', competitionsData?.length || 0)

      // Top 10 par contenu créé (articles + projets)
      console.log('📝 Récupération des profils...')
      const { data: profilesData } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          avatar_url,
          email,
          role
        `)
        .limit(50)

      console.log('✅ Profils récupérés:', profilesData?.length || 0)

      if (profilesData) {
        // Compter les articles et projets pour chaque profil
        const contentCounts = await Promise.all(
          profilesData.map(async (profile) => {
            const { count: articlesCount } = await supabase
              .from('articles')
              .select('id', { count: 'exact', head: true })
              .eq('author_id', profile.id)
              .eq('status', 'published')

            const { count: projectsCount } = await supabase
              .from('projects')
              .select('id', { count: 'exact', head: true })
              .eq('author_id', profile.id)

            return {
              ...profile,
              contributions: {
                competitions_rank: 0,
                competitions_score: 0,
                articles_count: articlesCount || 0,
                projects_count: projectsCount || 0,
                likes_given: 0,
                comments_count: 0
              }
            }
          })
        )

        // Trier par contenu total (articles + projets)
        const sortedByContent = contentCounts
          .sort((a, b) => 
            (b.contributions.articles_count + b.contributions.projects_count) - 
            (a.contributions.articles_count + a.contributions.projects_count)
          )
          .slice(0, 10)

        setTopByContent(sortedByContent)
        console.log('✅ Top par contenu calculé:', sortedByContent.length)

        // Top 10 par engagement (likes + comments)
        console.log('💝 Calcul de l\'engagement...')
        const engagementCounts = await Promise.all(
          profilesData.map(async (profile) => {
            const { count: likesCount } = await supabase
              .from('likes')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.id)

            const { count: commentsCount } = await supabase
              .from('comments')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', profile.id)

            return {
              ...profile,
              contributions: {
                competitions_rank: 0,
                competitions_score: 0,
                articles_count: 0,
                projects_count: 0,
                likes_given: likesCount || 0,
                comments_count: commentsCount || 0
              }
            }
          })
        )

        const sortedByEngagement = engagementCounts
          .sort((a, b) => 
            (b.contributions.likes_given + b.contributions.comments_count) - 
            (a.contributions.likes_given + a.contributions.comments_count)
          )
          .slice(0, 10)

        setTopByEngagement(sortedByEngagement)
        console.log('✅ Top par engagement calculé:', sortedByEngagement.length)
      }

      // Formater les données des compétitions
      console.log('🏆 Formatage des données de compétitions...')
      if (competitionsData) {
        const formattedCompetitions = competitionsData
          .filter(item => item.profiles)
          .map((item, index) => ({
            id: item.profiles.id,
            display_name: item.profiles.display_name,
            avatar_url: item.profiles.avatar_url,
            email: item.profiles.email,
            role: item.profiles.role,
            contributions: {
              competitions_rank: index + 1,
              competitions_score: item.score || 0,
              articles_count: 0,
              projects_count: 0,
              likes_given: 0,
              comments_count: 0
            }
          }))

        setTopByCompetitions(formattedCompetitions)
        console.log('✅ Top par compétitions formaté:', formattedCompetitions.length)
      }
      
      console.log('🎉 Tous les Top Contributors récupérés avec succès !')
    } catch (err) {
      console.error('❌ Error fetching top contributors:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 font-bold'
    if (rank === 2) return 'text-gray-400 font-bold'
    if (rank === 3) return 'text-orange-600 font-bold'
    return 'text-slate-600'
  }

  const currentData = 
    activeTab === 'competitions' ? topByCompetitions :
    activeTab === 'content' ? topByContent :
    topByEngagement

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/20 to-yellow-50/20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="text-center">
            <Badge className="bg-orange-100 text-orange-700 border-0 text-sm px-4 py-1.5 mb-4">
              🏆 Hall of Fame
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Top 10 des Contributeurs
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed max-w-2xl mx-auto">
              Découvrez les membres les plus actifs de la communauté Palanteer
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={activeTab === 'competitions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('competitions')}
            className={activeTab === 'competitions' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Par Compétitions
          </Button>
          <Button
            variant={activeTab === 'content' ? 'default' : 'outline'}
            onClick={() => setActiveTab('content')}
            className={activeTab === 'content' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <FileText className="h-4 w-4 mr-2" />
            Par Contenu
          </Button>
          <Button
            variant={activeTab === 'engagement' ? 'default' : 'outline'}
            onClick={() => setActiveTab('engagement')}
            className={activeTab === 'engagement' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Heart className="h-4 w-4 mr-2" />
            Par Engagement
          </Button>
        </div>

        {/* Top 10 List */}
        {currentData.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-gray-200" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Aucune donnée disponible</h3>
              <p className="text-slate-500">
                Les contributeurs apparaîtront ici dès qu'ils commenceront à participer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {currentData.map((contributor, index) => (
              <Card key={contributor.id} className="hover:shadow-lg transition-all border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`text-3xl font-bold ${getRankColor(index + 1)} min-w-[60px] text-center`}>
                      {getRankMedal(index + 1)}
                    </div>

                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                      {contributor.avatar_url ? (
                        <img src={contributor.avatar_url} alt={contributor.display_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        contributor.display_name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{contributor.display_name}</h3>
                        {contributor.role === 'admin' && (
                          <Badge className="bg-red-100 text-red-700">Admin</Badge>
                        )}
                        {contributor.role === 'mentor' && (
                          <Badge className="bg-purple-100 text-purple-700">Mentor</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{contributor.email}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6">
                      {activeTab === 'competitions' && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-600">
                            {contributor.contributions.competitions_score.toFixed(4)}
                          </div>
                          <div className="text-xs text-slate-500">Score</div>
                        </div>
                      )}
                      {activeTab === 'content' && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {contributor.contributions.articles_count}
                            </div>
                            <div className="text-xs text-slate-500">Articles</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {contributor.contributions.projects_count}
                            </div>
                            <div className="text-xs text-slate-500">Projets</div>
                          </div>
                        </>
                      )}
                      {activeTab === 'engagement' && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {contributor.contributions.likes_given}
                            </div>
                            <div className="text-xs text-slate-500">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {contributor.contributions.comments_count}
                            </div>
                            <div className="text-xs text-slate-500">Commentaires</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
