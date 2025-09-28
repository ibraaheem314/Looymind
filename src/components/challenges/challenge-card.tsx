import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Trophy } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, getDaysRemaining } from '@/lib/utils'

interface Challenge {
  id: string
  title: string
  description: string
  prize_amount: number
  end_date: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  participants: number
  image_url: string
}

interface ChallengeCardProps {
  challenge: Challenge
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
}

const difficultyLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé'
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const daysRemaining = getDaysRemaining(challenge.end_date)
  
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border-gray-200 overflow-hidden">
      {/* Challenge Image */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={challenge.image_url}
          alt={challenge.title}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-700 border-gray-200">
            {challenge.category}
          </Badge>
        </div>
        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={difficultyColors[challenge.difficulty]}>
            {difficultyLabels[challenge.difficulty]}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
          {challenge.title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {challenge.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Prize Amount */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Prix</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(challenge.prize_amount)} XOF
          </span>
        </div>

        {/* Challenge Stats */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{challenge.participants} participants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{daysRemaining} jours restants</span>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full bg-slate-800 hover:bg-slate-700" asChild>
          <Link href={`/challenges/${challenge.id}`}>
            Participer au défi
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}