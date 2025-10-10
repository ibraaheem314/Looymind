'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Upload, Download, Trash2, FileText, Database,
  ArrowLeft, AlertCircle, Check, Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Dataset {
  id: string
  competition_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  description: string | null
  columns_info: any
  row_count: number | null
  is_public: boolean
  download_count: number
  created_at: string
}

export default function AdminDatasetsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [error, setError] = useState('')
  
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    file_type: 'train',
    description: '',
    is_public: true
  })

  const supabase = createClient()

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchDatasets()
    }
  }, [profile, id])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('competition_datasets')
        .select('*')
        .eq('competition_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDatasets(data || [])
    } catch (err: any) {
      console.error('Error fetching datasets:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    try {
      setUploading(true)
      setError('')

      console.log('🚀 DÉBUT UPLOAD DATASET')
      console.log('Competition ID:', id)
      console.log('File:', uploadForm.file.name, uploadForm.file.size, 'bytes')
      console.log('File type:', uploadForm.file_type)

      // 1. Upload file to Supabase Storage
      const fileName = `${id}/${uploadForm.file_type}_${Date.now()}_${uploadForm.file.name}`
      console.log('📁 Upload vers:', fileName)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('competition-datasets')
        .upload(fileName, uploadForm.file)

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw uploadError
      }

      console.log('✅ Upload réussi:', uploadData)

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from('competition-datasets')
        .getPublicUrl(fileName)

      console.log('🔗 URL publique:', urlData.publicUrl)

      // 3. Insert dataset metadata
      const datasetPayload = {
        competition_id: id,
        file_name: uploadForm.file.name,
        file_type: uploadForm.file_type,
        file_size: uploadForm.file.size,
        file_url: urlData.publicUrl,
        description: uploadForm.description || null,
        is_public: uploadForm.is_public,
        uploaded_by: user?.id
      }

      console.log('💾 Insertion en DB:', datasetPayload)

      const { error: insertError } = await supabase
        .from('competition_datasets')
        .insert([datasetPayload])

      if (insertError) {
        console.error('❌ DB insert error:', insertError)
        throw insertError
      }

      console.log('✅ Dataset créé avec succès !')

      // Success
      setShowUploadDialog(false)
      setUploadForm({
        file: null,
        file_type: 'train',
        description: '',
        is_public: true
      })
      fetchDatasets()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (datasetId: string, fileUrl: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce dataset ?')) return

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/competition-datasets/')
      const filePath = urlParts[1]

      // Delete from storage
      await supabase.storage
        .from('competition-datasets')
        .remove([filePath])

      // Delete from database
      const { error } = await supabase
        .from('competition_datasets')
        .delete()
        .eq('id', datasetId)

      if (error) throw error

      fetchDatasets()
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      train: '🎯 Données d\'entraînement',
      test: '🧪 Données de test',
      sample_submission: '📝 Exemple de soumission',
      solution: '✅ Solution (privé)',
      other: '📁 Autre'
    }
    return labels[type] || type
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès Refusé</h2>
            <p className="text-gray-600 mb-4">Vous devez être administrateur.</p>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/moderation">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Database className="h-8 w-8 text-cyan-600" />
                Gestion des Datasets
              </h1>
              <p className="text-slate-600 mt-2">
                Uploadez les fichiers de données pour cette compétition
              </p>
            </div>
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Uploader un fichier
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
          </div>
        ) : datasets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Aucun dataset
              </h3>
              <p className="text-slate-600 mb-6">
                Commencez par uploader les fichiers train.csv et test.csv
              </p>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader un fichier
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-cyan-600" />
                      <span className="truncate">{dataset.file_name}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge className="bg-cyan-100 text-cyan-700 border-0">
                        {getFileTypeLabel(dataset.file_type)}
                      </Badge>
                    </div>

                    <div className="text-sm text-slate-600">
                      <p><strong>Taille:</strong> {formatFileSize(dataset.file_size)}</p>
                      {dataset.row_count && (
                        <p><strong>Lignes:</strong> {dataset.row_count.toLocaleString()}</p>
                      )}
                      <p><strong>Téléchargements:</strong> {dataset.download_count}</p>
                    </div>

                    {dataset.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {dataset.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={dataset.file_url} download>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(dataset.id, dataset.file_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Uploader un dataset</DialogTitle>
            <DialogDescription>
              Ajoutez les fichiers de données pour cette compétition
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de fichier *
              </label>
              <Select 
                value={uploadForm.file_type} 
                onValueChange={(value) => setUploadForm({...uploadForm, file_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="train">🎯 Données d'entraînement</SelectItem>
                  <SelectItem value="test">🧪 Données de test</SelectItem>
                  <SelectItem value="sample_submission">📝 Exemple de soumission</SelectItem>
                  <SelectItem value="solution">✅ Solution (privé)</SelectItem>
                  <SelectItem value="other">📁 Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fichier CSV *
              </label>
              <Input
                type="file"
                accept=".csv,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setUploadForm({...uploadForm, file})
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (optionnel)
              </label>
              <Textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Décrivez le contenu du fichier..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_public"
                checked={uploadForm.is_public}
                onChange={(e) => setUploadForm({...uploadForm, is_public: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="is_public" className="text-sm text-slate-700">
                Fichier public (visible sans inscription)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.file}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


