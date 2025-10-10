import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <Icon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      <div className="flex items-center justify-center gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

