'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckIcon, CopyIcon } from 'lucide-react'

const CLONE_COMMAND = 'git clone https://github.com/czl9707/build-your-own-openclaw.git'

export function CloneCommand() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CLONE_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="flex flex-row items-center justify-between gap-2 p-3 max-w-2xl mx-auto ring-0 bg-muted">
      <code className="flex-1 text-sm font-mono">{CLONE_COMMAND}</code>
      <button
        onClick={handleCopy}
        className="shrink-0 p-2 rounded hover:bg-background transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <CopyIcon className="size-4 text-muted-foreground" />
        )}
      </button>
    </Card>
  )
}
