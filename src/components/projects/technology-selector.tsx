'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, X, Search, Code, Database, Monitor, Smartphone, 
  Brain, FlaskConical, GitBranch, Settings, Filter
} from 'lucide-react'

interface Technology {
  technology: string
  category: string
  proficiency_level: string
}

interface TechnologySelectorProps {
  technologies: Technology[]
  onTechnologiesChange: (technologies: Technology[]) => void
  maxTechnologies?: number
  showCategories?: boolean
  showProficiency?: boolean
}

const TECHNOLOGY_CATEGORIES = [
  { value: 'frontend', label: 'Frontend', icon: Monitor, color: 'bg-blue-100 text-blue-800' },
  { value: 'backend', label: 'Backend', icon: Code, color: 'bg-green-100 text-green-800' },
  { value: 'database', label: 'Base de données', icon: Database, color: 'bg-purple-100 text-purple-800' },
  { value: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-orange-100 text-orange-800' },
  { value: 'ai', label: 'IA/ML', icon: Brain, color: 'bg-pink-100 text-pink-800' },
  { value: 'research', label: 'Recherche', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-800' },
  { value: 'tool', label: 'Outils', icon: Settings, color: 'bg-gray-100 text-gray-800' },
  { value: 'framework', label: 'Framework', icon: GitBranch, color: 'bg-cyan-100 text-cyan-800' },
  { value: 'library', label: 'Bibliothèque', icon: Code, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'language', label: 'Langage', icon: Code, color: 'bg-red-100 text-red-800' },
  { value: 'platform', label: 'Plateforme', icon: Monitor, color: 'bg-teal-100 text-teal-800' }
]

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Débutant', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Avancé', color: 'bg-orange-100 text-orange-800' },
  { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' }
]

const POPULAR_TECHNOLOGIES = [
  // Frontend
  'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Tailwind CSS', 'Bootstrap', 'Sass',
  // Backend
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Supabase', 'Firebase',
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // AI/ML
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenCV', 'Hugging Face', 'LangChain',
  // Cloud
  'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean', 'Docker', 'Kubernetes',
  // Mobile
  'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Swift', 'Kotlin', 'Cordova',
  // Tools
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Figma', 'Sketch', 'Adobe XD'
]

export default function TechnologySelector({
  technologies,
  onTechnologiesChange,
  maxTechnologies = 20,
  showCategories = true,
  showProficiency = true
}: TechnologySelectorProps) {
  const [newTechnology, setNewTechnology] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const filteredSuggestions = POPULAR_TECHNOLOGIES.filter(tech =>
    tech.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !technologies.some(t => t.technology.toLowerCase() === tech.toLowerCase())
  ).slice(0, 10)

  const addTechnology = (techName: string) => {
    if (technologies.length >= maxTechnologies) {
      alert(`Maximum ${maxTechnologies} technologies autorisées`)
      return
    }

    if (!techName.trim() || technologies.some(t => t.technology.toLowerCase() === techName.toLowerCase())) {
      return
    }

    const newTech: Technology = {
      technology: techName.trim(),
      category: 'tool',
      proficiency_level: 'intermediate'
    }

    onTechnologiesChange([...technologies, newTech])
    setNewTechnology('')
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const removeTechnology = (index: number) => {
    onTechnologiesChange(technologies.filter((_, i) => i !== index))
  }

  const updateTechnology = (index: number, field: keyof Technology, value: string) => {
    const updated = technologies.map((tech, i) => 
      i === index ? { ...tech, [field]: value } : tech
    )
    onTechnologiesChange(updated)
  }

  const getCategoryConfig = (category: string) => {
    return TECHNOLOGY_CATEGORIES.find(c => c.value === category) || TECHNOLOGY_CATEGORIES[0]
  }

  const getProficiencyConfig = (level: string) => {
    return PROFICIENCY_LEVELS.find(p => p.value === level) || PROFICIENCY_LEVELS[0]
  }

  const filteredTechnologies = technologies.filter(tech => {
    if (selectedCategory === 'all') return true
    return tech.category === selectedCategory
  })

  return (
    <div className="space-y-4">
      {/* Ajout de nouvelle technologie */}
      <div className="space-y-3">
        <Label>Ajouter une technologie</Label>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={newTechnology}
                onChange={(e) => {
                  setNewTechnology(e.target.value)
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Rechercher une technologie..."
                className="pl-10"
              />
              
              {/* Suggestions */}
              {showSuggestions && (newTechnology || searchQuery) && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((tech, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addTechnology(tech)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Code className="h-4 w-4 text-gray-500" />
                        {tech}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      Aucune suggestion trouvée
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Button
              type="button"
              onClick={() => addTechnology(newTechnology)}
              disabled={!newTechnology.trim() || technologies.length >= maxTechnologies}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      {showCategories && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Toutes ({technologies.length})
          </Button>
          {TECHNOLOGY_CATEGORIES.map(category => {
            const count = technologies.filter(t => t.category === category.value).length
            if (count === 0) return null
            
            const config = getCategoryConfig(category.value)
            const Icon = config.icon
            
            return (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {category.label} ({count})
              </Button>
            )
          })}
        </div>
      )}

      {/* Liste des technologies */}
      {filteredTechnologies.length > 0 ? (
        <div className="space-y-3">
          {filteredTechnologies.map((tech, index) => {
            const categoryConfig = getCategoryConfig(tech.category)
            const proficiencyConfig = getProficiencyConfig(tech.proficiency_level)
            const CategoryIcon = categoryConfig.icon

            return (
              <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <CategoryIcon className="h-5 w-5 text-gray-500" />
                
                <div className="flex-1">
                  <div className="font-medium">{tech.technology}</div>
                  {showCategories && (
                    <Badge className={`${categoryConfig.color} border-0 text-xs`}>
                      {categoryConfig.label}
                    </Badge>
                  )}
                </div>

                {showProficiency && (
                  <div className="flex items-center gap-2">
                    <select
                      value={tech.proficiency_level}
                      onChange={(e) => updateTechnology(index, 'proficiency_level', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {PROFICIENCY_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {showCategories && (
                  <div className="flex items-center gap-2">
                    <select
                      value={tech.category}
                      onChange={(e) => updateTechnology(index, 'category', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {TECHNOLOGY_CATEGORIES.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTechnology(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">Aucune technologie</p>
          <p className="text-sm">Ajoutez des technologies utilisées dans votre projet</p>
        </div>
      )}

      {/* Limite */}
      {technologies.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {technologies.length} / {maxTechnologies} technologies
        </div>
      )}
    </div>
  )
}
