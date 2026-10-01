import type { Project } from '../../data/site'
import { useMedia } from '../../lib/hooks'
import './artifacts.css'

/**
 * Original diagrammatic artwork, one per project.
 *
 * These are deliberately NOT mock product screenshots — nothing here claims to
 * be a shipped interface. Each is a schematic of what the project actually
 * does, drawn in the site's own language, and animated with CSS only.
 *
 * `compact` tracks the breakpoint where artifacts.css enlarges the label type
 * (--art-fs). The drawings are laid out for 11-unit labels; at 15–20 units a
 * few of them run a label into its neighbour or off the plate, so those few
 * re-seat the affected labels rather than shrinking the type back down.
 */
export function Artifact({ kind }: { kind: Project['artifact'] }) {
  const compact = useMedia('(max-width: 900px)')

  switch (kind) {
    case 'satya':
      return <Satya compact={compact} />
    case 'mangal':
      return <Mangal />
    case 'minti':
      return <Minti />
    case 'lumo':
      return <Lumo />
    case 'vision':
      return <Vision compact={compact} />
    case 'sentinel':
      return <Sentinel />
    case 'chemverse':
      return <Chemverse />
    case 'secureecom':
      return <SecureEcom />
    case 'voicecar':
      return <VoiceCar />
    case 'soilmonitor':
      return <SoilMonitor compact={compact} />
    case 'dhankhedi':
      return <DhanKhedi />
    case 'sakha':
      return <Sakha compact={compact} />
  }
}

type Fit = { compact: boolean }

const VB = '0 0 640 440'

/* ============================================================
   01 — SATYA: a claim, and what the evidence does to it
   ============================================================ */
function Satya({ compact }: Fit) {
  // Compact: the evidence pills start further left and run wider, so the
  // longest label ("unverifiable") and its score both fit at 20-unit type.
  const px = compact ? 300 : 430
  const pw = compact ? 300 : 168

  const nodes = [
    { y: 70, c: '0.91', label: 'corroborates', dash: false },
    { y: 165, c: '0.64', label: 'partial', dash: true },
    { y: 260, c: '0.22', label: 'contradicts', dash: true },
    { y: 355, c: '0.48', label: 'unverifiable', dash: true },
  ]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a single claim tested against four retrieved sources, each returning a different confidence signal.">
      <Frame />
      {/* claim block */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <rect x="42" y="168" width="150" height="104" rx="4" className="art-fill-soft" />
        <rect x="42" y="168" width="150" height="104" rx="4" className="art-stroke" />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="60"
            y={192 + i * 18}
            width={i === 2 ? 66 : 114}
            height="6"
            rx="3"
            className="art-fill-ink"
            opacity={0.55 - i * 0.12}
          />
        ))}
        <text x="42" y="158" className="art-label">claim</text>
      </g>

      {/* connections */}
      {nodes.map((n, i) => (
        <path
          key={`p${i}`}
          d={
            compact
              ? `M192 220 C 240 220, 250 ${n.y}, ${px} ${n.y}`
              : `M192 220 C 290 220, 330 ${n.y}, ${px} ${n.y}`
          }
          className={`art-stroke art-draw ${n.dash ? 'art-dash' : ''}`}
          style={{ '--d': `${0.2 + i * 0.07}s` } as React.CSSProperties}
          fill="none"
        />
      ))}

      {/* evidence nodes */}
      {nodes.map((n, i) => (
        <g
          key={`n${i}`}
          className="art-fade"
          style={{ '--d': `${0.55 + i * 0.07}s` } as React.CSSProperties}
        >
          <rect x={px} y={n.y - 17} width={pw} height="34" rx="17" className="art-fill-bg" />
          <rect x={px} y={n.y - 17} width={pw} height="34" rx="17" className="art-stroke" />
          <circle
            cx={px + 19}
            cy={n.y}
            r="4"
            className={i === 2 ? 'art-fill-accent art-blink' : 'art-fill-accent'}
          />
          <text x={px + 33} y={n.y + 4} className="art-label art-label--node">{n.label}</text>
          <text x={px + pw - 12} y={n.y + 4} className="art-num" textAnchor="end">{n.c}</text>
        </g>
      ))}

      <text x={px} y="40" className="art-label">retrieved evidence</text>
      <text x="42" y="412" className="art-label art-label--dim">
        output = the reasoning, not a verdict
      </text>
    </svg>
  )
}

/* ============================================================
   02 — MANGAL: wake word, then local processing
   ============================================================ */
function Mangal() {
  // Deterministic envelope — a spoken word, not random noise.
  const bars = [
    4, 7, 5, 11, 18, 26, 21, 34, 46, 38, 52, 68, 57, 74, 88, 70, 92, 79, 61, 84,
    66, 48, 57, 40, 31, 44, 28, 19, 24, 13, 17, 9, 12, 6, 8, 4,
  ]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a wake word captured as a waveform, processed on-device inside a closed boundary.">
      <Frame />

      {/* the local boundary — nothing crosses it */}
      <rect x="40" y="58" width="560" height="324" rx="6" className="art-stroke art-dash" fill="none" />
      <text x="52" y="48" className="art-label">on-device boundary</text>

      {/* listening ring */}
      <g>
        <circle cx="320" cy="220" r="96" className="art-stroke" fill="none" opacity="0.28" />
        <circle cx="320" cy="220" r="96" className="art-stroke-accent art-ring" fill="none" />
        <circle cx="320" cy="220" r="130" className="art-stroke-accent art-ring art-ring--2" fill="none" />
      </g>

      {/* waveform */}
      <g className="art-wave">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={140 + i * 10}
            y={220 - h / 2}
            width="4"
            height={h}
            rx="2"
            className={i > 12 && i < 24 ? 'art-fill-accent' : 'art-fill-ink'}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
      </g>

      <text x="40" y="412" className="art-label art-label--dim">wake → listen → act</text>
      <text x="600" y="412" className="art-num" textAnchor="end">0 cloud calls</text>
    </svg>
  )
}

/* ============================================================
   03 — MINTI: a simulated market with no real money in it
   ============================================================ */
function Minti() {
  const pts = [
    [60, 300], [110, 276], [160, 292], [210, 238], [260, 254],
    [310, 196], [360, 214], [410, 150], [460, 172], [510, 116], [575, 92],
  ]
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')
  const bars = [46, 62, 38, 78, 54, 88, 70, 96]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a simulated portfolio curve rising over a grid, labelled as practice capital rather than real money.">
      <Frame />

      {/* grid */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="40" y1={92 + i * 52} x2="600" y2={92 + i * 52} className="art-stroke" />
        ))}
      </g>

      {/* volume bars */}
      <g className="art-fade" style={{ '--d': '0.5s' } as React.CSSProperties}>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={62 + i * 66}
            y={348 - h}
            width="20"
            height={h}
            rx="2"
            className="art-fill-ink"
            opacity="0.2"
          />
        ))}
      </g>

      {/* the curve */}
      <path d={line} className="art-stroke-accent art-draw art-draw--slow" fill="none" style={{ '--d': '0.2s' } as React.CSSProperties} />

      {/* markers */}
      {[pts[3], pts[7], pts[10]].map((p, i) => (
        <g key={i} className="art-fade" style={{ '--d': `${1 + i * 0.16}s` } as React.CSSProperties}>
          <circle cx={p[0]} cy={p[1]} r="5" className="art-fill-bg" />
          <circle cx={p[0]} cy={p[1]} r="5" className="art-stroke-accent" fill="none" />
        </g>
      ))}

      <text x="40" y="76" className="art-label">simulated portfolio</text>
      <text x="40" y="412" className="art-label art-label--dim">practice capital · nothing real at risk</text>
      <text x="600" y="76" className="art-num" textAnchor="end">₹ 0.00 exposure</text>
    </svg>
  )
}

/* ============================================================
   04 — LUMO: one object, one job (drawn as an ID sketch)
   ============================================================ */
function Lumo() {
  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: an industrial-design style elevation of a single dedicated device with one indicator light and no feed.">
      <Frame />

      {/* dimension lines — industrial drawing language */}
      <g className="art-fade" style={{ '--d': '0.7s' } as React.CSSProperties}>
        <line x1="236" y1="70" x2="236" y2="370" className="art-stroke" opacity="0.4" />
        <line x1="228" y1="70" x2="244" y2="70" className="art-stroke" opacity="0.4" />
        <line x1="228" y1="370" x2="244" y2="370" className="art-stroke" opacity="0.4" />
        <text x="222" y="224" className="art-num" textAnchor="end">h</text>

        <line x1="266" y1="392" x2="434" y2="392" className="art-stroke" opacity="0.4" />
        <line x1="266" y1="384" x2="266" y2="400" className="art-stroke" opacity="0.4" />
        <line x1="434" y1="384" x2="434" y2="400" className="art-stroke" opacity="0.4" />
        <text x="350" y="414" className="art-num" textAnchor="middle">w</text>
      </g>

      {/* device body */}
      <g className="art-fade" style={{ '--d': '0.15s' } as React.CSSProperties}>
        <rect x="266" y="70" width="168" height="300" rx="46" className="art-fill-soft" />
        <rect x="266" y="70" width="168" height="300" rx="46" className="art-stroke" />
        <rect x="282" y="86" width="136" height="268" rx="34" className="art-stroke" opacity="0.35" fill="none" />
      </g>

      {/* the single light */}
      <g>
        <circle cx="350" cy="220" r="30" className="art-stroke-accent art-ring" fill="none" />
        <circle cx="350" cy="220" r="9" className="art-fill-accent art-breathe" />
      </g>

      {/* callouts */}
      <g className="art-fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
        <line x1="434" y1="150" x2="520" y2="150" className="art-stroke" opacity="0.5" />
        <circle cx="434" cy="150" r="2.5" className="art-fill-ink" />
        <text x="528" y="154" className="art-label art-label--node">no feed</text>

        <line x1="266" y1="290" x2="180" y2="290" className="art-stroke" opacity="0.5" />
        <circle cx="266" cy="290" r="2.5" className="art-fill-ink" />
        <text x="172" y="294" className="art-label art-label--node" textAnchor="end">one job</text>
      </g>

      <text x="40" y="48" className="art-label">elevation · concept</text>
    </svg>
  )
}

/* ============================================================
   05 — VISION: what the robot is actually seeing
   ============================================================ */
function Vision({ compact }: Fit) {
  const boxes = [
    { x: 96, y: 118, w: 148, h: 118, label: 'bottle', c: '0.94' },
    { x: 296, y: 196, w: 118, h: 96, label: 'wrapper', c: '0.71' },
    { x: 446, y: 132, w: 108, h: 86, label: '?', c: '0.38' },
  ]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a camera viewport with three detection boxes at different confidence levels, one unresolved.">
      <Frame />

      {/* viewport grid */}
      <g opacity="0.22">
        {[1, 2].map((i) => (
          <line key={`v${i}`} x1={40 + (560 / 3) * i} y1="58" x2={40 + (560 / 3) * i} y2="382" className="art-stroke" />
        ))}
        {[1, 2].map((i) => (
          <line key={`h${i}`} x1="40" y1={58 + (324 / 3) * i} x2="600" y2={58 + (324 / 3) * i} className="art-stroke" />
        ))}
      </g>

      {/* corner brackets */}
      {[
        'M40 90 L40 58 L72 58', 'M568 58 L600 58 L600 90',
        'M600 350 L600 382 L568 382', 'M72 382 L40 382 L40 350',
      ].map((d, i) => (
        <path key={i} d={d} className="art-stroke-accent" fill="none" strokeWidth="2" />
      ))}

      {/* scan line */}
      <line x1="40" y1="58" x2="600" y2="58" className="art-stroke-accent art-scan" opacity="0.6" />

      {/* detections */}
      {boxes.map((b, i) => (
        <g key={i} className="art-fade" style={{ '--d': `${0.4 + i * 0.18}s` } as React.CSSProperties}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} className={i === 2 ? 'art-stroke art-dash' : 'art-stroke-accent'} fill="none" />
          <rect x={b.x} y={b.y - 10} width="4" height="10" className="art-fill-accent" opacity={i === 2 ? 0.4 : 1} />
          <text x={b.x + 11} y={b.y - 9} className="art-label art-label--node">{b.label}</text>
          {/* Compact: the score moves inside the box's lower corner — above
              it, "wrapper" and its score no longer fit side by side. */}
          <text
            x={compact ? b.x + b.w - 8 : b.x + b.w}
            y={compact ? b.y + b.h - 10 : b.y - 9}
            className="art-num"
            textAnchor="end"
          >
            {b.c}
          </text>
        </g>
      ))}

      {/* crosshair */}
      <g opacity="0.55">
        <circle cx="320" cy="220" r="14" className="art-stroke" fill="none" />
        <line x1="320" y1="200" x2="320" y2="240" className="art-stroke" />
        <line x1="300" y1="220" x2="340" y2="220" className="art-stroke" />
      </g>

      <text x="40" y="48" className="art-label">camera 01 · live</text>
      <text x="600" y="412" className="art-label art-label--dim" textAnchor="end">
        one detection is still wrong
      </text>
    </svg>
  )
}

/* ============================================================
   06 — SENTINEL: a message, and the boundary around it
   ============================================================ */
function Sentinel() {
  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: two chat bubbles linked by an encrypted channel, with a dashed boundary showing that surrounding metadata sits inside the encryption too.">
      <Frame />

      {/* the boundary that most chat apps leave outside encryption */}
      <rect x="60" y="76" width="520" height="288" rx="6" className="art-stroke art-dash" fill="none" />
      <text x="72" y="66" className="art-label">metadata boundary — also encrypted</text>

      {/* sender bubble */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <rect x="96" y="176" width="150" height="88" rx="14" className="art-fill-soft" />
        <rect x="96" y="176" width="150" height="88" rx="14" className="art-stroke" />
        {[0, 1].map((i) => (
          <rect key={i} x="116" y={204 + i * 18} width={i ? 76 : 110} height="6" rx="3" className="art-fill-ink" opacity={0.5 - i * 0.1} />
        ))}
        <text x="96" y="166" className="art-label">you</text>
      </g>

      {/* recipient bubble */}
      <g className="art-fade" style={{ '--d': '0.2s' } as React.CSSProperties}>
        <rect x="394" y="176" width="150" height="88" rx="14" className="art-fill-soft" />
        <rect x="394" y="176" width="150" height="88" rx="14" className="art-stroke" />
        {[0, 1].map((i) => (
          <rect key={i} x="414" y={204 + i * 18} width={i ? 66 : 108} height="6" rx="3" className="art-fill-ink" opacity={0.5 - i * 0.1} />
        ))}
        <text x="544" y="166" className="art-label" textAnchor="end">them</text>
      </g>

      {/* encrypted channel */}
      <path d="M246 220 C 280 220, 280 220, 320 220 C 360 220, 360 220, 394 220" className="art-stroke-accent art-draw" fill="none" style={{ '--d': '0.4s' } as React.CSSProperties} />

      {/* padlock */}
      <g className="art-fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
        <path d="M308 206 a12 12 0 0 1 24 0 v8 h-24 z" className="art-stroke-accent" fill="none" />
        <rect x="302" y="214" width="36" height="26" rx="4" className="art-fill-bg" />
        <rect x="302" y="214" width="36" height="26" rx="4" className="art-stroke-accent" fill="none" />
        <circle cx="320" cy="227" r="3" className="art-fill-accent" />
      </g>

      <text x="60" y="412" className="art-label art-label--dim">libsodium · x3dh + double ratchet</text>
    </svg>
  )
}

/* ============================================================
   07 — CHEMVERSE: an atom, taken apart and labelled
   ============================================================ */
function Chemverse() {
  const inner = [90, 270]
  const outer = [30, 90, 150, 210, 270, 330]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a Bohr model of the oxygen atom, nucleus at the centre with electrons orbiting in two labelled shells.">
      <Frame />

      <circle cx="320" cy="220" r="72" className="art-stroke" fill="none" opacity="0.4" />
      <circle cx="320" cy="220" r="132" className="art-stroke-accent" fill="none" opacity="0.55" />

      <text x="320" y="140" className="art-label" textAnchor="middle">k-shell</text>
      <text x="320" y="76" className="art-label" textAnchor="middle">l-shell</text>

      {/* nucleus */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <circle cx="320" cy="220" r="26" className="art-fill-soft" />
        <circle cx="320" cy="220" r="26" className="art-stroke" fill="none" />
        <text x="320" y="225" className="art-num" textAnchor="middle">8p · 8n</text>
      </g>

      {/* K-shell electrons */}
      {inner.map((deg, i) => {
        const r = (deg * Math.PI) / 180
        const x = 320 + 72 * Math.cos(r)
        const y = 220 + 72 * Math.sin(r)
        return (
          <circle
            key={`k${i}`}
            cx={x}
            cy={y}
            r="6"
            className="art-fill-accent art-fade"
            style={{ '--d': `${0.5 + i * 0.1}s` } as React.CSSProperties}
          />
        )
      })}

      {/* L-shell electrons */}
      {outer.map((deg, i) => {
        const r = (deg * Math.PI) / 180
        const x = 320 + 132 * Math.cos(r)
        const y = 220 + 132 * Math.sin(r)
        return (
          <circle
            key={`l${i}`}
            cx={x}
            cy={y}
            r="5"
            className="art-fill-ink art-fade"
            style={{ '--d': `${0.75 + i * 0.08}s` } as React.CSSProperties}
          />
        )
      })}

      <text x="40" y="412" className="art-label art-label--dim">O · atomic number 8 · 1s² 2s² 2p⁴</text>

      {/* live demo tag */}
      <g className="art-fade" style={{ '--d': '1.3s' } as React.CSSProperties}>
        <path d="M566 400 l10 6 l-10 6 z" className="art-fill-accent" />
        <text x="558" y="408" className="art-label art-label--node" textAnchor="end">live demo</text>
      </g>
    </svg>
  )
}

/* ============================================================
   08 — SECURE ECOM: a purchase, with no name attached
   ============================================================ */
function SecureEcom() {
  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a shopping bag connected through an encrypted, padlocked channel to an anonymous, masked buyer.">
      <Frame />

      {/* bag */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <path d="M104 190 h96 l10 130 h-116 z" className="art-fill-soft" />
        <path d="M104 190 h96 l10 130 h-116 z" className="art-stroke" fill="none" />
        <path d="M124 190 v-16 a28 28 0 0 1 56 0 v16" className="art-stroke" fill="none" />
        <text x="96" y="180" className="art-label">buyer</text>
      </g>

      {/* channel */}
      <path d="M226 240 C 300 240, 300 220, 340 220 C 380 220, 400 220, 424 220" className="art-stroke-accent art-draw" fill="none" style={{ '--d': '0.35s' } as React.CSSProperties} />

      <g className="art-fade" style={{ '--d': '0.85s' } as React.CSSProperties}>
        <path d="M312 204 a12 12 0 0 1 24 0 v8 h-24 z" className="art-stroke-accent" fill="none" />
        <rect x="306" y="212" width="36" height="26" rx="4" className="art-fill-bg" />
        <rect x="306" y="212" width="36" height="26" rx="4" className="art-stroke-accent" fill="none" />
      </g>

      {/* masked identity */}
      <g className="art-fade" style={{ '--d': '0.2s' } as React.CSSProperties}>
        <circle cx="472" cy="200" r="34" className="art-fill-soft" />
        <circle cx="472" cy="200" r="34" className="art-stroke" fill="none" />
        <text x="472" y="209" className="art-num" textAnchor="middle" style={{ fontSize: 22 } as React.CSSProperties}>?</text>
        <text x="472" y="252" className="art-label" textAnchor="middle">identity</text>
      </g>

      <text x="60" y="412" className="art-label art-label--dim">no name required to check out</text>
    </svg>
  )
}

/* ============================================================
   09 — VOICE-CONTROLLED CAR: a command, sent over the air
   ============================================================ */
function VoiceCar() {
  const bars = [10, 18, 28, 20, 14, 24, 16, 8]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a spoken voice command travelling over Bluetooth to a small car, with directional arrows showing the resulting movement.">
      <Frame />

      {/* voice input — transform-origin overridden per bar: the shared
          .art-wave rule assumes a cy of 220 (Mangal's waveform centre),
          but this one sits at 160 */}
      <g className="art-wave">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={110 + i * 12}
            y={160 - h / 2}
            width="5"
            height={h}
            rx="2"
            className="art-fill-ink"
            style={{ '--i': i, transformOrigin: `${113 + i * 12}px 160px` } as React.CSSProperties}
          />
        ))}
      </g>
      <text x="110" y="196" className="art-label">voice command</text>

      {/* bluetooth glyph */}
      <g className="art-fade" style={{ '--d': '0.3s' } as React.CSSProperties}>
        <path
          d="M320 130 v100 l30 -26 -46 -36 46 -36 -30 -26 z"
          className="art-stroke-accent"
          fill="none"
          strokeLinejoin="round"
        />
        <text x="320" y="112" className="art-label" textAnchor="middle">bluetooth</text>
      </g>

      <path d="M260 160 C 285 150, 300 145, 314 145" className="art-stroke art-draw art-dash" fill="none" style={{ '--d': '0.5s' } as React.CSSProperties} />
      <path d="M320 240 C 320 260, 320 270, 320 284" className="art-stroke art-draw" fill="none" style={{ '--d': '0.7s' } as React.CSSProperties} />

      {/* car */}
      <g className="art-fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
        <path d="M220 320 l14 -34 h172 l14 34 z" className="art-fill-soft" />
        <path d="M220 320 l14 -34 h172 l14 34 z" className="art-stroke" fill="none" />
        <circle cx="256" cy="324" r="16" className="art-fill-bg" />
        <circle cx="256" cy="324" r="16" className="art-stroke" fill="none" />
        <circle cx="384" cy="324" r="16" className="art-fill-bg" />
        <circle cx="384" cy="324" r="16" className="art-stroke" fill="none" />
      </g>

      {/* direction arrows */}
      <g className="art-fade" style={{ '--d': '1.1s' } as React.CSSProperties} opacity="0.7">
        <path d="M320 350 l8 12 h-16 z" className="art-fill-accent" />
        <path d="M460 260 l-12 8 v-16 z" className="art-fill-accent" />
        <text x="470" y="264" className="art-label art-label--node">turn</text>
      </g>

      <text x="60" y="412" className="art-label art-label--dim">first working robot</text>
    </svg>
  )
}

/* ============================================================
   10 — SOIL MONITORING: a probe, reading the ground
   ============================================================ */
function SoilMonitor({ compact }: Fit) {
  const readings = [30, 42, 38, 50, 46, 58, 52, 60]
  const dots = [
    [90, 260], [150, 280], [210, 258], [270, 288], [330, 264],
    [90, 320], [160, 336], [230, 314], [300, 340], [200, 300],
  ]

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a soil probe inserted into the ground beside a chart of moisture readings over time.">
      <Frame />

      {/* ground */}
      <line x1="40" y1="230" x2="380" y2="230" className="art-stroke" opacity="0.6" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" className="art-fill-ink" opacity="0.35" />
      ))}
      <text x="40" y="220" className="art-label">surface</text>

      {/* probe */}
      <g className="art-fade" style={{ '--d': '0.15s' } as React.CSSProperties}>
        <line x1="200" y1="150" x2="200" y2="330" className="art-stroke-accent" strokeWidth="2" />
        <rect x="188" y="322" width="24" height="18" rx="3" className="art-fill-accent" />
        <text x="200" y="140" className="art-label" textAnchor="middle">probe</text>
      </g>

      {/* readout */}
      <g className="art-fade" style={{ '--d': '0.5s' } as React.CSSProperties}>
        {compact ? (
          // One line runs off the plate at 20-unit type; two stay over the chart.
          <text className="art-label">
            <tspan x="440" y="76">readings</tspan>
            <tspan x="440" y="100">over time</tspan>
          </text>
        ) : (
          <text x="440" y="100" className="art-label">readings over time</text>
        )}
        {readings.map((h, i) => (
          <rect
            key={i}
            x={430 + i * 20}
            y={200 - h}
            width="12"
            height={h}
            rx="2"
            className="art-fill-ink"
            opacity="0.22"
          />
        ))}
        <rect x={430 + 5 * 20} y={200 - readings[5]} width="12" height={readings[5]} rx="2" className="art-fill-accent" />
      </g>

      <text x="40" y="412" className="art-label art-label--dim">soil moisture + other sensors</text>
    </svg>
  )
}

/* ============================================================
   11 — DHAN KHEDI: a room, made to act like a silo
   ============================================================ */
function DhanKhedi() {
  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a storage room with produce crates and a temperature gauge, connected to a price tag showing the goal of a better sale price.">
      <Frame />

      {/* room */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <rect x="120" y="90" width="230" height="240" className="art-fill-soft" />
        <rect x="120" y="90" width="230" height="240" className="art-stroke" fill="none" strokeWidth="2" />
        <text x="120" y="80" className="art-label">storage room, not a silo</text>
      </g>

      {/* crates */}
      <g className="art-fade" style={{ '--d': '0.4s' } as React.CSSProperties}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={160 + i * 46} y="260" width="36" height="34" rx="3" className="art-stroke" fill="none" />
        ))}
      </g>

      {/* thermometer */}
      <g className="art-fade" style={{ '--d': '0.2s' } as React.CSSProperties}>
        <line x1="300" y1="130" x2="300" y2="210" className="art-stroke-accent" strokeWidth="3" />
        <circle cx="300" cy="222" r="10" className="art-fill-accent art-breathe" />
        <text x="270" y="122" className="art-label art-label--node" textAnchor="end">temp + conditions</text>
      </g>

      {/* connector to price */}
      <path d="M350 210 C 400 210, 420 210, 440 210" className="art-stroke art-draw art-dash" fill="none" style={{ '--d': '0.7s' } as React.CSSProperties} />

      {/* price tag */}
      <g className="art-fade" style={{ '--d': '1s' } as React.CSSProperties}>
        <path d="M460 190 h60 l30 30 -30 30 h-60 z" className="art-fill-bg" />
        <path d="M460 190 h60 l30 30 -30 30 h-60 z" className="art-stroke-accent" fill="none" />
        <circle cx="474" cy="220" r="4" className="art-fill-accent" />
        <text x="500" y="225" className="art-label art-label--node" textAnchor="middle">₹</text>
      </g>

      <text x="40" y="412" className="art-label art-label--dim">no budget for a silo</text>
    </svg>
  )
}

/* ============================================================
   12 — SAKHA: a stick that measures the danger, not just flags it
   ============================================================ */
function Sakha({ compact }: Fit) {
  // Ascending radius ↔ ascending distance — the ring nearest the sensor is
  // the nearest reading. Swept as a forward-facing ±30° cone rather than a
  // quarter circle, so nothing points up into the "ultrasonic" label, and
  // capped low enough to stay inside the frame.
  const cx = 170
  const cy = 132
  const rings = [26, 48, 70]
  const labels = ['10cm', '20cm', '30cm']

  const arc = (r: number) => {
    const rad = (30 * Math.PI) / 180
    const x = cx + r * Math.cos(rad)
    const yTop = cy - r * Math.sin(rad)
    const yBot = cy + r * Math.sin(rad)
    return `M${x.toFixed(1)} ${yTop.toFixed(1)} A${r} ${r} 0 0 1 ${x.toFixed(1)} ${yBot.toFixed(1)}`
  }

  return (
    <svg className="art" viewBox={VB} role="img" aria-label="Schematic: a walking stick emitting ultrasonic pulses toward an obstacle, with the vibration and buzzer feedback intensifying as the distance closes, and a piezoelectric element marked as still in prototype.">
      <Frame />

      {/* stick */}
      <g className="art-fade" style={{ '--d': '0.1s' } as React.CSSProperties}>
        <line x1={cx} y1={cy + 20} x2={cx} y2="360" className="art-stroke" strokeWidth="3" />
        <circle cx={cx} cy={cy} r="10" className="art-fill-accent" />
        <text x={cx - 18} y={cy + 4} className="art-label" textAnchor="end">ultrasonic</text>
      </g>

      {/* sonar cone, closing in on the obstacle */}
      {rings.map((r, i) => (
        <path
          key={i}
          d={arc(r)}
          className="art-stroke-accent art-draw"
          fill="none"
          style={{ '--d': `${0.3 + i * 0.2}s` } as React.CSSProperties}
        />
      ))}

      {/* distance index, stacked clear of the cone */}
      <g className="art-fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
        {rings.map((_, i) => (
          <text
            key={i}
            x={cx + rings[2] + 26}
            y={compact ? cy - 26 + i * 24 : cy - 22 + i * 20}
            className="art-num"
          >
            {labels[i]}
          </text>
        ))}
      </g>

      {/* obstacle */}
      <g className="art-fade" style={{ '--d': '0.9s' } as React.CSSProperties}>
        <rect x="420" y="60" width="16" height="180" className="art-fill-ink" opacity="0.5" />
        <text x="428" y="52" className="art-label" textAnchor="middle">obstacle</text>
      </g>

      {/* handle: vibration + buzzer feedback */}
      <g className="art-fade" style={{ '--d': '0.5s' } as React.CSSProperties}>
        <rect x={cx - 24} y="360" width="48" height="26" rx="6" className="art-fill-soft" />
        <rect x={cx - 24} y="360" width="48" height="26" rx="6" className="art-stroke" fill="none" />
        <circle cx={cx} cy="373" r="4" className="art-fill-accent art-blink" />
        <text x={cx + 32} y="378" className="art-label art-label--node">vibration + buzzer</text>
      </g>

      {/* piezoelectric — the one part still in prototype */}
      <g className="art-fade" style={{ '--d': '1.1s' } as React.CSSProperties}>
        <circle cx={cx} cy="330" r="12" className="art-stroke art-dash" fill="none" />
        <text x={cx + 22} y="334" className="art-label art-label--dim">piezoelectric — prototype</text>
      </g>

      <text x="40" y="412" className="art-label art-label--dim">named after "friend" in Sanskrit</text>
    </svg>
  )
}

/** Shared plate behind every artifact. */
function Frame() {
  return <rect x="0.5" y="0.5" width="639" height="439" rx="2" className="art-plate" />
}
