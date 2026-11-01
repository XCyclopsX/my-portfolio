import { SITE } from '@/data/portfolio'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {SITE.name}</span>
      <span className="footer-status">
        <span className="pulse-dot" aria-hidden="true" />
        Open to work
      </span>
      <span>{SITE.location}</span>
    </footer>
  )
}
