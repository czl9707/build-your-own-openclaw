import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStep, getSteps } from '@/lib/steps'
import { getChangedFiles, getUnchangedFiles } from '@/lib/files'
import { DiffViewer } from '@/components/diff-viewer'
import { FileNavDropdown } from '@/components/file-nav-dropdown'
import { DiffPageSelector } from '@/components/diff-page-selector'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

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

      {/* Sticky Page Header */}
      <div className="sticky top-14 z-40 -mx-4 px-4 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <DiffPageSelector
            fromStep={fromStep}
            toStep={toStep}
            fromSteps={getSteps().filter((s) => parseInt(s.id) < parseInt(toStep.id))}
            toSteps={getSteps().filter((s) => parseInt(s.id) > parseInt(fromStep.id))}
          />
          {changedFiles.length > 0 && (
            <FileNavDropdown
              label="Files"
              files={changedFiles.map((file) => ({
                path: file.path,
                status: file.status,
                anchorId: `file-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
              }))}
            />
          )}
        </div>
      </div>

      {/* Changed Files Diff */}
      {changedFiles.length > 0 ? (
        <>
          {changedFiles.map((file) => {
            const anchorId = `file-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`
            return (
              <div key={file.path} id={anchorId} className="scroll-mt-32">
                <DiffViewer
                  fromContent={file.fromContent ?? ''}
                  toContent={file.toContent ?? ''}
                  fromLabel={`Step ${fromStep.id}: ${fromStep.title}`}
                  toLabel={`Step ${toStep.id}: ${toStep.title}`}
                  filename={file.path}
                />
              </div>
            )
          })}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No file changes between these steps.
        </div>
      )}

      {/* Unchanged Files */}
      {unchangedFiles.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {unchangedFiles.length} unchanged files
            </h3>
            <div className="flex-1 h-px bg-border" />
          </div>
            {unchangedFiles.map((file) => (
              <DiffViewer
                key={file.path}
                defaultOpen={false}
                fromContent={file.fromContent ?? ''}
                toContent={file.toContent ?? ''}
                fromLabel={`Step ${fromStep.id}: ${fromStep.title}`}
                toLabel={`Step ${toStep.id}: ${toStep.title}`}
                filename={file.path}
              />
            ))}
        </div>
      )}
    </div>
  )
}
