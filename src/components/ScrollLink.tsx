'use client'

import type { ReactNode } from 'react'
import { scrollToTarget } from '@/lib/scroll'

interface ScrollLinkProps {
  target: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
}

/** Real anchor (works without JS / keyboard), enhanced with scene-aware scrolling. */
export default function ScrollLink({ target, className, children, onNavigate }: ScrollLinkProps) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={e => {
        e.preventDefault()
        scrollToTarget(target)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}
