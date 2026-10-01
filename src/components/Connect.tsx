import { CONNECT, LINKS, PERSON } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines, Rise } from './Reveal'
import { play } from '../lib/sfx'
import './Connect.css'

export function Connect() {
  return (
    <section id="connect" className="connect" data-surface="void">
      <div className="shell">
        <SectionLabel n="09" name="Connect" meta={`${PERSON.location} · open`} />

        <Lines
          as="h2"
          className="connect__head display"
          lines={CONNECT.head}
          stagger={0.08}
        />

        <div className="connect__cols">
          <Rise>
            <p className="connect__body">{CONNECT.body}</p>
          </Rise>

          <ul className="connect__links">
            {LINKS.map((l, i) => {
              const live = Boolean(l.href)
              return (
                <Rise
                  as="li"
                  key={l.label}
                  delay={i * 0.05}
                  y={14}
                  className="connect__row"
                >
                    {live ? (
                      <a
                        className="connect__link"
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={
                          l.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        data-cursor="link"
                        onMouseEnter={() => play('tick')}
                      >
                        <span className="connect__label">{l.label}</span>
                        <span className="connect__handle mono">{l.handle}</span>
                        <span className="connect__arrow" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="connect__link connect__link--todo">
                        <span className="connect__label">{l.label}</span>
                        <span className="connect__handle mono">{l.handle}</span>
                        <span className="connect__pending mono">not linked yet</span>
                      </span>
                    )}
                </Rise>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
