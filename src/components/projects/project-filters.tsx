'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Filter, Grid, List, X, 
  Monitor, Smartphone, Brain, Database, FlaskConical, Code,
  TrendingUp, Heart, Eye, Calendar, Star
} from 'lucide-react'

interface ProjectFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  filterFeatured: boolean
  onFeaturedChange: (featured: boolean) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  totalResults: number
}

const PROJECT_TYPES = [
  { value: 'all', label: 'Tous', icon: Code, color: 'bg-gray-100 text-gray-800' },
  { value: 'web', label: 'Web', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { value: 'ai', label: 'IA', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'data', label: 'Data', icon: Database, color: 'bg-orange-100 text-orange-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récents', icon: Calendar },
  { value: 'popular', label: 'Plus populaires', icon: Heart },
  { value: 'trending', label: 'Tendance', icon: TrendingUp },
  { value: 'views', label: 'Plus vus', icon: Eye },
  { value: 'featured', label: 'Featured', icon: Star }
]

const POPULAR_TAGS = [
  'Innovation', 'Open Source', 'Startup', 'Éducation', 'Santé', 'Finance', 
  'E-commerce', 'Social', 'Gaming', 'IoT', 'Blockchain', 'Cybersecurity',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Data Science'
]

export default function ProjectFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  filterFeatured,
  onFeaturedChange,
  viewMode,
  onViewModeChange,
  selectedTags,
  onTagsChange,
  totalResults
}: ProjectFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag))
  }

  const clearAllFilters = () => {
    onSearchChange('')
    onTypeChange('all')
    onSortChange('recent')
    onFeaturedChange(false)
    onTagsChange([])
  }

  const hasActiveFilters = searchQuery || selectedType !== 'all' || sortBy !== 'recent' || filterFeatured || selectedTags.length > 0

  return (
    <div className="space-y-4">
      {/* Recherche et actions principales */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des projets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2">
          {/* Type de projet */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              {PROJECT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <Button
            variant={filterFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => onFeaturedChange(!filterFeatured)}
          >
            <Star className="h-4 w-4 mr-1" />
            Featured
          </Button>

          {/* Mode d'affichage */}
          <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filtres avancés */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Tags sélectionnés */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Tags:</span>
          {selectedTags.map(tag => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTagsChange([])}
            className="text-gray-500"
          >
            Effacer
          </Button>
        </div>
      )}

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filtres avancés</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tags populaires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags populaires
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {totalResults} projet{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Effacer tout
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(false)}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Résumé des filtres actifs */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Filtres actifs:</span>
          {searchQuery && (
            <Badge variant="outline">Recherche: "{searchQuery}"</Badge>
          )}
          {selectedType !== 'all' && (
            <Badge variant="outline">
              Type: {PROJECT_TYPES.find(t => t.value === selectedType)?.label}
            </Badge>
          )}
          {sortBy !== 'recent' && (
            <Badge variant="outline">
              Tri: {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
            </Badge>
          )}
          {filterFeatured && (
            <Badge variant="outline">Featured</Badge>
          )}
          {selectedTags.length > 0 && (
            <Badge variant="outline">{selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}</Badge>
          )}
        </div>
      )}
    </div>
  )
}
