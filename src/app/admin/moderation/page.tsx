import ModerationDashboard from '@/components/moderation/moderation-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Modération - Looymind',
  description: 'Tableau de bord de modération pour les administrateurs'
}

export default function ModerationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modération</h1>
              <p className="text-gray-600">Gérez les signalements et maintenez la qualité du contenu</p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <ModerationDashboard />
      </div>
    </div>
  )
}

