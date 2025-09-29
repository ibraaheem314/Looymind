'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Clock, Target, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'debutant' | 'intermediaire' | 'avance'
  status: 'en_cours' | 'termine' | 'bientot'
  prize_xof: number
  participants: number
  deadline: string
  created_at: string
  updated_at: string
}

interface ChallengeCardProps {
  challenge: Challenge
}

const difficultyLabels = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé'
}

const difficultyColors = {
  debutant: 'bg-green-100 text-green-800',
  intermediaire: 'bg-yellow-100 text-yellow-800',
  avance: 'bg-red-100 text-red-800'
}

const statusLabels = {
  en_cours: 'En cours',
  termine: 'Terminé',
  bientot: 'Bientôt'
}

const statusColors = {
  en_cours: 'bg-blue-100 text-blue-800',
  termine: 'bg-gray-100 text-gray-800',
  bientot: 'bg-orange-100 text-orange-800'
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining(challenge.deadline)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className={statusColors[challenge.status]}>
            {statusLabels[challenge.status]}
          </Badge>
          <Badge className={difficultyColors[challenge.difficulty]}>
            {difficultyLabels[challenge.difficulty]}
          </Badge>
        </div>
        
        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-slate-600 transition-colors line-clamp-2">
          {challenge.title}
        </CardTitle>
        
        <CardDescription className="text-gray-600 leading-relaxed line-clamp-3">
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <Trophy className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(challenge.prize_xof)}
            </div>
            <div className="text-xs text-gray-600">Prix</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {challenge.participants}
            </div>
            <div className="text-xs text-gray-600">Participants</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">
              {daysRemaining > 0 ? `${daysRemaining}j` : 'Expiré'}
            </div>
            <div className="text-xs text-gray-600">Restant</div>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Clôture : {format(new Date(challenge.deadline), 'dd MMM yyyy', { locale: fr })}</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            daysRemaining > 7 
              ? 'bg-green-100 text-green-800' 
              : daysRemaining > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Expiré'}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-slate-800 hover:bg-slate-700 text-white group" 
          asChild
        >
          <Link href={`/challenges/${challenge.id}`}>
            <Target className="mr-2 h-4 w-4" />
            {challenge.status === 'bientot' ? 'S\'inscrire' : 'Participer'}
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}