import { H1, P } from '@/components/ui/typography'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <H1>404 - Page Not Found</H1>
      <P className="text-muted-foreground">The step or diff you're looking for doesn't exist.</P>
      <Link
        href="/"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 gap-1.5 px-2.5 hover:bg-primary/80 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
