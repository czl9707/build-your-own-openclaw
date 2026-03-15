'use client'

import { useRouter } from 'next/navigation'
import { DiffSelector } from '@/components/diff-selector'
import type { Step } from '@/lib/steps'

interface StepDiffSelectorProps {
  currentStepId: string
  steps: Step[]
}

export function StepDiffSelector({ currentStepId, steps }: StepDiffSelectorProps) {
  const router = useRouter()

  return (
    <DiffSelector
      steps={steps}
      onSelect={(targetId) => router.push(`/steps/${currentStepId}/diff/${targetId}`)}
    />
  )
}
