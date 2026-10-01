import { useMemo, useState } from 'react'
import { STACK } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines, Rise } from './Reveal'
import { useFinePointer } from '../lib/hooks'
import { play } from '../lib/sfx'
import './Stack.css'

type Item = { name: string; group: string }

/**
 * A cross-referenced index rather than a skills chart.
 *
 * Every capability is listed once in a single field. Selecting a domain on the
 * left resolves which entries belong to it — the same information a progress
 * bar would claim to show, without inventing a percentage for it.
 */
export function Stack() {
  const [active, setActive] = useState<string | null>(null)
  const fine = useFinePointer()

  const items = useMemo<Item[]>(
    () =>
      STACK.flatMap((g) => g.items.map((name) => ({ name, group: g.group }))),
    [],
  )

  const current = STACK.find((g) => g.group === active)

  return (
    <section id="stack" className="stack" data-surface="paper">
      <div className="shell">
        <SectionLabel n="03" name="Stack" meta={`${items.length} entries`} />

        <Lines
          as="h2"
          className="stack__head display"
          lines={['what i build with,', 'and roughly why.']}
        />

        <div className="stack__layout">
          {/* --- Domains --- */}
          <div
            className="stack__groups"
            onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
          >
            {/* A list of its own so that on phones it can become one
                swipeable row, with the note still underneath it. */}
            <div className="stack__group-list">
              {STACK.map((g, i) => (
                <Rise key={g.group} delay={i * 0.05} y={14}>
                  <button
                    type="button"
                    className="stack__group"
                    data-active={active === g.group}
                    data-cursor="link"
                    // Mouse hover and keyboard focus only. A tap fires a
                    // compatibility mouseenter, and focuses the button, just
                    // before its click — resolving on either let the click
                    // find the group already active and toggle it straight
                    // back off.
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'mouse') return
                      setActive(g.group)
                      play('tick')
                    }}
                    onFocus={(e) => {
                      if (e.currentTarget.matches(':focus-visible')) setActive(g.group)
                    }}
                    onClick={() => setActive(active === g.group ? null : g.group)}
                    aria-pressed={active === g.group}
                  >
                    <span className="stack__group-n mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="stack__group-name">{g.group}</span>
                    <span className="stack__group-count mono">{g.items.length}</span>
                  </button>
                </Rise>
              ))}
            </div>

            {/* No aria-live: this updates on every pointer pass across the
                domain list, which would turn into a stream of announcements
                for anyone using a screen reader with a mouse. The domain
                buttons already carry the state via aria-pressed. */}
            <p className="stack__note mono">
              {current
                ? current.note
                : fine
                  ? 'Hover or select a domain to resolve it.'
                  : 'Tap a domain to resolve it.'}
            </p>
          </div>

          {/* --- Field --- */}
          <ul
            className="stack__field"
            data-filtering={active !== null}
            aria-label="Technologies and disciplines"
          >
            {items.map((it, i) => (
              <li
                key={`${it.group}-${it.name}`}
                className="stack__item"
                data-on={active === null || active === it.group}
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="stack__item-dot" aria-hidden="true" />
                {it.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
