import { useEffect, useState } from 'react'

/** Live subscription to a media query. */
export function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])

  return matches
}

export const useReducedMotion = () =>
  useMedia('(prefers-reduced-motion: reduce)')

/** True for pointer devices that can actually hover — gates the custom cursor. */
export const useFinePointer = () =>
  useMedia('(hover: hover) and (pointer: fine)')

/** Live clock in a fixed IANA timezone. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}

/**
 * Reports which [data-surface] section is under the top of the viewport, so
 * the fixed chrome (nav, cursor) can invert with it.
 *
 * Uses a zero-height IntersectionObserver band rather than hit-testing on
 * scroll — elementsFromPoint forces layout on every scroll event.
 */
export function useActiveSurface(bandTop = 64) {
  const [surface, setSurface] = useState<'paper' | 'void'>('paper')

  useEffect(() => {
    const els = [...document.querySelectorAll('[data-surface]')].filter(
      (el) => !el.closest('.nav') && !el.closest('.cursor'),
    )
    if (!els.length) return

    const hit = new Set<Element>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) hit.add(e.target)
          else hit.delete(e.target)
        }
        // Several may overlap (a pinned child inside its section). The last
        // in document order is the innermost, and therefore the visible one.
        let found: 'paper' | 'void' | null = null
        for (const el of els) {
          if (!hit.has(el)) continue
          const s = el.getAttribute('data-surface')
          if (s === 'paper' || s === 'void') found = s
        }
        if (found) setSurface(found)
      },
      { rootMargin: `-${bandTop}px 0px -100% 0px`, threshold: 0 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [bandTop])

  return surface
}

/** Tracks which section id is currently in view, for nav state. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    const visible = new Set<string>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        // Nothing in the band (e.g. the hero) means no section is active.
        const next = ids.find((id) => visible.has(id)) ?? ''
        setActive(next)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}
