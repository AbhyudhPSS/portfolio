import { BELIEFS } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines, Rise } from './Reveal'
import './Beliefs.css'

export function Beliefs() {
  return (
    <section className="beliefs" data-surface="void">
      <div className="shell">
        <SectionLabel n="06" name="Positions" meta="Held until disproved" heading />

        <ol className="beliefs__list">
          {BELIEFS.map((b) => (
            <li className="beliefs__item" key={b.n}>
              <span className="beliefs__n mono" aria-hidden="true">
                {b.n}
              </span>
              <Lines
                as="h3"
                className="beliefs__head display"
                lines={splitHead(b.head)}
                stagger={0.05}
              />
              <Rise delay={0.12} className="beliefs__body">
                <p>{b.body}</p>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Two display lines, split at the midpoint word boundary. */
function splitHead(text: string): string[] {
  const words = text.split(' ')
  if (words.length < 4) return [text]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}
