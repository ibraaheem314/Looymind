'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Upload, Save, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'
import { v4 as uuidv4 } from 'uuid'

interface ProjectFormProps {
  project?: any; // Project type
  onSave?: (project: any) => void;
  onCancel?: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const { user } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    category: project?.category || '',
    tags: project?.tags || [] as string[],
    github_url: project?.github_url || '',
    demo_url: project?.demo_url || '',
    image_file: null as File | null,
    image_url: project?.image_url || '',
    featured: project?.featured || false,
    status: project?.status || 'draft' as 'draft' | 'published' | 'archived',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const categories = [
    'IA & Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Blockchain',
    'IoT',
    'Gaming',
    'Autre'
  ]

  const commonTags = [
    'Python', 'JavaScript', 'React', 'Node.js', 'TensorFlow', 'PyTorch',
    'Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Docker', 'AWS',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'Data Analysis', 'Web Scraping', 'API', 'Frontend', 'Backend'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[]
      if (currentArray.includes(value)) {
        return { ...prev, [name]: currentArray.filter(item => item !== value) }
      } else {
        return { ...prev, [name]: [...currentArray, value] }
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image_file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!user) {
      setError('Vous devez être connecté pour créer un projet.')
      setLoading(false)
      return
    }

    let finalImageUrl = formData.image_url

    // Upload image if a file is selected
    if (formData.image_file) {
      const file = formData.image_file
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `public/projects/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('looymind-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        setError('Erreur lors de l\'upload de l\'image: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('looymind-assets')
        .getPublicUrl(filePath)
      
      finalImageUrl = publicUrlData.publicUrl
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        github_url: formData.github_url,
        demo_url: formData.demo_url,
        image_url: finalImageUrl,
        status: formData.status,
        featured: formData.featured,
        author_id: user.id,
        author_name: user.user_metadata?.display_name || user.email,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      }

      let result
      if (project) {
        // Update existing project
        const { data, error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
          .select()
          .single()

        if (updateError) {
          setError('Erreur lors de la mise à jour: ' + updateError.message)
          return
        }
        result = data
      } else {
        // Create new project
        const { data, error: insertError } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (insertError) {
          setError('Erreur lors de la création: ' + insertError.message)
          return
        }
        result = data
      }

      setSuccess(true)
      if (onSave) onSave(result)
    } catch (err) {
      setError('Une erreur inattendue est survenue.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Modifier le projet' : 'Créer un nouveau projet'}</CardTitle>
        <CardDescription>
          Partagez votre projet avec la communauté Looymind
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
              <AlertCircle className="h-5 w-5" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
              <CheckCircle className="h-5 w-5" />
              <span className="block sm:inline">Projet {project ? 'mis à jour' : 'créé'} avec succès !</span>
            </div>
          )}

          <div>
            <Label htmlFor="title">Titre du projet</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nom de votre projet"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description courte du projet"
              rows={3}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="content">Contenu détaillé</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Détails techniques, technologies utilisées, défis rencontrés..."
              rows={8}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => handleSelectChange('status', value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Technologies utilisées</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonTags.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                  className={`cursor-pointer ${formData.tags.includes(tag) ? 'bg-slate-800 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleMultiSelectChange('tags', tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Ajouter une technologie et appuyez sur Entrée"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                  e.preventDefault()
                  handleMultiSelectChange('tags', e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url">GitHub (URL)</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="demo_url">Démo (URL)</Label>
              <Input
                id="demo_url"
                name="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={handleChange}
                placeholder="https://demo.example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_file">Image du projet</Label>
            <Input
              id="image_file"
              name="image_file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {formData.image_file && (
              <p className="text-sm text-gray-500 mt-2">Fichier sélectionné : {formData.image_file.name}</p>
            )}
            {formData.image_url && !formData.image_file && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Image actuelle :</p>
                <img src={formData.image_url} alt="Aperçu de l'image" className="max-w-xs h-auto rounded-md" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleSelectChange('featured', e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-slate-800 border-gray-300 rounded focus:ring-slate-500"
            />
            <Label htmlFor="featured">Mettre en avant (Projet vedette)</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  {project ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {project ? 'Mettre à jour' : 'Créer le projet'}
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
