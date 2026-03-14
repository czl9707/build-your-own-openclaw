import Link from 'next/link'
import { getStepsByPhase } from '@/lib/steps'
import { PHASES } from '@/lib/constants'
import { H1, H2, Lead, Muted } from '@/components/ui/typography'
import { StepCard } from '@/components/step-card'
import { CloneCommand } from '@/components/clone-command'
import { GithubIcon, StarIcon } from 'lucide-react'

const GITHUB_REPO_URL = 'https://github.com/czl9707/build-your-own-openclaw'

export default function Home() {
  const stepsByPhase = getStepsByPhase()

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center my-32">
        <H1 className="mb-4">Build Your Own OpenClaw</H1>
        <Lead className="max-w-2xl mb-8">
          Learn to build a production-ready AI agent through 18 progressive steps.
          From a simple chat loop to a fully autonomous multi-agent system.
        </Lead>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/steps/00"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-4 hover:bg-primary/80 transition-colors"
          >
            Start Learning
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium h-9 gap-1.5 px-4 hover:bg-muted transition-colors"
          >
            <GithubIcon className="size-4" />
            View on GitHub
          </a>
        </div>
      </section>

      {/* Clone Command */}
      <section className="mb-16">
        <CloneCommand />
      </section>

      {/* Star CTA */}
      <section className="mb-16 text-center">
        <a
          href={`${GITHUB_REPO_URL}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <StarIcon className="size-4" />
          <span className="text-sm">If you find this helpful, give us a star on GitHub!</span>
        </a>
      </section>

      {/* Steps Overview */}
      <section className="space-y-12">
        {Object.entries(PHASES).map(([phaseNum, phase]) => {
          const phaseSteps = stepsByPhase[parseInt(phaseNum, 10)] || []

          return (
            <div key={phaseNum}>
              <div className="mb-6">
                <H2 className="mb-2">Phase {phaseNum}: {phase.name}</H2>
                <Muted>{phase.description}</Muted>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {phaseSteps.map((step) => (
                  <StepCard key={step.id} step={step} />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
