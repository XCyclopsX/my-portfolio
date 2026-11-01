import Scene, { SectionLabel } from './Scene'
import { EXPERIENCE } from '@/data/portfolio'

export default function Experience() {
  return (
    <Scene id="exp-scene" index="02" next="proj-scene" labelledBy="exp-title">
      <div className="container">
        <SectionLabel text="EXPERIENCE" />
        <h2 id="exp-title" className="section-title section-title--spaced">Where I&apos;ve worked.</h2>
        <ol className="exp-list">
          {EXPERIENCE.map(exp => (
            <li key={exp.company} className="exp-row">
              <div className="exp-date">{exp.date}</div>
              <div>
                <h3 className="exp-co">{exp.company}</h3>
                <p className="exp-role">{exp.role}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  )
}
