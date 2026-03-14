import Link from 'next/link'
import { getStepsByPhase } from '@/lib/steps'
import { PHASES } from '@/lib/constants'
import { H1, H2, Lead, Muted } from '@/components/ui/typography'
import { StepCard } from '@/components/step-card'

export default function Home() {
  const stepsByPhase = getStepsByPhase()

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-16">
        <H1 className="mb-4">Build Your Own OpenClaw</H1>
        <Lead className="max-w-2xl mb-8">
          Learn to build a production-ready AI agent through 18 progressive steps.
          From a simple chat loop to a fully autonomous multi-agent system.
        </Lead>
        <Link
          href="/steps/00"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 gap-1.5 px-2.5 hover:bg-primary/80 transition-colors"
        >
          Get Started
        </Link>
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
