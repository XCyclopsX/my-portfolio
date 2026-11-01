import Scene, { SectionLabel } from './Scene'
import { SITE, SKILLS, STATS } from '@/data/portfolio'

export default function About() {
  return (
    <Scene id="about-scene" index="01" next="exp-scene" labelledBy="about-title">
      <div className="container grid-2 grid-2--center">
        <div>
          <SectionLabel text="ABOUT ME" variant="accent" />
          <h2 id="about-title" className="section-title">Building things<br />that matter.</h2>
          <p className="body-text">Full-Stack Developer with {SITE.experience} years of professional experience building scalable web applications. Proven track record in HRIS and academic SaaS product development.</p>
          <p className="body-text">Hands-on with ASP.NET MVC, .NET Core, and database schema design. Received the Award of Appreciation from Alpha Education Network in 2023 and 2024, along with Creative Bit of the Year and two Project of the Month awards at Aptech Pakistan.</p>
          <div className="stat-grid">
            {STATS.map(s => (
              <div key={s.label} className="card card--hover stat-card">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card--lg">
          <SectionLabel text="TECH STACK" variant="muted" />
          <ul className="tag-list">
            {SKILLS.map(s => <li key={s} className="skill-tag">{s}</li>)}
          </ul>
        </div>
      </div>
    </Scene>
  )
}
