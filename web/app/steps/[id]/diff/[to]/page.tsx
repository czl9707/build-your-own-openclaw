import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStep, getSteps } from '@/lib/steps'
import { getChangedFiles, getUnchangedFiles, type FileDiff } from '@/lib/files'
import { DiffViewer } from '@/components/diff-viewer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { H2, Muted } from '@/components/ui/typography'
import { ChevronDownIcon, FileIcon, PlusIcon, MinusIcon } from 'lucide-react'

interface DiffPageProps {
  params: Promise<{
    id: string
    to: string
  }>
}

export async function generateStaticParams() {
  const steps = getSteps()
  const params: { id: string; to: string }[] = []

  // Generate all valid combinations where from < to
  for (let i = 0; i < steps.length - 1; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      params.push({
        id: steps[i].id,
        to: steps[j].id,
      })
    }
  }

  return params // 153 combinations (18 * 17 / 2)
}

export async function generateMetadata({ params }: DiffPageProps) {
  const { id, to } = await params
  const fromStep = getStep(id)
  const toStep = getStep(to)

  if (!fromStep || !toStep) {
    return { title: 'Diff Not Found' }
  }

  return {
    title: `Diff: Step ${fromStep.id} to Step ${toStep.id} | Build Your Own OpenClaw`,
  }
}

// Status type for changed files (excludes 'unchanged')
type ChangedStatus = 'added' | 'removed' | 'modified'

// Get status icon for file
function getStatusIcon(status: ChangedStatus) {
  switch (status) {
    case 'added':
      return <PlusIcon className="size-3 text-green-500" />
    case 'removed':
      return <MinusIcon className="size-3 text-red-500" />
    case 'modified':
      return null
  }
}

export default async function DiffPage({ params }: DiffPageProps) {
  const { id, to } = await params
  const fromStep = getStep(id)
  const toStep = getStep(to)

  // Validate steps exist and from < to
  if (!fromStep || !toStep) {
    notFound()
  }

  if (parseInt(id, 10) >= parseInt(to, 10)) {
    notFound()
  }

  const changedFiles = getChangedFiles(fromStep.folderName, toStep.folderName)
  const unchangedFiles = getUnchangedFiles(fromStep.folderName, toStep.folderName)

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/steps/${fromStep.id}`} />}>
              Step {fromStep.id}: {fromStep.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Diff to Step {toStep.id}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-8">
        <H2 className="mb-2">
          Step {fromStep.id} to Step {toStep.id}
        </H2>
        <Muted>
          Comparing &quot;{fromStep.title}&quot; with &quot;{toStep.title}&quot;
        </Muted>
      </div>

      {/* Changed Files Diff */}
      {changedFiles.length > 0 ? (
        <Tabs defaultValue={changedFiles[0]?.path} className="w-full">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            {changedFiles.map((file) => (
              <TabsTrigger
                key={file.path}
                value={file.path}
                className="flex items-center gap-1.5"
              >
                {getStatusIcon(file.status as ChangedStatus)}
                <span className="font-mono text-xs">{file.path}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {changedFiles.map((file) => (
            <TabsContent key={file.path} value={file.path}>
              <DiffViewer
                fromContent={file.fromContent ?? ''}
                toContent={file.toContent ?? ''}
                fromLabel={`Step ${fromStep.id}: ${fromStep.title}`}
                toLabel={`Step ${toStep.id}: ${toStep.title}`}
                filename={file.path}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No file changes between these steps.
        </div>
      )}

      {/* Unchanged Files */}
      {unchangedFiles.length > 0 && (
        <Collapsible className="mt-8">
          <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            <FileIcon className="size-4" />
            <span>{unchangedFiles.length} unchanged files</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-muted/30 rounded-lg p-4">
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {unchangedFiles.map((file) => (
                  <li
                    key={file.path}
                    className="flex items-center gap-2 text-sm font-mono text-muted-foreground"
                  >
                    <FileIcon className="size-3" />
                    {file.path}
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
