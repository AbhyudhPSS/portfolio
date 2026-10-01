import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { HERO, PERSON } from '../data/site'
import { useClock, useReducedMotion } from '../lib/hooks'
import { scrollToId } from '../lib/useLenis'
import './Hero.css'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const clock = useClock(PERSON.timezone)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // The statement leaves slightly slower than the page — depth, not parallax noise.
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section id="top" ref={ref} className="hero" data-surface="paper">
      <div className="hero__grid shell">
        {/* Top technical row */}
        <div className="hero__meta">
          <motion.span
            className="mono"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {PERSON.name}
          </motion.span>
          <motion.span
            className="mono hero__meta-right"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {PERSON.role}
          </motion.span>
        </div>

        {/* The statement */}
        <motion.h1
          className="hero__statement display"
          style={reduce ? undefined : { y, opacity: fade }}
        >
          {HERO.statement.map((line, i) => (
            <span className="line-mask" key={line}>
              <motion.span
                className="hero__line"
                data-accent={i === HERO.statement.length - 1}
                initial={reduce ? undefined : { y: '108%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 1.15,
                  delay: 0.45 + i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Bottom row */}
        <div className="hero__foot">
          <motion.p
            className="hero__sub"
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            className="hero__status"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1 }}
          >
            <span className="hero__status-row mono">
              <span className="hero__pulse" aria-hidden="true" />
              Currently building
            </span>
            <span className="hero__status-row mono">
              {PERSON.location} · {clock || '--:--:--'} {PERSON.tzLabel}
            </span>
          </motion.div>

          <motion.button
            type="button"
            className="hero__scroll hit-lg"
            onClick={() => scrollToId('work')}
            data-cursor="link"
            aria-label="Jump to selected work"
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.2 }}
          >
            <span className="mono">Selected work</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}
