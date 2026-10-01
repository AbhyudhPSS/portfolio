import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

/**
 * Custom cursor. Fine-pointer devices only, and never a replacement for the
 * real one — the native cursor stays visible so nothing becomes untrackable.
 * Position is written straight to a transform in a RAF loop, so it never
 * triggers React renders.
 */
export function Cursor({ surface }: { surface: 'paper' | 'void' }) {
  const dot = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'idle' | 'link' | 'view'>('idle')
  const [visible, setVisible] = useState(false)
  // Read inside the pointer handler without making the effect depend on it —
  // depending on `visible` would tear down the listeners and restart the
  // easing loop from the centre of the screen every time the pointer left
  // and re-entered the document.
  const visibleRef = useRef(false)

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let frame = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }

      const el = (e.target as HTMLElement)?.closest?.('[data-cursor]')
      const next = el?.getAttribute('data-cursor')
      setMode(next === 'view' ? 'view' : next === 'link' ? 'link' : 'idle')
    }

    const onLeave = () => {
      visibleRef.current = false
      setVisible(false)
    }

    const loop = () => {
      // Light easing so the ring trails the pointer slightly.
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    frame = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={dot}
      className="cursor"
      data-mode={mode}
      data-surface={surface}
      data-visible={visible}
      aria-hidden="true"
    >
      <span className="cursor__ring" />
      <span className="cursor__label">view</span>
    </div>
  )
}
