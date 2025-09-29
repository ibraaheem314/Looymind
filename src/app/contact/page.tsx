'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle,
  Github, Twitter, Linkedin, MessageCircle
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSuccess(true)
    setLoading(false)
    setFormData({ name: '', email: '', subject: '', message: '', type: 'general' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une question ? Une suggestion ? Nous sommes là pour vous aider !
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Informations de contact
                </CardTitle>
                <CardDescription>
                  Plusieurs façons de nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">contact@looymind.sn</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+221 33 XXX XX XX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">Dakar, Sénégal</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-gray-600">Lun - Ven: 9h - 18h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Suivez-nous</CardTitle>
                <CardDescription>
                  Restez connecté avec notre communauté
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="bg-gray-100 p-3 rounded-lg text-gray-600 hover:text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-gray-100 p-3 rounded-lg text-gray-600 hover:text-white hover:bg-blue-500 transition-all duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-gray-100 p-3 rounded-lg text-gray-600 hover:text-white hover:bg-blue-600 transition-all duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Liens rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="/help" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Centre d'aide
                </a>
                <a href="/about" className="block text-blue-600 hover:text-blue-800 text-sm">
                  À propos de nous
                </a>
                <a href="/privacy" className="block text-blue-600 hover:text-blue-800 text-sm">
                  Politique de confidentialité
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type">Type de demande</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="general">Question générale</option>
                      <option value="technical">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="media">Presse & Médias</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>
                  Trouvez rapidement des réponses aux questions les plus courantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Comment rejoindre la communauté ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Créez un compte gratuitement et commencez à participer aux défis et projets.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Les défis sont-ils gratuits ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Oui, la plupart de nos défis sont gratuits. Certains défis premium peuvent avoir des frais d'inscription.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Comment devenir mentor ?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Contactez-nous avec votre CV et votre expérience en IA pour devenir mentor.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/help">Voir toutes les FAQ</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
