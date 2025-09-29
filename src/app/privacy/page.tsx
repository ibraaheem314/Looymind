import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, Lock, Eye, Database, UserCheck, AlertTriangle,
  CheckCircle, XCircle, Info
} from 'lucide-react'

export default function PrivacyPage() {
  const lastUpdated = "15 Décembre 2024"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comment nous collectons, utilisons et protégeons vos données personnelles
            </p>
            <div className="mt-4">
              <Badge variant="outline" className="text-sm">
                Dernière mise à jour : {lastUpdated}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chez Looymind, nous nous engageons à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et 
              protégeons vos informations lorsque vous utilisez notre plateforme.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En utilisant Looymind, vous acceptez les pratiques décrites dans cette politique. 
              Si vous n'acceptez pas ces termes, veuillez ne pas utiliser notre service.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6 text-green-600" />
              Données que nous collectons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  Informations personnelles
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Nom, prénom et nom d'affichage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Adresse email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Informations de profil (rôle, expérience, compétences)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Informations de contact (optionnelles)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Données d'utilisation
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Pages visitées et temps passé sur la plateforme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Interactions avec les défis et projets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Données de navigation et préférences</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How we use data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-orange-600" />
              Comment nous utilisons vos données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">Utilisations légitimes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Fournir et améliorer nos services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Personnaliser votre expérience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Communiquer avec vous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Analyser l'utilisation de la plateforme</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-700">Ce que nous ne faisons PAS</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <span>Vendre vos données à des tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <span>Utiliser vos données à des fins publicitaires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <span>Partager vos informations sans consentement</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              Protection de vos données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Mesures de sécurité</h3>
                <ul className="space-y-1 text-green-700">
                  <li>• Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>• Stockage sécurisé avec chiffrement des données sensibles</li>
                  <li>• Accès restreint aux données personnelles</li>
                  <li>• Surveillance continue de la sécurité</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Conformité</h3>
                <ul className="space-y-1 text-blue-700">
                  <li>• Respect du RGPD (Règlement Général sur la Protection des Données)</li>
                  <li>• Conformité aux lois sénégalaises sur la protection des données</li>
                  <li>• Audit régulier de nos pratiques</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-purple-600" />
              Vos droits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Droits d'accès et de contrôle</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Accéder à vos données personnelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Corriger les informations inexactes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Supprimer votre compte et vos données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>Limiter le traitement de vos données</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Comment exercer vos droits</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">Via votre profil</p>
                    <p className="text-xs text-gray-600">Modifiez vos informations directement dans votre dashboard</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-medium">Par email</p>
                    <p className="text-xs text-gray-600">Contactez-nous à privacy@looymind.sn</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6 text-yellow-600" />
              Cookies et technologies similaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience 
                sur notre plateforme. Ces technologies nous aident à :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Mémoriser vos préférences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Maintenir votre session de connexion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Analyser l'utilisation de la plateforme</span>
                </li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note :</strong> Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, 
                  mais cela peut affecter certaines fonctionnalités de la plateforme.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              Questions sur la confidentialité ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Si vous avez des questions sur cette politique de confidentialité ou sur la façon 
              dont nous traitons vos données, n'hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:privacy@looymind.sn"
                className="bg-white text-slate-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                privacy@looymind.sn
              </a>
              <a 
                href="/contact"
                className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-slate-800 transition-colors text-center"
              >
                Formulaire de contact
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
