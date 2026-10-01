import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/hooks'
import './AsciiPortrait.css'

/**
 * Renders a photo as a grid of monospace characters, density mapped from
 * luminance — a generative duotone portrait rather than a photograph, in
 * keeping with the rest of the site's schematic/technical artwork.
 *
 * Runs once per photo: downsample the source image onto a tiny canvas (the
 * browser's own image smoothing does the cell-averaging for free), read
 * that as the density map, then draw the character grid onto the visible
 * canvas at device pixel ratio for crisp text at any size.
 *
 * Source photos have a flat backdrop (a green-screen fill or a plain
 * white cutout background) rather than real alpha transparency, so the
 * backdrop is detected from the sampled grid's own corner cells and
 * excluded — otherwise a bright, uniform backdrop reads as "should be
 * dense ink" under the luminance mapping, the same as a lit part of the
 * subject, and fills the whole card with texture instead of clean space.
 */

const RAMP = ' .:-=+*#%@'
const COLS = 64
const BG_DIST = 46 // RGB Euclidean distance under which a cell counts as backdrop

function renderPortrait(img: HTMLImageElement, canvas: HTMLCanvasElement) {
  const rows = Math.round(COLS * (img.naturalHeight / img.naturalWidth))

  const sample = document.createElement('canvas')
  sample.width = COLS
  sample.height = rows
  const sctx = sample.getContext('2d')
  if (!sctx) return
  sctx.drawImage(img, 0, 0, COLS, rows)
  const { data } = sctx.getImageData(0, 0, COLS, rows)

  const at = (col: number, row: number) => {
    const i = (row * COLS + col) * 4
    return [data[i], data[i + 1], data[i + 2]] as const
  }

  // Backdrop colour: averaged from the four corner cells, which are
  // reliably background in a centred portrait crop.
  const corners = [at(0, 0), at(COLS - 1, 0), at(0, rows - 1), at(COLS - 1, rows - 1)]
  const bg = corners.reduce(
    (acc, [r, g, b]) => [acc[0] + r / 4, acc[1] + g / 4, acc[2] + b / 4],
    [0, 0, 0],
  )

  const canvasEl = canvas
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cell = 9
  const w = COLS * cell
  const h = rows * cell
  canvasEl.width = w * dpr
  canvasEl.height = h * dpr

  const ctx = canvasEl.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.font = `${cell + 1}px "JetBrains Mono", ui-monospace, monospace`

  const root = getComputedStyle(document.documentElement)
  const void_ = root.getPropertyValue('--void').trim() || '#131211'
  const acid = root.getPropertyValue('--acid').trim() || '#c8f751'
  ctx.fillStyle = void_
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = acid

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = (row * COLS + col) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3] / 255

      const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2])
      if (dist < BG_DIST) continue // backdrop — leave blank

      // Perceptual luminance, faded toward the background by alpha —
      // transparent source pixels (a genuine cut-out) also read as empty.
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) * a
      const idx = Math.min(RAMP.length - 1, Math.round((luminance / 255) * (RAMP.length - 1)))
      const ch = RAMP[idx]
      if (ch === ' ') continue
      ctx.fillText(ch, col * cell + cell / 2, row * cell + cell / 2 + 1)
    }
  }
}

type Status = 'loading' | 'ready' | 'error'
const CYCLE_MS = 6500
const FADE_MS = 260

export function AsciiPortrait({
  photos,
  alt,
  className = '',
}: {
  /** One or more source photos. Multiple photos cross-fade on a slow cycle. */
  photos: string[]
  alt: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  // Seeded true where there is no observer to wait on, so the fallback never
  // has to correct itself from inside the effect.
  const [near, setNear] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  )
  const [status, setStatus] = useState<Status>('loading')
  const [index, setIndex] = useState(0)
  const [dim, setDim] = useState(false)
  // Subscribed, not sampled once at first render — the preference can change
  // while the page is open, and everything else on this site honours that.
  const reduceMotion = useReducedMotion()
  const fadeTimer = useRef(0)

  const src = photos[index] ?? ''

  /**
   * Hold the source fetch until the portrait is near the viewport. This sits
   * well below the fold, and `new Image()` has no `loading="lazy"` to lean
   * on — without this the photo is pulled down during the first paint of a
   * page that will not show it for several screens.
   */
  useEffect(() => {
    const host = hostRef.current
    if (!host || near) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(host)
    return () => io.disconnect()
  }, [near])

  // Load + render whenever the active photo changes.
  useEffect(() => {
    if (!src || !near) return
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (cancelled) return
      const canvas = canvasRef.current
      if (canvas) renderPortrait(img, canvas)
      setStatus('ready')
      setDim(false)
    }
    img.onerror = () => !cancelled && setStatus('error')
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src, near])

  // Slow auto-cycle between poses. Off entirely under reduced motion —
  // the controls below still let someone switch photos by hand.
  useEffect(() => {
    if (photos.length < 2 || reduceMotion) return
    const id = window.setInterval(() => {
      setDim(true)
      fadeTimer.current = window.setTimeout(
        () => setIndex((i) => (i + 1) % photos.length),
        FADE_MS,
      )
    }, CYCLE_MS)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(fadeTimer.current)
    }
  }, [photos.length, reduceMotion])

  // Clear any in-flight fade on unmount, whichever started it.
  useEffect(() => () => window.clearTimeout(fadeTimer.current), [])

  const goTo = (i: number) => {
    if (i === index) return
    setDim(true)
    window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => setIndex(i), FADE_MS)
  }

  if (photos.length === 0 || status === 'error') {
    return (
      <div className={`portrait portrait--empty ${className}`} aria-hidden="true">
        <span className="portrait__empty-mark" />
        <span className="mono">photo pending</span>
      </div>
    )
  }

  return (
    <div className={className} ref={hostRef}>
      <div className="portrait" data-ready={status === 'ready'}>
        {/* Terminal chrome is decoration only — the canvas carries the alt text. */}
        <div className="portrait__bar" aria-hidden="true">
          <span className="portrait__lights">
            <i />
            <i />
            <i />
          </span>
          <span className="portrait__title mono">abhyudh — zsh</span>
        </div>

        <div className="portrait__screen">
          <p className="portrait__line mono" aria-hidden="true">
            <span className="portrait__prompt">~ %</span> cat portrait.txt
          </p>
          <div className="portrait__frame">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={alt}
              style={{ opacity: dim || status !== 'ready' ? 0 : 1 }}
            />
          </div>
          <p className="portrait__line mono" aria-hidden="true">
            <span className="portrait__prompt">~ %</span>
            <span className="portrait__caret" />
          </p>
        </div>
      </div>

      {photos.length > 1 && (
        /* Not a tablist: there are no tab panels, and the ARIA tabs pattern
           would promise arrow-key navigation this does not implement. These
           are what they look like — a small set of toggles, one active. */
        <div className="portrait__dots" role="group" aria-label="Choose photo">
          {photos.map((p, i) => (
            <button
              key={p}
              type="button"
              className="portrait__dot hit"
              aria-pressed={i === index}
              data-active={i === index}
              onClick={() => goTo(i)}
            >
              <span className="sr-only">Photo {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
