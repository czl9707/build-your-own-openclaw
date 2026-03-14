import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { SKIP_PATTERNS, STEPS_DIR } from './constants'

export interface FileDiff {
  path: string
  status: 'added' | 'removed' | 'modified' | 'unchanged'
  fromContent?: string
  toContent?: string
}

/**
 * Get all Python files in a step directory
 */
function getPythonFiles(stepFolder: string): string[] {
  const stepPath = path.join(process.cwd(), STEPS_DIR, stepFolder, 'src', 'mybot')

  if (!fs.existsSync(stepPath)) {
    return []
  }

  const files = glob.sync('**/*.py', {
    cwd: stepPath,
    ignore: SKIP_PATTERNS,
    nodir: true,
  })

  return files
}

/**
 * Read file content from a step directory
 */
function readFileContent(stepFolder: string, relativePath: string): string | null {
  const filePath = path.join(process.cwd(), STEPS_DIR, stepFolder, 'src', 'mybot', relativePath)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, 'utf-8')
}

/**
 * Discover and compare files between two steps
 */
export function discoverFiles(fromFolder: string, toFolder: string): FileDiff[] {
  const fromFiles = new Set(getPythonFiles(fromFolder))
  const toFiles = new Set(getPythonFiles(toFolder))

  const allFiles = new Set([...fromFiles, ...toFiles])
  const results: FileDiff[] = []

  for (const file of allFiles) {
    const inFrom = fromFiles.has(file)
    const inTo = toFiles.has(file)

    const fromContent = inFrom ? (readFileContent(fromFolder, file) ?? undefined) : undefined
    const toContent = inTo ? (readFileContent(toFolder, file) ?? undefined) : undefined

    let status: FileDiff['status']
    if (!inFrom && inTo) {
      status = 'added'
    } else if (inFrom && !inTo) {
      status = 'removed'
    } else if (fromContent !== toContent) {
      status = 'modified'
    } else {
      status = 'unchanged'
    }

    results.push({
      path: file,
      status,
      fromContent,
      toContent,
    })
  }

  // Sort: modified first, then added, then removed, then unchanged
  const statusOrder: Record<FileDiff['status'], number> = {
    modified: 0,
    added: 1,
    removed: 2,
    unchanged: 3,
  }

  results.sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status]
    if (orderDiff !== 0) return orderDiff
    return a.path.localeCompare(b.path)
  })

  return results
}

/**
 * Get only changed files (exclude unchanged)
 */
export function getChangedFiles(fromFolder: string, toFolder: string): FileDiff[] {
  return discoverFiles(fromFolder, toFolder).filter(
    (f) => f.status !== 'unchanged'
  )
}

/**
 * Get only unchanged files
 */
export function getUnchangedFiles(fromFolder: string, toFolder: string): FileDiff[] {
  return discoverFiles(fromFolder, toFolder).filter(
    (f) => f.status === 'unchanged'
  )
}
