'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Step } from '@/lib/steps'

interface DiffSelectorProps {
  steps: Step[]
  value?: string
  placeholder?: string
  onSelect: (stepId: string) => void
}

export function DiffSelector({
  steps,
  value,
  placeholder = 'Compare with...',
  onSelect,
}: DiffSelectorProps) {
  const handleValueChange = (newValue: string | null) => {
    if (newValue) {
      onSelect(newValue)
    }
  }

  const selectedStep = steps.find((s) => s.id === value)

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="min-w-48">
        <SelectValue placeholder={placeholder}>
          {selectedStep && (
            <>
              <span className="font-mono text-xs">{selectedStep.id}:</span>{' '}
              <span className="text-xs">{selectedStep.title}</span>
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {steps.map((step) => (
          <SelectItem key={step.id} value={step.id}>
            <span className="font-mono text-xs">{step.id}:</span>{' '}
            <span className="text-xs">{step.title}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
