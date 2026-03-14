import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Muted } from '@/components/ui/typography'
import type { Step } from '@/lib/steps'

interface StepCardProps {
  step: Step
}

export function StepCard({ step }: StepCardProps) {
  return (
    <Link href={`/steps/${step.id}`}>
      <Card className="h-full transition-colors hover:border-primary">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{step.id}</Badge>
          </div>
          <CardTitle className="text-lg">{step.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Muted className="line-clamp-2">{step.description || `Phase ${step.phase}`}</Muted>
        </CardContent>
      </Card>
    </Link>
  )
}
