import Image from 'next/image'
import ScrollLink from './ScrollLink'
import { SITE, STATS } from '@/data/portfolio'
import me from '../../public/me.jpg'

export default function Hero() {
  const nameParts = SITE.name.split(' ')

  return (
    <section id="hero" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-watermark" aria-hidden="true">DEV</div>

      <div className="hero-inner">
        <div>
          <p className="hero-eyebrow pill">
            <span className="pulse-dot pulse-dot--sm" aria-hidden="true" />
            AVAILABLE FOR REMOTE &amp; ONSITE
          </p>
          <h1 className="hero-title">
            {nameParts.map((w, i) => (
              <span key={w} className="hero-word-mask">
                <span className={`hero-word${i === nameParts.length - 1 ? ' accent' : ''}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="hero-sub">{SITE.tagline}</p>
          <div className="hero-cta">
            <ScrollLink target="proj-scene" className="btn btn--primary">View work ↗</ScrollLink>
            <ScrollLink target="contact" className="btn btn--ghost">Get in touch</ScrollLink>
            <a href={SITE.resume.href} download={SITE.resume.fileName} className="btn btn--ghost">
              Download CV <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <div className="hero-photo">
            <div className="hero-photo-border" aria-hidden="true" />
            <div className="hero-photo-offset" aria-hidden="true" />
            <Image
              src={me}
              alt={SITE.name}
              priority
              placeholder="blur"
              sizes="300px"
              className="hero-img"
            />
            <div className="hero-badge">{SITE.title}</div>
          </div>
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label.split(' ')[0].toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line-anim" />
        <span>SCROLL</span>
      </div>
    </section>
  )
}
