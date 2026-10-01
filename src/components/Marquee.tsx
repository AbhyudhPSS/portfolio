import { MARQUEE } from '../data/site'
import './Marquee.css'

/**
 * A graphic band between the hero and the body copy.
 * Pure CSS transform animation — no JS, no RAF, stays on the compositor.
 * The track is duplicated once and translated by exactly -50%, which is what
 * makes the loop seamless.
 */
export function Marquee() {
  const run = [...MARQUEE, ...MARQUEE]

  return (
    <div className="marquee" data-surface="void" aria-hidden="true">
      <div className="marquee__track">
        {run.map((text, i) => (
          <span className="marquee__item" key={i}>
            <span className="marquee__text display">{text}</span>
            <span className="marquee__sep" />
          </span>
        ))}
      </div>
    </div>
  )
}
