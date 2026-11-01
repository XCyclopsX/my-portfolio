import Scene, { SectionLabel } from './Scene'
import { PROJECTS } from '@/data/portfolio'

export default function Projects() {
  return (
    <Scene id="proj-scene" index="03" next="edu-scene" panelClassName="scene-panel--top" labelledBy="proj-title">
      <div className="container">
        <SectionLabel text="PROJECTS" />
        <h2 id="proj-title" className="section-title">Selected work.</h2>
        <ul className="proj-grid">
          {PROJECTS.map(p => (
            <li key={p.num} className={`card proj-card${p.featured ? ' proj-card--featured' : ''}`}>
              <div className="proj-num">{p.num}{p.featured ? ' — FEATURED' : ''}</div>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-desc">{p.desc}</p>
              <ul className="tag-list tag-list--sm" aria-label="Technologies">
                {p.tags.map(t => <li key={t} className="tag">{t}</li>)}
              </ul>
              {p.awards && (
                <ul className="proj-awards" aria-label="Awards">
                  {p.awards.map(a => <li key={a}><span aria-hidden="true">🏆 </span>{a}</li>)}
                </ul>
              )}
              <div className="proj-footer">
                <span>{p.date}</span>
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="proj-link">
                    View<span className="sr-only"> {p.title} (opens in new tab)</span> ↗
                  </a>
                ) : (
                  <span className="proj-private">Internal project</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  )
}
