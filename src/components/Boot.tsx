import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PERSON } from '../data/site'
import './Boot.css'

const DURATION = 780
const SEEN_KEY = 'as.booted'

/** Repeat visits in the same tab session skip the cold start entirely. */
function alreadyBooted() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markBooted() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage unavailable — the boot simply runs again next time */
  }
}

/**
 * A short cold-start before the hero. It exists to give the first type reveal
 * something to arrive from — not to make anyone wait. It runs for well under a
 * second, skips on any key or click, and is bypassed entirely under
 * prefers-reduced-motion and on repeat visits in the same tab session.
 *
 * The counter is painted from rAF, but the panel is dismissed on a wall-clock
 * timer. rAF is suspended in a background tab, so a page opened in one (a
 * cmd-click, a link from a message) would otherwise sit under this panel
 * indefinitely and only start its "loading" animation once the tab was
 * brought forward.
 */
export function Boot({ onDone, skip }: { onDone: () => void; skip: boolean }) {
  const [dismissed, setDismissed] = useState(alreadyBooted)
  const [n, setN] = useState(0)

  // Derived, not corrected after the fact: the motion preference can resolve
  // after mount, and a panel that has to un-show itself in an effect is a
  // panel that flashes.
  const open = !skip && !dismissed

  useEffect(() => {
    if (!open) {
      onDone()
      return
    }

    const start = performance.now()
    let frame = 0
    let done = false

    const paint = (t: number) => {
      setN(Math.round(Math.min(1, (t - start) / DURATION) * 100))
      if (!done) frame = requestAnimationFrame(paint)
    }

    const finish = () => {
      if (done) return
      done = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      setN(100)
      setDismissed(true)
      markBooted()
      onDone()
    }

    const timer = window.setTimeout(finish, DURATION)
    frame = requestAnimationFrame(paint)
    window.addEventListener('keydown', finish, { once: true })
    window.addEventListener('pointerdown', finish, { once: true })

    return () => {
      done = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
    // `open` only ever goes true -> false, and the false pass is the one that
    // reports completion, so this intentionally runs on both.
  }, [open, onDone])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="boot"
          role="status"
          aria-label="Loading"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="boot__inner shell">
            <span className="boot__name mono">{PERSON.name}</span>
            <span className="boot__count">{String(n).padStart(3, '0')}</span>
            <span className="boot__role mono">{PERSON.role}</span>
          </div>
          <div className="boot__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${n / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
