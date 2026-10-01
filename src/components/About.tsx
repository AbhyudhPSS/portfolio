import { ABOUT, PERSON } from '../data/site'
import { Lines, Rise } from './Reveal'
import { SectionLabel } from './SectionLabel'
import { AsciiPortrait } from './AsciiPortrait'
import './About.css'

const RAIL = [
  { k: 'Based', v: PERSON.location },
  { k: 'Fields', v: 'AI · ML · Vision · Robotics · Product' },
  { k: 'Method', v: 'Build first, argue after' },
  { k: 'Coding since', v: 'Age 12, with Python' },
  { k: 'In parallel', v: 'Class 10' },
]

export function About() {
  return (
    <section id="about" className="about" data-surface="paper">
      <div className="shell">
        <SectionLabel n="01" name="About" meta="Who / why" />

        <Lines
          as="h2"
          className="about__lede display"
          lines={[
            'i learn things',
            'by breaking them',
            'open first.',
          ]}
        />

        <div className="about__cols">
          <aside className="about__rail" aria-label="Details">
            <Rise y={14} className="about__portrait-wrap">
              <AsciiPortrait
                photos={[PERSON.photos.about]}
                alt={`${PERSON.name}, rendered as a character grid`}
              />
            </Rise>

            {RAIL.map((r, i) => (
              <Rise key={r.k} delay={i * 0.05} y={14}>
                <dl className="about__rail-row">
                  <dt className="mono">{r.k}</dt>
                  <dd>{r.v}</dd>
                </dl>
              </Rise>
            ))}
          </aside>

          <div className="about__body">
            <Rise>
              <p className="about__opening">{ABOUT.lede}</p>
            </Rise>

            {ABOUT.body.map((para, i) => {
              const note = ABOUT.notes.find((n) => n.at === i)
              return (
                <Rise key={i} delay={0.05}>
                  <div className="about__para-wrap">
                    <p className="about__para">{para}</p>
                    {note && (
                      <span className="about__note" aria-hidden="true">
                        <span className="about__note-leader" />
                        {note.text}
                      </span>
                    )}
                  </div>
                </Rise>
              )
            })}
          </div>
        </div>

        <div className="about__curious">
          <Rise>
            <h3 className="about__curious-head mono">Currently curious about</h3>
          </Rise>
          <ul className="about__tags">
            {ABOUT.curious.map((c, i) => (
              <Rise as="li" key={c} delay={i * 0.04} y={12} className="tag about__tag">
                <span className="about__tag-i">{String(i + 1).padStart(2, '0')}</span>
                {c}
              </Rise>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
