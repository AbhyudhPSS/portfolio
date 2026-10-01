import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { PROJECTS } from '../data/site'
import { scrollToId, scrollToY } from '../lib/useLenis'
import { play } from '../lib/sfx'
import './ProjectRail.css'

/**
 * The index for the work section: five oversized titles that travel
 * horizontally while the section holds the viewport.
 *
 * Pinning is `position: sticky` rather than a JS scroll library — the browser
 * does it on the compositor, it cannot desync from the scroll position, and
 * the only JS involved is one transform driven by scroll progress. Below
 * 1000px, and under reduced motion, this renders as a plain vertical list.
 */
/**
 * How much vertical scroll the rail costs, as a fraction of the horizontal
 * distance it covers. At 1 the rail moves pixel-for-pixel with the page,
 * which for twelve oversized panels means roughly seven screens of scrolling
 * before the actual chapters begin — an index should not cost more than the
 * content it indexes. At 0.55 the same twelve panels pass in about four.
 */
const PACE = 0.55

export function ProjectRail({ enabled }: { enabled: boolean }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState(0)

  /* How far the track must travel for its last item to reach the right edge. */
  useEffect(() => {
    if (!enabled) return
    const el = track.current
    if (!el) return

    // scrollWidth already includes the track's own trailing gutter, so the
    // travel is exactly the overflow past the viewport.
    const measure = () =>
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth))

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [enabled])

  /**
   * Keyboard focus and the pinned track.
   *
   * Tabbing to a panel that is currently off-screen makes the browser try to
   * reveal it. There is nothing for it to scroll horizontally any more (the
   * viewport is `overflow: clip`), so instead we translate the panel's
   * position along the track into the page scroll offset that brings it into
   * view, and move the page there. The track follows, because the track is
   * driven by page scroll.
   */
  const revealPanel = useCallback(
    (el: HTMLElement) => {
      const wrap = section.current
      if (!wrap || distance <= 0) return

      // Where this panel sits along the track, less a left margin so it lands
      // inside the viewport rather than flush against its edge.
      const offset = el.offsetLeft - window.innerWidth * 0.12
      const progress = Math.min(1, Math.max(0, offset / distance))
      const railTop = wrap.getBoundingClientRect().top + window.scrollY
      const top = railTop + progress * distance * PACE

      // A frame late, deliberately. Focusing an element also makes the
      // browser scroll it into view, and that native scroll lands after the
      // focus event — scrolling from inside the handler would simply be
      // overwritten by it.
      requestAnimationFrame(() => scrollToY(top))
    },
    [distance],
  )

  /**
   * Belt and braces. `overflow: clip` means this element cannot scroll, so
   * this should never fire — but if any engine does treat it as scrollable,
   * a single native scroll would desync the track for the rest of the
   * section. Snapping it back costs nothing and makes that unrecoverable.
   */
  const onViewportScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (e.currentTarget.scrollLeft !== 0) e.currentTarget.scrollLeft = 0
    },
    [],
  )

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start start', 'end end'],
  })
  const eased = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 42,
    restDelta: 0.0005,
  })
  const x = useTransform(eased, [0, 1], [0, -distance])

  if (!enabled) {
    return (
      <nav className="rail rail--static" aria-label="Project index">
        <ul className="rail__static-list">
          {PROJECTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="rail__static-item"
                onClick={() => scrollToId(`project-${p.id}`)}
                style={{ '--art-accent': p.accent } as React.CSSProperties}
              >
                <span className="rail__static-n mono">{p.index}</span>
                <span className="rail__static-name display">{p.name}</span>
                <span className="rail__static-kind mono">{p.kind}</span>
                <span className="rail__static-go" aria-hidden="true">
                  ↓
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <div
      className="rail"
      ref={section}
      style={{ height: `calc(100svh + ${Math.round(distance * PACE)}px)` }}
    >
      <div className="rail__viewport" onScroll={onViewportScroll}>
        <p className="rail__hint mono" aria-hidden="true">
          Index — scroll
        </p>

        <motion.ul className="rail__track" ref={track} style={{ x }}>
          {PROJECTS.map((p) => (
            <li
              key={p.id}
              className="rail__panel"
              style={{ '--art-accent': p.accent } as React.CSSProperties}
            >
              <button
                type="button"
                className="rail__panel-btn"
                data-cursor="view"
                onMouseEnter={() => play('tick')}
                onFocus={(e) => revealPanel(e.currentTarget)}
                onClick={() => {
                  play('move')
                  scrollToId(`project-${p.id}`)
                }}
              >
                <span className="rail__n mono">{p.index}</span>
                <span className="rail__name display">{p.name}</span>
                <span className="rail__meta">
                  <span className="mono">{p.kind}</span>
                  <span className="mono rail__meta-year">{p.year}</span>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>

        <div className="rail__progress" aria-hidden="true">
          <motion.span className="rail__progress-bar" style={{ scaleX: eased }} />
        </div>
      </div>
    </div>
  )
}
