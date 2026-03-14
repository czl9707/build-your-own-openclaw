import fs from 'fs'
import path from 'path'
import { PHASES, STEPS_DIR } from './constants'

export interface Step {
  id: string
  title: string
  description: string
  phase: number
  folderName: string
  readmePath: string
}

/**
 * Get the folder name for a step ID (e.g., "00" -> "00-chat-loop")
 */
function getFolderName(stepId: string): string | null {
  const stepsDir = path.join(process.cwd(), STEPS_DIR)
  const entries = fs.readdirSync(stepsDir, { withFileTypes: true })
  const folder = entries.find(
    (e) => e.isDirectory() && e.name.startsWith(`${stepId}-`)
  )
  return folder?.name ?? null
}

/**
 * Parse title from README H1
 * Format: "# Step XX: Title Here" -> "Title Here"
 */
function parseTitle(readmeContent: string): string {
  const h1Match = readmeContent.match(/^# .+/m)
  if (!h1Match) return 'Unknown'
  const fullTitle = h1Match[0].replace('# ', '')
  return fullTitle.split(': ')[1] ?? fullTitle
}

/**
 * Parse the first blockquote from README
 * Format: "> Description text here" -> "Description text here"
 */
function parseDescription(readmeContent: string): string {
  const blockquoteMatch = readmeContent.match(/^>\s*(.+)$/m)
  return blockquoteMatch?.[1]?.trim() ?? ''
}

/**
 * Get phase number for a step ID
 */
function getPhase(stepId: string): number {
  const phaseEntries = Object.entries(PHASES) as [string, typeof PHASES[1]][]
  for (const [phase, data] of phaseEntries) {
    if (data.steps.includes(stepId as any)) {
      return parseInt(phase, 10)
    }
  }
  return 0
}

/**
 * Load all steps from the parent directory
 */
export function loadSteps(): Step[] {
  const steps: Step[] = []
  const phaseEntries = Object.entries(PHASES) as [string, typeof PHASES[1]][]
  for (const [phaseStr, phaseData] of phaseEntries) {
    for (const stepId of phaseData.steps) {
      const folderName = getFolderName(stepId)
      if (!folderName) continue

      const readmePath = path.join(process.cwd(), STEPS_DIR, folderName, 'README.md')
      let title = `Step ${stepId}`
      let description = ''

      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf-8')
        title = parseTitle(content)
        description = parseDescription(content)
      }

      steps.push({
        id: stepId,
        title,
        description,
        phase: parseInt(phaseStr, 10),
        folderName,
        readmePath,
      })
    }
  }

  return steps
}

// Cache steps at module level for build
let _steps: Step[] | null = null

export function getSteps(): Step[] {
  if (!_steps) {
    _steps = loadSteps()
  }
  return _steps
}

export function getStep(id: string): Step | undefined {
  return getSteps().find((s) => s.id === id)
}

export function getStepsByPhase(): Record<number, Step[]> {
  const steps = getSteps()
  const result: Record<number, Step[]> = {}

  for (const step of steps) {
    if (!result[step.phase]) {
      result[step.phase] = []
    }
    result[step.phase].push(step)
  }

  return result
}
