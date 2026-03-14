import * as Diff from 'diff'

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

export interface DiffResult {
  lines: DiffLine[]
  addedCount: number
  removedCount: number
}

/**
 * Compute line-by-line diff between two strings
 */
export function computeDiff(fromContent: string, toContent: string): DiffResult {
  const changes = Diff.diffLines(fromContent, toContent)
  const lines: DiffLine[] = []
  let addedCount = 0
  let removedCount = 0

  let oldLine = 1
  let newLine = 1

  for (const change of changes) {
    const changeLines = change.value.split('\n')
    // Remove last empty string if content ends with newline
    if (changeLines[changeLines.length - 1] === '') {
      changeLines.pop()
    }

    for (const line of changeLines) {
      if (change.added) {
        lines.push({
          type: 'added',
          content: line,
          newLineNumber: newLine++,
        })
        addedCount++
      } else if (change.removed) {
        lines.push({
          type: 'removed',
          content: line,
          oldLineNumber: oldLine++,
        })
        removedCount++
      } else {
        lines.push({
          type: 'unchanged',
          content: line,
          oldLineNumber: oldLine++,
          newLineNumber: newLine++,
        })
      }
    }
  }

  return { lines, addedCount, removedCount }
}
