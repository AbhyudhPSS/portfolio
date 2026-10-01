import { OUTSIDE } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines, Rise } from './Reveal'
import './Outside.css'

/**
 * Two real photos — skateboarding, and something new (archery) — laid out as
 * a pair of prints on the paper surface. Deliberately un-schematic: after a
 * whole page of diagrams and character grids, these are just photographs.
 *
 * Each print is rotated by CSS on the inner `figure`, never on the `Rise`
 * wrapper — Motion writes its own transform inline on the wrapper and would
 * silently override the rotation.
 */
export function Outside() {
  return (
    <section className="outside" data-surface="paper">
      <div className="shell">
        <SectionLabel n="08" name="Outside" meta="Also true" />

        <div className="outside__grid">
          <div className="outside__intro">
            <Lines as="h2" className="outside__title display" lines={OUTSIDE.head} />
            <Rise delay={0.12}>
              <p className="outside__body">{OUTSIDE.body}</p>
            </Rise>
          </div>

          <div className="outside__plates">
            {OUTSIDE.photos.map((p, i) => (
              <Rise key={p.src} delay={0.08 + i * 0.14} className="outside__slot">
                <figure className="outside__plate">
                  <div className="outside__frame">
                    <picture>
                      <source srcSet={p.webp} type="image/webp" />
                      <img
                        src={p.src}
                        alt={p.alt}
                        width={p.width}
                        height={p.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <figcaption className="outside__cap">
                    <span className="outside__fig mono" aria-hidden="true">
                      fig. 0{i + 1}
                    </span>
                    <span className="outside__tag mono">{p.tag}</span>
                    <span className="outside__text">{p.text}</span>
                  </figcaption>
                </figure>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
