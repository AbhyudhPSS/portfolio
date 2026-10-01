import { useEffect } from 'react'
import type Lenis from 'lenis'

/**
 * Smooth scroll.
 *
 * Disabled entirely under prefers-reduced-motion, where native scrolling is
 * both faster and the correct behaviour. Everything scroll-driven on this site
 * reads `window.scrollY`, which Lenis keeps authoritative, so nothing else
 * needs to know this is running.
 *
 * The library is imported dynamically: it is never needed during the first
 * paint (it only starts once the boot panel has cleared), it is not needed at
 * all under reduced motion, and keeping it out of the entry chunk means the
 * page becomes interactive without waiting for it.
 */
/**
 * The live instance, if smooth scroll is running.
 *
 * Programmatic scrolling has to go through Lenis when Lenis is on: it drives
 * the scroll position from its own rAF loop, so a bare `window.scrollTo`
 * gets overwritten on the very next frame.
 */
let instance: Lenis | null = null

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    let lenis: Lenis | null = null
    let frame = 0
    let cancelled = false

    void import('lenis').then(({ default: Ctor }) => {
      if (cancelled) return

      lenis = new Ctor({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      })

      const raf = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
      instance = lenis
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
      if (instance === lenis) instance = null
    }
  }, [enabled])
}

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Scroll to an absolute document offset, with or without Lenis. */
export function scrollToY(top: number) {
  if (instance) {
    instance.scrollTo(top, { immediate: prefersReduced(), force: true })
    return
  }
  window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' })
}

/** Anchor navigation that works with or without Lenis. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = prefersReduced()
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
