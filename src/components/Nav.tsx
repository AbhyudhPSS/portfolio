import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PERSON } from '../data/site'
import { SECTIONS } from '../data/nav'
import { useClock, useReducedMotion } from '../lib/hooks'
import { scrollToId } from '../lib/useLenis'
import { play } from '../lib/sfx'
import './Nav.css'

type Props = {
  active: string
  surface: 'paper' | 'void'
  sound: boolean
  onToggleSound: () => void
}

export function Nav({ active, surface, sound, onToggleSound }: Props) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const clock = useClock(PERSON.timezone)
  const reduce = useReducedMotion()
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  /* Hide the bar while scrolling down, restore on the way up. */
  useEffect(() => {
    let prev = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 300 && y > prev)
      prev = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * The open menu is a modal dialog, and has to behave like one: Escape
   * closes it, the page behind it does not scroll, focus moves into it and
   * cannot leave it by Tab, the rest of the document is hidden from
   * assistive technology, and focus returns to the control that opened it.
   */
  useEffect(() => {
    if (!open) return

    const opener = document.activeElement as HTMLElement | null
    const panel = menuRef.current
    const burger = burgerRef.current
    const buried = [
      document.getElementById('main'),
      document.querySelector('footer'),
    ].filter((el): el is HTMLElement => Boolean(el))

    const focusables = () =>
      panel
        ? [...panel.querySelectorAll<HTMLElement>('button, a[href]')].filter(
            (el) => !el.hasAttribute('disabled'),
          )
        : []

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      // Trap. The close control lives in the header, outside the panel, so
      // it is deliberately part of the cycle rather than skipped — and it
      // comes first, because that is where it sits in the document.
      const stops = [burger, ...focusables()].filter(
        (el): el is HTMLElement => Boolean(el),
      )
      if (!stops.length) return

      const first = stops[0]
      const last = stops[stops.length - 1]
      const here = document.activeElement

      if (!e.shiftKey && here === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && here === first) {
        e.preventDefault()
        last.focus()
      } else if (!stops.includes(here as HTMLElement)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    buried.forEach((el) => el.setAttribute('inert', ''))

    // Wait a frame: the panel animates in from a clipped state, and focusing
    // before it is laid out can scroll the page behind it.
    const id = requestAnimationFrame(() => focusables()[0]?.focus())

    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      buried.forEach((el) => el.removeAttribute('inert'))
      // Only pull focus back if it is still inside the panel we are closing —
      // clicking a menu item hands focus elsewhere on purpose.
      if (!panel || panel.contains(document.activeElement)) {
        ;(burger ?? opener)?.focus()
      }
    }
  }, [open])

  /* The menu is an overlay the surface observer never sees, so invert here. */
  const chrome = open ? 'void' : surface

  const go = (id: string) => {
    play('move')
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        className="nav"
        data-surface={chrome}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="nav__inner">
          <button
            type="button"
            className="nav__mark hit-lg"
            onClick={() => go('top')}
            data-cursor="link"
            aria-label={`${PERSON.name} — back to top`}
          >
            <span className="nav__mark-glyph" aria-hidden="true" />
            <span className="nav__mark-text">{PERSON.shortName}</span>
          </button>

          <nav className="nav__links" aria-label="Sections">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="nav__link"
                data-active={active === s.id}
                data-cursor="link"
                onMouseEnter={() => play('tick')}
                onClick={() => go(s.id)}
                aria-current={active === s.id ? 'true' : undefined}
              >
                <span className="nav__link-dot" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="nav__aside">
            <span className="nav__clock mono" aria-label={`Local time in ${PERSON.location}`}>
              {PERSON.location}
              <span className="nav__clock-sep" aria-hidden="true">/</span>
              <time>{clock || '--:--:--'}</time>
              <span className="nav__clock-tz">{PERSON.tzLabel}</span>
            </span>

            <button
              type="button"
              className="nav__sound"
              onClick={onToggleSound}
              aria-pressed={sound}
              data-cursor="link"
              title={sound ? 'Turn interface sound off' : 'Turn interface sound on'}
            >
              <span className="sr-only">
                Interface sound is {sound ? 'on' : 'off'}. Toggle.
              </span>
              <span className="nav__eq" data-on={sound} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>

            <button
              type="button"
              className="nav__burger"
              ref={burgerRef}
              onClick={() => {
                play('move')
                setOpen((v) => !v)
              }}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className="nav__burger-box" data-open={open} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            ref={menuRef}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-surface="void"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }
          >
            <ul className="menu__list">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="line-mask">
                  <motion.button
                    type="button"
                    className="menu__link display"
                    onClick={() => go(s.id)}
                    initial={reduce ? undefined : { y: '110%' }}
                    animate={reduce ? undefined : { y: '0%' }}
                    exit={reduce ? undefined : { y: '110%' }}
                    transition={{
                      duration: 0.6,
                      delay: reduce ? 0 : 0.1 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="menu__n mono">{`0${i + 1}`}</span>
                    {s.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <p className="menu__foot mono">
              {PERSON.location} · {clock} {PERSON.tzLabel}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
