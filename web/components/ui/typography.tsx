import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
})

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'small'
}

export function Typography({
  variant = 'p',
  as,
  className,
  ...props
}: TypographyProps) {
  const Element = as ?? (
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    variant === 'h4' ? 'h4' :
    variant === 'lead' || variant === 'muted' ? 'p' :
    variant === 'large' ? 'div' :
    variant === 'small' ? 'small' : 'p'
  )
  return (
    <Element
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

// Convenience exports
export function H1(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="h1" as="h1" {...props} />
}

export function H2(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="h2" as="h2" {...props} />
}

export function H3(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="h3" as="h3" {...props} />
}

export function H4(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="h4" as="h4" {...props} />
}

export function P(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="p" as="p" {...props} />
}

export function Lead(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="lead" as="p" {...props} />
}

export function Large(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="large" as="div" {...props} />
}

export function Small(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="small" as="small" {...props} />
}

export function Muted(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography variant="muted" as="p" {...props} />
}
