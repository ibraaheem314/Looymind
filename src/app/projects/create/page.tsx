import ProjectForm from '@/components/projects/project-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Créer un nouveau projet</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
