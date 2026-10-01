import { PROJECTS } from '../data/site'
import { ProjectChapter } from './ProjectChapter'
import { ProjectRail } from './ProjectRail'
import { SectionLabel } from './SectionLabel'
import { useMedia, useReducedMotion } from '../lib/hooks'
import './Work.css'

export function Work() {
  const wide = useMedia('(min-width: 1000px)')
  const reduce = useReducedMotion()
  const pinnable = wide && !reduce

  return (
    <section id="work" className="work" data-surface="void">
      <div className="shell">
        <SectionLabel
          n="02"
          name="Selected work"
          meta={`${PROJECTS.length} projects · age 12 —`}
          heading
        />
      </div>

      <ProjectRail enabled={pinnable} />

      <div className="work__chapters">
        {PROJECTS.map((p) => (
          <ProjectChapter key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
