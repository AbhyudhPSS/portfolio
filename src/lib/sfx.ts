/**
 * Interface sound.
 *
 * Synthesised with WebAudio rather than shipping audio files: three short
 * tones, a few hundred bytes of code, no network cost. Off by default — sound
 * is opt-in, never opt-out, and never required to understand the interface.
 */

type Voice = 'tick' | 'move' | 'open'

const STORAGE_KEY = 'as.sound'

let ctx: AudioContext | null = null
let bus: GainNode | null = null
let enabled = false
let last = 0

export function initSfx(): boolean {
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    enabled = false
  }
  return enabled
}

export function isSfxOn() {
  return enabled
}

export function setSfx(on: boolean) {
  enabled = on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    /* storage unavailable — sound still works for this session */
  }
  if (on) {
    ensureCtx()
    void ctx?.resume()
    play('open')
  }
}

function ensureCtx() {
  if (ctx) return
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return
  ctx = new Ctor()
  bus = ctx.createGain()
  bus.gain.value = 0.055 // deliberately quiet
  bus.connect(ctx.destination)
}

const VOICES: Record<Voice, { f: number; to: number; d: number; type: OscillatorType }> = {
  tick: { f: 1180, to: 940, d: 0.035, type: 'triangle' },
  move: { f: 520, to: 660, d: 0.06, type: 'sine' },
  open: { f: 320, to: 720, d: 0.12, type: 'sine' },
}

export function play(voice: Voice) {
  if (!enabled) return
  // Rate-limit so rapid hovers cannot turn into a buzz.
  const now = performance.now()
  if (now - last < 45) return
  last = now

  ensureCtx()
  if (!ctx || !bus) return
  if (ctx.state === 'suspended') void ctx.resume()

  const v = VOICES[voice]
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = v.type
  osc.frequency.setValueAtTime(v.f, t)
  osc.frequency.exponentialRampToValueAtTime(v.to, t + v.d)

  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(1, t + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + v.d)

  osc.connect(gain).connect(bus)
  osc.start(t)
  osc.stop(t + v.d + 0.02)
}
