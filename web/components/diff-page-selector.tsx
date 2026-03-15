'use client'

import { useRouter } from 'next/navigation'
import { DiffSelector } from '@/components/diff-selector'
import type { Step } from '@/lib/steps'

interface DiffPageSelectorProps {
  fromStep: Step
  toStep: Step
  fromSteps: Step[]
  toSteps: Step[]
}

export function DiffPageSelector({
  fromStep,
  toStep,
  fromSteps,
  toSteps,
}: DiffPageSelectorProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <DiffSelector
        steps={fromSteps}
        value={fromStep.id}
        placeholder="From step..."
        onSelect={(newFromId) => router.push(`/steps/${newFromId}/diff/${toStep.id}`)}
      />
      <span className="text-muted-foreground">→</span>
      <DiffSelector
        steps={toSteps}
        value={toStep.id}
        placeholder="To step..."
        onSelect={(newToId) => router.push(`/steps/${fromStep.id}/diff/${newToId}`)}
      />
    </div>
  )
}
