import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { TIMELINE } from '../data/site'
import { SectionLabel } from './SectionLabel'
import { Rise } from './Reveal'
import { useReducedMotion } from '../lib/hooks'
import './Log.css'

/**
 * A builder timeline rather than an employment history.
 * No job titles, no companies, no internships — none of that exists yet and
 * none of it is implied here.
 */
export function Log() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'end 62%'],
  })
  const draw = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <section id="log" className="log" data-surface="paper">
      <div className="shell">
        <SectionLabel n="04" name="Log" meta="How it went" heading />

        <div className="log__intro">
          <Rise>
            <p className="log__intro-text">
              No job titles here yet. This is the order things actually happened in.
            </p>
          </Rise>
        </div>

        <div className="log__list" ref={ref}>
          <div className="log__spine" aria-hidden="true">
            <motion.span
              className="log__spine-fill"
              style={reduce ? { scaleY: 1 } : { scaleY: draw }}
            />
          </div>

          {TIMELINE.map((t, i) => (
            <Rise key={t.head} delay={0.04} y={18}>
              <article className="log__row">
                <span className="log__node" aria-hidden="true" />
                <span className="log__when mono">{t.when}</span>
                <div className="log__content">
                  <h3 className="log__head">{t.head}</h3>
                  <p className="log__body">{t.body}</p>
                  {t.link && (
                    <a
                      className="log__link mono hit"
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                    >
                      {t.linkLabel ?? 'View'} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
                <span className="log__i mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}
