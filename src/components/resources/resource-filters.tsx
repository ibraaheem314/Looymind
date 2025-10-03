'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, Video, FileText, Wrench, Globe, GraduationCap, Code,
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

// Catégories correspondant au schéma DB
const categories = [
  { value: 'ia', label: 'Intelligence Artificielle' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'deep-learning', label: 'Deep Learning' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'nlp', label: 'NLP' },
  { value: 'computer-vision', label: 'Computer Vision' },
  { value: 'big-data', label: 'Big Data' },
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'dev', label: 'Développement' },
  { value: 'mathematics', label: 'Mathématiques' },
  { value: 'statistics', label: 'Statistiques' },
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'other', label: 'Autre' }
]

// Difficultés correspondant au schéma DB
const difficulties = [
  { value: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800', stars: '⭐' },
  { value: 'intermediate', label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800', stars: '⭐⭐' },
  { value: 'advanced', label: 'Avancé', color: 'bg-orange-100 text-orange-800', stars: '⭐⭐⭐' },
  { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800', stars: '⭐⭐⭐⭐' }
]

// Types correspondant au schéma DB
const resourceTypes = [
  { value: 'external_course', label: 'Cours externe', icon: Globe },
  { value: 'local_course', label: 'Cours local', icon: GraduationCap },
  { value: 'tutorial', label: 'Tutoriel', icon: Code },
  { value: 'documentation', label: 'Documentation', icon: FileText },
  { value: 'video', label: 'Vidéo', icon: Video },
  { value: 'tool', label: 'Outil', icon: Wrench },
  { value: 'article', label: 'Article', icon: BookMarked }
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
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                <span className={`text-sm ${isSelected ? 'font-semibold text-green-900' : 'text-slate-700'}`}>
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
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`text-sm ${isSelected ? 'font-semibold text-green-900' : 'text-slate-700'}`}>
                  {difficulty.label}
                </span>
                <span className="text-base">
                  {difficulty.stars}
                </span>
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
              const isSelected = selectedCategory === category.value
              return (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(isSelected ? undefined : category.value)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-green-500 text-white border-green-500 shadow-sm'
                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50 text-slate-700'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
