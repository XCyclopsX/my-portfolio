'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SCENES = [
  { id: 'about-scene', dir: 'left' },
  { id: 'exp-scene',   dir: 'up' },
  { id: 'proj-scene',  dir: 'zoom-in' },
  { id: 'edu-scene',   dir: 'right' },
] as const

/** Screens big enough for the sticky-stage scenes. Below 1025px the project grid gets taller than a screen. */
const STAGE_QUERY = '(min-width: 1025px) and (min-height: 680px)'
/** Scroll distance (vh) each scene stays fully visible */
const HOLD_VH = 90
/** Scroll distance (vh) over which one scene crossfades into the next */
const CROSSFADE_VH = 30
const STEP_VH = HOLD_VH + CROSSFADE_VH
/** Scrubbed animations trail the scroll position by this many seconds (smoothing) */
const SCRUB = 0.5

/**
 * Desktop scenes: panels stacked in one sticky stage, driven by ONE scrubbed timeline
 * (separate tweens on the same panel fight each other during fast scrolls).
 * Returns false — and leaves the normal flow layout — if any panel's content doesn't fit on screen.
 */
function setupStage(root: HTMLElement): boolean {
  root.classList.add('scenes-crossfade')

  const fits = SCENES.every(({ id }) => {
    const panel = document.getElementById(id)!
    const content = panel.querySelector<HTMLElement>('.container')!
    const cs = getComputedStyle(panel)
    return content.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) <= panel.clientHeight
  })
  if (!fits) {
    root.classList.remove('scenes-crossfade')
    return false
  }

  const count = SCENES.length
  const panels = SCENES.map(s => `#${s.id}`)
  const pinStart = 100 // timeline units before the stage pins (stage top travelling from viewport bottom to top)
  const total = pinStart + count * HOLD_VH + (count - 1) * CROSSFADE_VH

  gsap.set('.scenes', { height: `${total}vh` })
  // Markers give nav links a real scroll position: the middle of each scene's hold
  SCENES.forEach((s, i) => gsap.set(`#${s.id}-marker`, { top: `${i * STEP_VH}vh`, height: `${100 + HOLD_VH}vh` }))

  const hidden = SCENES.map(({ dir }) => {
    const enter: gsap.TweenVars = { autoAlpha: 0, filter: 'blur(14px)' }
    const exit:  gsap.TweenVars = { autoAlpha: 0, filter: 'blur(14px)' }
    if (dir === 'left')    { enter.x = 70;       exit.x = -70 }
    if (dir === 'right')   { enter.x = -70;      exit.x = 70 }
    if (dir === 'up')      { enter.y = 70;       exit.y = -70 }
    if (dir === 'zoom-in') { enter.scale = 0.93; exit.scale = 1.05 }
    return { enter, exit }
  })
  const visible: gsap.TweenVars = { x: 0, y: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', ease: 'none' }

  // Initial state: every panel hidden — scroll position alone decides which one shows
  panels.forEach((p, i) => gsap.set(p, hidden[i].enter))

  // Snapping: if the scroll stops mid-crossfade, finish it in the direction the user was scrolling.
  // Inside a hold (one scene fully visible) nothing moves, so slow wheel scrolling is never pulled back.
  const holdStart = (i: number) => pinStart + i * STEP_VH
  const snapToFullScene = (value: number, self?: ScrollTrigger) => {
    const t = value * total
    for (let i = 0; i < count - 1; i++) {
      const fadeFrom = holdStart(i) + HOLD_VH
      const fadeTo = holdStart(i + 1)
      if (t > fadeFrom && t < fadeTo) {
        const down = (self?.direction ?? 1) > 0
        return (down ? fadeTo : fadeFrom) / total
      }
    }
    return value
  }

  // 1 timeline unit = 1vh of scroll
  const tl = gsap.timeline({
    defaults: { ease: 'none', immediateRender: false },
    scrollTrigger: {
      trigger: '.scenes',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: SCRUB,
      snap: {
        snapTo: snapToFullScene,
        // Use the real resting position — with inertia GSAP predicts a momentum target and
        // returning it would glide the page past where the user (or a nav jump) stopped
        inertia: false,
        duration: { min: 0.2, max: 0.5 },
        delay: 0.15,
        ease: 'power1.inOut',
      },
    },
  })
  // First scene fades in while the stage scrolls up into view (stage top: 85% → 0% of viewport)
  tl.fromTo(panels[0], hidden[0].enter, { ...visible, duration: 85 }, 15)

  for (let i = 0; i < count - 1; i++) {
    const at = pinStart + i * STEP_VH + HOLD_VH
    // Slightly staggered so the two panels' text never overlaps at full strength
    tl.fromTo(panels[i], visible, { ...hidden[i].exit, duration: CROSSFADE_VH * 0.6 }, at)
      .fromTo(panels[i + 1], hidden[i + 1].enter, { ...visible, duration: CROSSFADE_VH * 0.6 }, at + CROSSFADE_VH * 0.4)
  }
  // Pad the end so the last scene holds before the stage scrolls away
  tl.to({}, { duration: HOLD_VH }, pinStart + (count - 1) * STEP_VH)

  ScrollTrigger.refresh()
  return true
}

/** Custom cursor, scroll progress bar and all GSAP page animations. */
export default function ScrollEffects() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Progress bar ──
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // matchMedia re-runs on breakpoint change and auto-reverts everything created inside
    const mm = gsap.matchMedia()
    mm.add(
      {
        bigScreen: STAGE_QUERY,
        reduceMotion: '(prefers-reduced-motion: reduce)',
        finePointer: '(hover: hover) and (pointer: fine)',
      },
      ctx => {
        const { bigScreen, reduceMotion, finePointer } = ctx.conditions as Record<string, boolean>
        if (reduceMotion) return
        const root = document.documentElement

        // ── Hero entrance ──
        gsap.from('.hero-word', { y: '110%', duration: 1.1, ease: 'power4.out', stagger: 0.13, delay: 0.2 })
        gsap.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.8, delay: 0.1 })
        gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.9, delay: 0.9 })
        gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.9, delay: 1.1 })
        gsap.from('.hero-photo-wrap', { opacity: 0, x: 40, scale: 0.97, duration: 1.1, ease: 'power3.out', delay: 0.5 })
        gsap.from('.hero-badge', { opacity: 0, y: 12, duration: 0.8, delay: 1.0 })
        gsap.from('.hero-stats', { opacity: 0, y: 12, duration: 0.8, delay: 1.1 })

        // ── Scenes ──
        const staged = bigScreen && setupStage(root)

        if (staged) {
          gsap.from('.contact-left',  { opacity: 0, x: -50, filter: 'blur(12px)', duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 75%' } })
          gsap.from('.contact-right', { opacity: 0, x:  50, filter: 'blur(12px)', duration: 0.9, ease: 'power3.out', delay: 0.15, scrollTrigger: { trigger: '#contact', start: 'top 75%' } })
        } else {
          // Normal flow (phones, tablets, short screens): simple one-time fade-in per section
          gsap.utils.toArray<HTMLElement>('.scene-panel .container, .contact-grid').forEach(el =>
            gsap.from(el, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
          )
        }

        // ── Custom cursor (mouse users only) ──
        const cursor = cursorRef.current
        const ring = ringRef.current
        let onMove: ((e: MouseEvent) => void) | null = null

        if (finePointer && cursor && ring) {
          gsap.set([cursor, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
          const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
          const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })
          onMove = (e: MouseEvent) => {
            gsap.set(cursor, { x: e.clientX, y: e.clientY, autoAlpha: 1 })
            gsap.set(ring, { autoAlpha: 1 })
            ringX(e.clientX)
            ringY(e.clientY)
          }
          document.addEventListener('mousemove', onMove)
        }

        return () => {
          root.classList.remove('scenes-crossfade')
          if (onMove) document.removeEventListener('mousemove', onMove)
        }
      },
    )

    return () => {
      window.removeEventListener('scroll', onScroll)
      mm.revert()
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={barRef} className="progress-bar" aria-hidden="true" />
    </>
  )
}
