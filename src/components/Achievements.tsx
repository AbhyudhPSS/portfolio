import { ACHIEVEMENTS } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines, Rise } from './Reveal'
import './Achievements.css'

const TOTAL = ACHIEVEMENTS.reduce((n, g) => n + g.items.length, 0)

/**
 * Formal recognition, kept deliberately dry and dense rather than a wall of
 * badges — a "Winner" is labelled a winner, a quiz completed is labelled a
 * quiz completed, nothing in between is upgraded.
 */
export function Achievements() {
  return (
    <section id="achievements" className="ach" data-surface="paper">
      <div className="shell">
        <SectionLabel n="05" name="Recognitions" meta={`${TOTAL} entries`} />

        <Lines
          as="h2"
          className="ach__head display"
          lines={['formal recognition,', 'for the same work.']}
        />

        <div className="ach__grid">
          {ACHIEVEMENTS.map((group, gi) => (
            <Rise key={group.category} delay={gi * 0.04} y={16} className="ach__group">
              <h3 className="ach__cat mono">
                {group.category}
                <span className="ach__cat-n">{group.items.length}</span>
              </h3>
              <ul className="ach__list">
                {group.items.map((it) => (
                  <li key={it.title} className="ach__item">
                    <span className="ach__title">{it.title}</span>
                    <span className="ach__meta mono">{it.meta}</span>
                  </li>
                ))}
              </ul>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}
