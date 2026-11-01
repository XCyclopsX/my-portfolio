import { SKILLS } from '@/data/portfolio'

const ITEMS = SKILLS.filter(s => !['Stored Procedures', 'HTML5 / CSS3', 'Git', 'jQuery', 'Node.js (basic)', 'JavaScript (ES6+)'].includes(s))

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map(i => (
          <span key={i} className="marquee-group">
            {ITEMS.map(s => (
              <span key={s} className="marquee-item">
                {s}<span className="marquee-dot">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
