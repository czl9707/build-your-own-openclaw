import fs from 'fs'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getStep, getSteps } from '@/lib/steps'
import { ReadmeRenderer } from '@/components/readme-renderer'
import { DiffSelector } from '@/components/diff-selector'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { H1 } from '@/components/ui/typography'

// Button-like link styles for Server Components (matches buttonVariants outline)
const buttonOutlineStyles =
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background text-sm font-medium h-8 px-2.5 hover:bg-muted hover:text-foreground transition-colors'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const steps = getSteps()
  return steps.map((step) => ({ id: step.id }))
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const step = getStep(id)

  if (!step) {
    return { title: 'Step Not Found' }
  }

  return {
    title: `Step ${step.id}: ${step.title}`,
  }
}

export default async function StepPage({ params }: PageProps) {
  const { id } = await params
  const step = getStep(id)

  if (!step) {
    notFound()
  }

  // Read README content
  const readmeContent = fs.readFileSync(step.readmePath, 'utf-8')

  // Get all steps for navigation
  const steps = getSteps()
  const currentIndex = steps.findIndex((s) => s.id === step.id)
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null

  // Steps available for diff comparison (excluding current step)
  const diffTargets = steps.filter((s) => s.id !== step.id)

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
            <BreadcrumbLink render={<Link href="/#steps" />}>
              Steps
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Step {step.id}: {step.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with title and diff action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <H1 className="text-3xl">
          Step {step.id}: {step.title}
        </H1>

        {/* Diff action dropdown */}
        <DiffSelector currentStepId={step.id} steps={diffTargets} />
      </div>

      {/* README Content */}
      <div className="mb-8">
        <ReadmeRenderer content={readmeContent} stepFolder={step.folderName} />
      </div>

      {/* Prev/Next Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        <div>
          {prevStep && (
            <Link href={`/steps/${prevStep.id}`} className={buttonOutlineStyles}>
              <ChevronLeft className="size-4" />
              Previous: Step {prevStep.id}
            </Link>
          )}
        </div>
        <div>
          {nextStep && (
            <Link href={`/steps/${nextStep.id}`} className={buttonOutlineStyles}>
              Next: Step {nextStep.id}
              <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
