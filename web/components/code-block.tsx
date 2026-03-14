import { codeToHtml } from 'shiki'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language: string
  className?: string
}

export async function CodeBlock({ code, language, className }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark',
  })

  return (
    <div
      className={cn(
        'my-6 overflow-x-auto rounded-lg border border-border',
        className
      )}
    >
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="[&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:w-fit [&>pre]:min-w-full"
      />
    </div>
  )
}
