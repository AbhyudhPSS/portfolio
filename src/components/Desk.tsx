import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { DESK } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Lines } from './Reveal'
import { LedgeFigure } from './LedgeFigure'
import { useMedia, useReducedMotion } from '../lib/hooks'
import { play } from '../lib/sfx'
import './Desk.css'

/** Resting positions — scattered, but deliberately non-overlapping. */
const LAYOUT = [
  { x: '1%', y: '2%', r: -2.4 },
  { x: '37%', y: '0%', r: 1.8 },
  { x: '70%', y: '5%', r: -1.2 },
  { x: '4%', y: '31%', r: 1.4 },
  { x: '40%', y: '35%', r: -2.8 },
  { x: '71%', y: '38%', r: 2.2 },
  { x: '10%', y: '66%', r: -1.6 },
  { x: '46%', y: '69%', r: 1.1 },
]

export function Desk() {
  const bounds = useRef<HTMLDivElement>(null)
  const [, setTop] = useState(10)
  const canDrag = useMedia('(min-width: 860px)')
  const reduce = useReducedMotion()

  return (
    <section className="desk" data-surface="paper" aria-label="Currently">
      <LedgeFigure />

      <div className="shell">
        <SectionLabel n="07" name="Desk" meta="Small true things" />

        <div className="desk__head">
          <Lines
            as="h2"
            className="desk__title display"
            lines={['what is actually', 'on my desk.']}
          />
          {canDrag && (
            <p className="desk__hint mono" aria-hidden="true">
              <span className="desk__hint-arrow">↔</span> drag them around
            </p>
          )}
        </div>

        <div className={`desk__surface ${canDrag ? 'is-scatter' : ''}`} ref={bounds}>
          <ul className="desk__items">
            {DESK.map((d, i) => {
              const pos = LAYOUT[i % LAYOUT.length]
              return (
                <motion.li
                  key={d.text}
                  className="desk__card"
                  data-tone={d.tone ?? 'default'}
                  style={
                    canDrag
                      ? { left: pos.x, top: pos.y, rotate: pos.r, zIndex: 1 }
                      : undefined
                  }
                  drag={canDrag}
                  dragConstraints={bounds}
                  dragElastic={0.12}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.04, rotate: 0, cursor: 'grabbing' }}
                  whileHover={canDrag && !reduce ? { y: -4 } : undefined}
                  onDragStart={(e) => {
                    play('move')
                    const el = e.currentTarget as HTMLElement | null
                    if (!el) return
                    // Derive the new z from the updater, not from the render's
                    // captured `top` — two drags in the same commit would
                    // otherwise both read the stale value and collide.
                    setTop((z) => {
                      el.style.zIndex = String(z + 1)
                      return z + 1
                    })
                  }}
                  initial={reduce ? undefined : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="desk__tag mono">{d.tag}</span>
                  <span className="desk__text">{d.text}</span>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
