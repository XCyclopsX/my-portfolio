import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Scrolls to a section.
 *
 * Desktop (scenes stacked in the sticky stage): smooth-scrolling would play every scene in
 * between, so instead we fade the page out, jump straight to the target, settle all scrubbed
 * animations instantly, and fade back in. Each scene has an invisible marker spanning its
 * "hold" range — we land in the middle of it.
 */
export function scrollToTarget(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const stacked = document.documentElement.classList.contains('scenes-crossfade')

  if (!stacked) {
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    return
  }

  const marker = document.getElementById(`${id}-marker`)
  const top = marker
    ? marker.getBoundingClientRect().top + window.scrollY + (marker.offsetHeight - window.innerHeight) * 0.5
    : el.getBoundingClientRect().top + window.scrollY

  const jump = () => {
    window.scrollTo({ top, behavior: 'auto' })
    ScrollTrigger.update()
    // Skip the scrub catch-up so in-between scenes don't flash past (only scrubbed triggers have one)
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.scrub) st.getTween()?.progress(1)
    })
  }

  if (reduceMotion) {
    jump()
    return
  }

  gsap.killTweensOf('main')
  gsap.timeline()
    .to('main', { autoAlpha: 0, duration: 0.2, ease: 'power1.in', onComplete: jump })
    .to('main', { autoAlpha: 1, duration: 0.4, ease: 'power1.out' })
}
