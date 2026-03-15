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
  label?: string
  onSelect: (stepId: string) => void
}

export function DiffSelector({
  steps,
  value,
  placeholder = 'Compare with...',
  label,
  onSelect,
}: DiffSelectorProps) {
  const handleValueChange = (newValue: string | null) => {
    if (newValue) {
      onSelect(newValue)
    }
  }

  const selectedStep = steps.find((s) => s.id === value)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-auto sm:min-w-48">
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
    </div>
  )
}
