'use client'

import * as React from 'react'
import { codeToHtml } from 'shiki'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { computeDiff, type DiffLine } from '@/lib/diff'
import { ChevronDownIcon } from 'lucide-react'

interface DiffViewerProps {
  fromContent: string
  toContent: string
  fromLabel?: string
  toLabel?: string
  filename?: string
  defaultOpen?: boolean
}

/**
 * Highlight a single line of code using shiki
 */
async function highlightLine(content: string, lang: string = 'python'): Promise<string> {
  try {
    // Wrap single line in a block for shiki, then extract the line
    const html = await codeToHtml(content, {
      lang,
      theme: 'github-dark',
    })
    // shiki wraps in <pre><code>, extract just the inner content
    const match = html.match(/<code[^>]*>([\s\S]*)<\/code>/)
    return match ? match[1] : content
  } catch {
    // Fallback to escaped content if highlighting fails
    return escapeHtml(content)
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface DiffLineRendererProps {
  line: DiffLine
  highlightedContent: string
}

function DiffLineRenderer({ line, highlightedContent }: DiffLineRendererProps) {
  const bgColor =
    line.type === 'added'
      ? 'bg-green-500/20'
      : line.type === 'removed'
        ? 'bg-red-500/20'
        : ''

  const borderColor =
    line.type === 'added'
      ? 'border-l-green-500'
      : line.type === 'removed'
        ? 'border-l-red-500'
        : 'border-l-transparent'

  const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '

  return (
    <div
      className={cn(
        'flex font-mono text-sm leading-6 border-l-2 w-max min-w-full',
        bgColor,
        borderColor
      )}
    >
      <span className="w-12 shrink-0 select-none text-right pr-3 text-muted-foreground/50 border-r border-border/50">
        {line.oldLineNumber ?? ''}
      </span>
      <span className="w-12 shrink-0 select-none text-right pr-3 text-muted-foreground/50 border-r border-border/50">
        {line.newLineNumber ?? ''}
      </span>
      <span
        className={cn(
          'w-6 shrink-0 select-none text-center',
          line.type === 'added' ? 'text-green-500' : line.type === 'removed' ? 'text-red-500' : 'text-muted-foreground/30'
        )}
      >
        {prefix}
      </span>
      <span
        className="pl-3 whitespace-pre"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    </div>
  )
}

/**
 * Custom hook for synced scrolling between two scroll areas
 * Uses a unique instance ID to target specific scroll areas when multiple diffs exist
 */
function useSyncedScroll(instanceId: string) {
  const [viewports, setViewports] = React.useState<{
    left: HTMLDivElement | null
    right: HTMLDivElement | null
  }>({ left: null, right: null })
  const isScrolling = React.useRef(false)

  // Find viewport elements after mount
  React.useEffect(() => {
    const leftRoot = document.querySelector(
      `[data-diff-instance="${instanceId}"][data-left-panel] [data-slot="scroll-area-viewport"]`
    ) as HTMLDivElement | null
    const rightRoot = document.querySelector(
      `[data-diff-instance="${instanceId}"][data-right-panel] [data-slot="scroll-area-viewport"]`
    ) as HTMLDivElement | null

    if (leftRoot || rightRoot) {
      setViewports({ left: leftRoot, right: rightRoot })
    }
  }, [instanceId])

  // Setup scroll event listeners when viewports are found
  React.useEffect(() => {
    const { left, right } = viewports
    if (!left || !right) return

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isScrolling.current) return

      isScrolling.current = true
      target.scrollTop = source.scrollTop

      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }

    const onLeftScroll = () => syncScroll(left, right)
    const onRightScroll = () => syncScroll(right, left)

    left.addEventListener('scroll', onLeftScroll)
    right.addEventListener('scroll', onRightScroll)

    return () => {
      left.removeEventListener('scroll', onLeftScroll)
      right.removeEventListener('scroll', onRightScroll)
    }
  }, [viewports])

  return instanceId
}

export function DiffViewer({
  fromContent,
  toContent,
  fromLabel = 'From',
  toLabel = 'To',
  filename,
  defaultOpen = true,
}: DiffViewerProps) {
  const diffResult = React.useMemo(() => {
    return computeDiff(fromContent, toContent)
  }, [fromContent, toContent])

  const [highlightedLines, setHighlightedLines] = React.useState<Map<number, string>>(new Map())

  // Generate unique instance ID for scroll sync
  const instanceId = React.useId()
  useSyncedScroll(instanceId)

  // Highlight all lines with shiki
  React.useEffect(() => {
    async function highlightAllLines() {
      const newHighlighted = new Map<number, string>()

      for (let i = 0; i < diffResult.lines.length; i++) {
        const line = diffResult.lines[i]
        if (line.content.trim()) {
          const highlighted = await highlightLine(line.content)
          newHighlighted.set(i, highlighted)
        } else {
          newHighlighted.set(i, '')
        }
      }

      setHighlightedLines(newHighlighted)
    }

    highlightAllLines()
  }, [diffResult.lines])

  const leftLines = diffResult.lines.filter(l => l.type !== 'added')
  const rightLines = diffResult.lines.filter(l => l.type !== 'removed')

  // Create line number maps for proper indexing
  const leftLineMap = React.useMemo(() => {
    const map = new Map<number, number>()
    let leftIdx = 0
    diffResult.lines.forEach((line, idx) => {
      if (line.type !== 'added') {
        map.set(leftIdx, idx)
        leftIdx++
      }
    })
    return map
  }, [diffResult.lines])

  const rightLineMap = React.useMemo(() => {
    const map = new Map<number, number>()
    let rightIdx = 0
    diffResult.lines.forEach((line, idx) => {
      if (line.type !== 'removed') {
        map.set(rightIdx, idx)
        rightIdx++
      }
    })
    return map
  }, [diffResult.lines])

  const diffContent = (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-[600px]">
        {/* Left Panel - From */}
        <div className="flex-1 min-w-0 flex flex-col h-full" data-left-panel data-diff-instance={instanceId}>
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border border-b-0 border-border rounded-t-lg">
            <span className="text-sm font-medium text-muted-foreground">{fromLabel}</span>
            <span className="text-xs text-muted-foreground">
              {leftLines.length} lines
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full border border-t-0 border-border rounded-b-lg">
              <div className="font-mono text-sm w-fit">
                {leftLines.map((line, leftIdx) => {
                  const originalIdx = leftLineMap.get(leftIdx) ?? 0
                  const highlightedContent = highlightedLines.get(originalIdx) ?? escapeHtml(line.content)
                  return (
                    <DiffLineRenderer
                      key={`left-${leftIdx}`}
                      line={line}
                      highlightedContent={highlightedContent}
                    />
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Panel - To */}
        <div className="flex-1 min-w-0 flex flex-col h-full" data-right-panel data-diff-instance={instanceId}>
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border border-b-0 border-border rounded-t-lg">
            <span className="text-sm font-medium text-muted-foreground">{toLabel}</span>
            <span className="text-xs text-muted-foreground">
              {rightLines.length} lines
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full border border-t-0 border-border rounded-b-lg">
              <div className="font-mono text-sm w-fit">
                {rightLines.map((line, rightIdx) => {
                  const originalIdx = rightLineMap.get(rightIdx) ?? 0
                  const highlightedContent = highlightedLines.get(originalIdx) ?? escapeHtml(line.content)
                  return (
                    <DiffLineRenderer
                      key={`right-${rightIdx}`}
                      line={line}
                      highlightedContent={highlightedContent}
                    />
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500/50 rounded-sm" />
          <span className="text-muted-foreground">{diffResult.addedCount} additions</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500/50 rounded-sm" />
          <span className="text-muted-foreground">{diffResult.removedCount} deletions</span>
        </span>
      </div>
    </>
  )

  // If no filename, render without collapsible wrapper
  if (!filename) {
    return (
      <div className="w-full">
        {diffContent}
      </div>
    )
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className="w-full">
      <CollapsibleTrigger className="group flex items-center gap-2 w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
        <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        <span className="font-mono text-xs">{filename}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {diffResult.addedCount > 0 && (
            <span className="text-green-500 mr-2">+{diffResult.addedCount}</span>
          )}
          {diffResult.removedCount > 0 && (
            <span className="text-red-500">-{diffResult.removedCount}</span>
          )}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 mb-8">
        {diffContent}
      </CollapsibleContent>
    </Collapsible>
  )
}
