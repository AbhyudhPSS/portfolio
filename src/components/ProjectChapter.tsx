import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import type { Project } from '../data/site'
import { Artifact } from './artifacts/Artifacts'
import { Lines, Rise } from './Reveal'
import { useMedia, useReducedMotion } from '../lib/hooks'
import './ProjectChapter.css'

/**
 * Characters per thesis line in the single-column layout.
 *
 * On phones the thesis is sized to the column (tokens.css, --t-lg), so the
 * column always holds ~22 characters of it whatever the phone; 20 leaves
 * room for a line heavy in wide letters. On tablets the 22ch cap is the
 * limit instead, and it holds ~27.
 */
const PHONE_LINE = 20
const TABLET_LINE = 24

export function ProjectChapter({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const phone = useMedia('(max-width: 600px)')
  const tablet = useMedia('(max-width: 1000px)')

  // Animate the artifact only while it is actually on screen.
  const live = useInView(artRef, { once: false, margin: '-8% 0px -8% 0px' })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const artY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])
  const numY = useTransform(scrollYProgress, [0, 1], ['16%', '-16%'])

  return (
    <article
      ref={ref}
      id={`project-${project.id}`}
      className="chapter"
      style={{ '--art-accent': project.accent } as React.CSSProperties}
      aria-labelledby={`h-${project.id}`}
    >
      <div className="shell chapter__grid">
        {/* --- Identity column (sticky on desktop) --- */}
        <header className="chapter__id">
          <motion.span
            className="chapter__number"
            aria-hidden="true"
            style={reduce ? undefined : { y: numY }}
          >
            {project.index}
          </motion.span>

          <h3 id={`h-${project.id}`} className="chapter__name display">
            {project.name}
          </h3>

          <p className="chapter__kind mono">{project.kind}</p>

          <dl className="chapter__vitals">
            <div>
              <dt className="mono">Built</dt>
              <dd className="mono">{project.year}</dd>
            </div>
            <div>
              <dt className="mono">Status</dt>
              <dd className="mono chapter__status">{project.status}</dd>
            </div>
          </dl>

          {project.link && (
            <a
              className="chapter__link mono hit"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
            >
              View project <span aria-hidden="true">↗</span>
            </a>
          )}
        </header>

        {/* --- Content column --- */}
        <div className="chapter__body">
          <Lines
            as="h4"
            className="chapter__thesis display"
            lines={
              phone
                ? balanceLines(project.thesis, PHONE_LINE)
                : tablet
                  ? balanceLines(project.thesis, TABLET_LINE)
                  : splitThesis(project.thesis)
            }
            stagger={0.06}
          />

          <motion.div
            ref={artRef}
            className={`chapter__art ${live ? 'is-live' : ''}`}
            style={reduce ? undefined : { y: artY }}
          >
            <Artifact kind={project.artifact} />
          </motion.div>

          <div className="chapter__prose">
            <Rise>
              <p>{project.body}</p>
            </Rise>
          </div>

          <div className="chapter__facts">
            {project.facts.map((f, i) => (
              <Rise key={f.k} delay={i * 0.05} y={14} className="chapter__fact">
                <span className="mono chapter__fact-k">{f.k}</span>
                <span className="chapter__fact-v">{f.v}</span>
              </Rise>
            ))}
          </div>

          <Rise>
            <ul className="chapter__stack">
              {project.stack.map((s) => (
                <li key={s} className="tag chapter__chip">
                  {s}
                </li>
              ))}
            </ul>
          </Rise>

          {project.note && (
            <Rise>
              <p className="chapter__note">
                <span className="chapter__note-mark" aria-hidden="true" />
                {project.note}
              </p>
            </Rise>
          )}
        </div>
      </div>
    </article>
  )
}

/** Break a thesis into 2–3 display lines without orphaning a single word. */
function splitThesis(text: string): string[] {
  const words = text.split(' ')
  const per = Math.ceil(words.length / (words.length > 9 ? 3 : 2))
  const out: string[] = []
  for (let i = 0; i < words.length; i += per) {
    out.push(words.slice(i, i + per).join(' '))
  }
  return out
}

/**
 * Break text into lines of at most `max` characters, spread as evenly as
 * that line count allows — so the last line is never a stranded word.
 *
 * Greedy filling finds how many lines are needed; the narrowest width that
 * still fits in that many lines is then the balanced one.
 */
function balanceLines(text: string, max: number): string[] {
  const words = text.split(' ')

  const fill = (width: number) => {
    const out: string[] = []
    for (const w of words) {
      const last = out.length - 1
      if (last >= 0 && out[last].length + 1 + w.length <= width) {
        out[last] += ` ${w}`
      } else {
        out.push(w)
      }
    }
    return out
  }

  const count = fill(max).length
  for (let width = Math.ceil(text.length / count); width < max; width++) {
    const lines = fill(width)
    if (lines.length <= count) return lines
  }
  return fill(max)
}
