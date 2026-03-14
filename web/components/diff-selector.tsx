'use client'

import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Step } from '@/lib/steps'

interface DiffSelectorProps {
  currentStepId: string
  steps: Step[]
}

export function DiffSelector({ currentStepId, steps }: DiffSelectorProps) {
  const router = useRouter()

  const handleValueChange = (value: string | null) => {
    if (value) {
      router.push(`/steps/${currentStepId}/diff/${value}`)
    }
  }

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="min-w-64">
        <SelectValue placeholder="Compare with..." />
      </SelectTrigger>
      <SelectContent>
        {steps.map((target) => (
          <SelectItem key={target.id} value={target.id}>
            Step {target.id}: {target.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
