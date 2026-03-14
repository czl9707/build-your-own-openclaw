'use client'

import * as React from 'react'
import { codeToHtml } from 'shiki'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { computeDiff, type DiffLine } from '@/lib/diff'

interface DiffViewerProps {
  fromContent: string
  toContent: string
  fromLabel?: string
  toLabel?: string
  filename?: string
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
        'flex font-mono text-sm leading-6 border-l-2',
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
 */
function useSyncedScroll() {
  const leftViewportRef = React.useRef<HTMLDivElement>(null)
  const rightViewportRef = React.useRef<HTMLDivElement>(null)
  const isScrolling = React.useRef(false)

  const setupScrollSync = React.useCallback((side: 'left' | 'right') => {
    const sourceRef = side === 'left' ? leftViewportRef : rightViewportRef
    const targetRef = side === 'left' ? rightViewportRef : leftViewportRef

    return () => {
      if (isScrolling.current) return
      if (!sourceRef.current || !targetRef.current) return

      isScrolling.current = true
      targetRef.current.scrollTop = sourceRef.current.scrollTop

      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }
  }, [])

  return {
    leftViewportRef,
    rightViewportRef,
    onLeftScroll: setupScrollSync('left'),
    onRightScroll: setupScrollSync('right'),
  }
}

export function DiffViewer({
  fromContent,
  toContent,
  fromLabel = 'From',
  toLabel = 'To',
  filename,
}: DiffViewerProps) {
  const diffResult = React.useMemo(() => {
    return computeDiff(fromContent, toContent)
  }, [fromContent, toContent])

  const [highlightedLines, setHighlightedLines] = React.useState<Map<number, string>>(new Map())
  const scrollSync = useSyncedScroll()

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

  // Setup scroll event listeners
  React.useEffect(() => {
    const leftViewport = scrollSync.leftViewportRef.current
    const rightViewport = scrollSync.rightViewportRef.current

    if (leftViewport) {
      leftViewport.addEventListener('scroll', scrollSync.onLeftScroll)
    }
    if (rightViewport) {
      rightViewport.addEventListener('scroll', scrollSync.onRightScroll)
    }

    return () => {
      if (leftViewport) {
        leftViewport.removeEventListener('scroll', scrollSync.onLeftScroll)
      }
      if (rightViewport) {
        rightViewport.removeEventListener('scroll', scrollSync.onRightScroll)
      }
    }
  }, [scrollSync])

  // Find viewport elements after mount
  React.useEffect(() => {
    const leftRoot = document.querySelector('[data-left-panel] [data-slot="scroll-area-viewport"]') as HTMLDivElement
    const rightRoot = document.querySelector('[data-right-panel] [data-slot="scroll-area-viewport"]') as HTMLDivElement

    if (leftRoot) {
      scrollSync.leftViewportRef.current = leftRoot
    }
    if (rightRoot) {
      scrollSync.rightViewportRef.current = rightRoot
    }
  }, [scrollSync])

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

  return (
    <div className="w-full">
      {filename && (
        <div className="mb-2 px-2">
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 h-[600px]">
        {/* Left Panel - From */}
        <div className="flex-1 min-w-0 flex flex-col h-full" data-left-panel>
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border border-b-0 border-border rounded-t-lg">
            <span className="text-sm font-medium text-muted-foreground">{fromLabel}</span>
            <span className="text-xs text-muted-foreground">
              {leftLines.length} lines
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full border border-t-0 border-border rounded-b-lg">
              <div className="font-mono text-sm">
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
        <div className="flex-1 min-w-0 flex flex-col h-full" data-right-panel>
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border border-b-0 border-border rounded-t-lg">
            <span className="text-sm font-medium text-muted-foreground">{toLabel}</span>
            <span className="text-xs text-muted-foreground">
              {rightLines.length} lines
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full border border-t-0 border-border rounded-b-lg">
              <div className="font-mono text-sm">
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
    </div>
  )
}
