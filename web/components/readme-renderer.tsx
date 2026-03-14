import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import { H1, H2, H3, H4, P } from '@/components/ui/typography'
import { CodeBlock } from './code-block'
import type { Components } from 'react-markdown'

// GitHub repository base URL for source file links
const GITHUB_REPO_URL = 'https://github.com/czl9707/build-your-own-openclaw'

// Step folder to step ID mapping (e.g., "01-tools" -> "01")
const STEP_FOLDER_PATTERN = /^(\d{2})-/

interface ReadmeRendererProps {
  content: string
  stepFolder: string
}

/**
 * Strips the first H1 heading from markdown content
 * to avoid duplication when the title is shown separately
 */
function stripFirstH1(markdown: string): string {
  const lines = markdown.split('\n')
  const firstNonEmptyIndex = lines.findIndex(line => line.trim() !== '')

  if (firstNonEmptyIndex !== -1 && lines[firstNonEmptyIndex].trim().startsWith('# ')) {
    lines.splice(firstNonEmptyIndex, 1)
    if (lines[firstNonEmptyIndex]?.trim() === '') {
      lines.splice(firstNonEmptyIndex, 1)
    }
  }

  return lines.join('\n')
}

/**
 * Rewrites relative image paths to absolute public paths
 * Handles both HTML <img> tags and markdown ![](src) syntax
 */
function rewriteImagePaths(markdown: string, stepFolder: string): string {
  // Rewrite HTML <img src="..."> tags
  let result = markdown.replace(
    /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/gi,
    (match, before, src, after) => {
      if (!src.startsWith('http') && !src.startsWith('/')) {
        return `<img ${before}src="/steps/${stepFolder}/${src}"${after}>`
      }
      return match
    }
  )

  // Rewrite markdown image syntax ![alt](src)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      if (!src.startsWith('http') && !src.startsWith('/')) {
        return `![${alt}](/steps/${stepFolder}/${src})`
      }
      return match
    }
  )

  return result
}

/**
 * Rewrites links to handle:
 * 1. Source file links (.py, .yaml, etc.) -> point to GitHub
 * 2. Step directory links (../02-skills/, 01-tools/) -> point to internal step pages
 */
function rewriteLinks(markdown: string, stepFolder: string): string {
  // Match markdown links: [text](href)
  return markdown.replace(
    /\[([^\]]*)\]\(([^)]+)\)/g,
    (match, text, href) => {
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return match
      }

      // Skip image links (handled separately)
      if (match.startsWith('!')) {
        return match
      }

      // Check for step directory links (e.g., ../02-skills/, 01-tools/, ./03-persistence/)
      const stepMatch = href.match(/^(?:\.\.\/|\.\/)?(\d{2}-[\w-]+)\/?$/)
      if (stepMatch) {
        const folderName = stepMatch[1]
        const idMatch = folderName.match(STEP_FOLDER_PATTERN)
        if (idMatch) {
          return `[${text}](/steps/${idMatch[1]})`
        }
      }

      // Check for source file links (.py, .yaml, .json, .toml, .txt, etc.)
      const sourceFileExtensions = ['.py', '.yaml', '.yml', '.json', '.toml', '.txt', '.md', '.cfg', '.ini']
      const isSourceFile = sourceFileExtensions.some(ext => href.endsWith(ext))

      if (isSourceFile && !href.startsWith('/')) {
        // Resolve relative path
        const resolvedPath = href.startsWith('../')
          ? href.replace(/^\.\.\//, '') // For now, just remove ../ (assumes main branch)
          : href

        return `[${text}](${GITHUB_REPO_URL}/tree/main/${stepFolder}/${resolvedPath})`
      }

      return match
    }
  )
}

const components: Components = {
  h1: ({ children }) => <H1>{children}</H1>,
  h2: ({ children }) => <H2>{children}</H2>,
  h3: ({ children }) => <H3>{children}</H3>,
  h4: ({ children }) => <H4>{children}</H4>,
  p: ({ children }) => <P>{children}</P>,
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    const isInline = !match

    if (isInline) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <CodeBlock
        language={match[1]}
        code={String(children).replace(/\n$/, '')}
      />
    )
  },
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary pl-6 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-border even:bg-muted/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border border-border px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto rounded-lg my-6"
      {...props}
    />
  ),
}

export function ReadmeRenderer({ content, stepFolder }: ReadmeRendererProps) {
  const processedContent = rewriteLinks(
    rewriteImagePaths(stripFirstH1(content), stepFolder),
    stepFolder
  )

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
