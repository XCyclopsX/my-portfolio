import Scene, { SectionLabel } from './Scene'
import { AWARDS, EDUCATION } from '@/data/portfolio'

export default function Education() {
  return (
    <Scene id="edu-scene" index="04" labelledBy="edu-title">
      <div className="container">
        <SectionLabel text="EDUCATION & AWARDS" />
        <h2 id="edu-title" className="section-title section-title--spaced">Where I learned.</h2>
        <ul className="grid-2 grid-2--tight edu-grid">
          {EDUCATION.map(e => (
            <li key={e.degree} className="card card--hover card--hover-alt edu-card">
              <div className="edu-year">{e.year}</div>
              <h3 className="edu-degree">
                {e.degree}
                {'duration' in e && <span className="edu-duration"> ({e.duration})</span>}
              </h3>
              <div className="edu-school">{e.school}</div>
            </li>
          ))}
        </ul>
        <ul className="award-list">
          {AWARDS.map(a => (
            <li key={a.title} className="card card--hover award-card">
              <div className="award-icon" aria-hidden="true">{a.icon}</div>
              <div>
                <div className="award-title">{a.title}</div>
                <div className="award-org">{a.org}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  )
}
