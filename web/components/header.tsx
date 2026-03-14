import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">OpenClaw Tutorial</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Steps
            </Link>
            <a
              href="https://github.com/czl9707/build-your-own-openclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              GitHub
            </a>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
