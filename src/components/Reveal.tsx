import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../lib/hooks'

/* ============================================================
   Shared reveal primitives.
   Everything animates transform + opacity only — no layout properties —
   so these stay on the compositor.
   ============================================================ */

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const

/** Masked line-by-line rise. The site's primary type entrance. */
export function Lines({
  lines,
  className = '',
  delay = 0,
  stagger = 0.075,
  as: Tag = 'span',
}: {
  lines: readonly string[]
  className?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p'
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((l) => (
          <span className="line-mask" key={l}>
            {l}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="line-mask" key={line}>
          <motion.span
            style={{ display: 'block', willChange: 'transform' }}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.95,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Word-level stagger, for body copy that deserves emphasis. */
export function Words({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <p className={className}>{text}</p>

  const words = text.split(' ')

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.016, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
          variants={
            {
              hidden: { opacity: 0, y: '0.42em' },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            } satisfies Variants
          }
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.p>
  )
}

/**
 * Generic rise-in for blocks.
 *
 * `as` matters: this component becomes the real element, so it can sit
 * directly in a grid or a list without an extra wrapper div breaking
 * placement or list semantics.
 */
export function Rise({
  children,
  delay = 0,
  y = 26,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'section'
}) {
  const reduce = useReducedMotion()
  const Tag = as
  const MotionTag = motion[as]

  if (reduce) return <Tag className={className}>{children}</Tag>

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/** A hairline that draws itself in. Used to separate sections. */
export function Rule({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      style={{
        height: 1,
        background: 'var(--rule)',
        transformOrigin: 'left center',
        willChange: 'transform',
      }}
      initial={reduce ? undefined : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
