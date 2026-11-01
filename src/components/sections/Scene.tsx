import type { ReactNode } from 'react'
import ScrollLink from '../ScrollLink'

interface SceneProps {
  id: string
  index: string
  next?: string
  panelClassName?: string
  labelledBy: string
  children: ReactNode
}

/**
 * One full-screen panel. By default panels sit in normal document flow (mobile, no-JS,
 * reduced motion). On desktop ScrollEffects stacks them in a sticky stage and crossfades them.
 */
export default function Scene({ id, index, next, panelClassName, labelledBy, children }: SceneProps) {
  return (
    <section id={id} className={`scene-panel${panelClassName ? ` ${panelClassName}` : ''}`} aria-labelledby={labelledBy}>
      <div className="scene-index" aria-hidden="true">{index}</div>
      {children}
      {next && (
        <ScrollLink target={next} className="scene-hint">
          <span aria-hidden="true" />scroll to continue<span aria-hidden="true" />
        </ScrollLink>
      )}
    </section>
  )
}

/** Wraps all scenes: a tall scroll track + sticky stage, plus invisible markers used for nav scrolling. */
export function SceneStage({ ids, children }: { ids: string[]; children: ReactNode }) {
  return (
    <div className="scenes">
      {ids.map(id => <div key={id} id={`${id}-marker`} className="scene-marker" aria-hidden="true" />)}
      <div className="scenes-stage">{children}</div>
    </div>
  )
}

export function SectionLabel({ text, variant = 'accent2' }: { text: string; variant?: 'accent' | 'accent2' | 'muted' }) {
  return <p className={`section-label section-label--${variant}`}>{text}</p>
}
