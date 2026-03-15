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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <DiffSelector
        steps={fromSteps}
        value={fromStep.id}
        placeholder="From step..."
        label="From"
        onSelect={(newFromId) => router.push(`/steps/${newFromId}/diff/${toStep.id}`)}
      />
      <span className="hidden text-muted-foreground sm:block mb-2">→</span>
      <DiffSelector
        steps={toSteps}
        value={toStep.id}
        placeholder="To step..."
        label="To"
        onSelect={(newToId) => router.push(`/steps/${fromStep.id}/diff/${newToId}`)}
      />
    </div>
  )
}
