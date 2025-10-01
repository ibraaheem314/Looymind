'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, Video, FileText, Database, Wrench, 
  BookMarked, Filter, X 
} from 'lucide-react'

interface ResourceFiltersProps {
  selectedCategory?: string
  selectedDifficulty?: string
  selectedType?: string
  onCategoryChange: (category: string | undefined) => void
  onDifficultyChange: (difficulty: string | undefined) => void
  onTypeChange: (type: string | undefined) => void
  onClearFilters: () => void
}

const categories = [
  'Intelligence Artificielle',
  'Machine Learning',
  'Data Science',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing',
  'Cybersécurité',
  'Blockchain'
]

const difficulties = [
  { value: 'debutant', label: 'Débutant', color: 'bg-green-100 text-green-800' },
  { value: 'intermediaire', label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'avance', label: 'Avancé', color: 'bg-red-100 text-red-800' }
]

const resourceTypes = [
  { value: 'tutorial', label: 'Tutoriel', icon: BookOpen },
  { value: 'documentation', label: 'Documentation', icon: FileText },
  { value: 'video', label: 'Vidéo', icon: Video },
  { value: 'dataset', label: 'Dataset', icon: Database },
  { value: 'tool', label: 'Outil', icon: Wrench },
  { value: 'book', label: 'Livre', icon: BookMarked }
]

export function ResourceFilters({
  selectedCategory,
  selectedDifficulty,
  selectedType,
  onCategoryChange,
  onDifficultyChange,
  onTypeChange,
  onClearFilters
}: ResourceFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedDifficulty || selectedType

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Type de ressource */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Type de ressource
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {resourceTypes.map(type => {
            const Icon = type.icon
            const isSelected = selectedType === type.value
            return (
              <button
                key={type.value}
                onClick={() => onTypeChange(isSelected ? undefined : type.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? 'text-slate-800' : 'text-gray-500'}`} />
                <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                  {type.label}
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Niveau de difficulté */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Niveau de difficulté
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {difficulties.map(difficulty => {
            const isSelected = selectedDifficulty === difficulty.value
            return (
              <button
                key={difficulty.value}
                onClick={() => onDifficultyChange(isSelected ? undefined : difficulty.value)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                  {difficulty.label}
                </span>
                <Badge className={`${difficulty.color} border-0`}>
                  {difficulty.value === 'debutant' ? '⭐' : difficulty.value === 'intermediaire' ? '⭐⭐' : '⭐⭐⭐'}
                </Badge>
              </button>
            )
          })}
        </CardContent>
      </Card>

      {/* Catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            Catégories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isSelected = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(isSelected ? undefined : category)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'border-gray-300 hover:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
