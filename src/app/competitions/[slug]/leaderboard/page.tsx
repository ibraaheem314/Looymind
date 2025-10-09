'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Leaderboard from '@/components/competitions/leaderboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Competition {
  id: string
  title: string
  slug: string
  status: string
}

export default function LeaderboardPage() {
  const { slug } = useParams()
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase
          .from('competitions')
          .select('id, title, slug, status')
          .eq('slug', slug)
          .single()

        if (error) throw error

        setCompetition(data)
      } catch (err: any) {
        console.error('Error fetching competition:', err)
        setError('Compétition introuvable')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCompetition()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Compétition introuvable'}</p>
          <Link href="/competitions">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux compétitions
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/competitions/${competition.slug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la compétition
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {competition.title}
          </h1>
          <p className="text-slate-600">Classement en temps réel</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Leaderboard competitionId={competition.id} />
      </div>
    </div>
  )
}
