'use client'

import { useEffect, useState } from 'react'
import ScrollLink from './ScrollLink'
import { NAV_LINKS, SITE } from '@/data/portfolio'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' open' : ''}`} aria-label="Main">
      <button
        type="button"
        className="nav-logo nav-link"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        {SITE.shortName}
      </button>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen(o => !o)}
      >
        <span /><span />
      </button>

      <div id="nav-menu" className="nav-menu">
        <span className="pulse-dot" aria-hidden="true" />
        {NAV_LINKS.map(l => (
          <ScrollLink key={l.target} target={l.target} className="nav-link nav-item" onNavigate={() => setMenuOpen(false)}>
            {l.label}
          </ScrollLink>
        ))}
      </div>
    </nav>
  )
}
