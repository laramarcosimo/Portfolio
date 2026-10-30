const TILE = 720 // px que tarda en repetirse el dibujo
const HEIGHT = 40
const STEPS = 72

/** Onda periódica: dos armónicos enteros de la baldosa, así empalma sin costura y no parece una sinusoide de manual. */
function wave(mid, a, f1, p1, b, f2, p2) {
  const y = (x) => mid + a * Math.sin((2 * Math.PI * f1 * x) / TILE + p1) + b * Math.sin((2 * Math.PI * f2 * x) / TILE + p2)
  const at = (i) => {
    const x = (i * TILE) / STEPS
    return [x, y(x)]
  }
  const f = (n) => n.toFixed(2)
  let d = `M0 ${f(y(0))}`
  for (let i = 0; i < STEPS; i += 1) {
    const [p0, p1_, p2_, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    d += `C${f(p1_[0] + (p2_[0] - p0[0]) / 6)} ${f(p1_[1] + (p2_[1] - p0[1]) / 6)} ${f(p2_[0] - (p3[0] - p1_[0]) / 6)} ${f(p2_[1] - (p3[1] - p1_[1]) / 6)} ${f(p2_[0])} ${f(p2_[1])}`
  }
  return d
}

const WAVES = [
  { color: 'var(--color-ink)', d: wave(15, 6, 3, 0, 2.5, 7, 0.6) },
  { color: 'var(--color-lilac)', d: wave(20, 7, 3, 0.75, 2.5, 5, 2.1) },
  { color: 'var(--color-sky)', d: wave(25, 6, 3, 1.5, 3, 7, 3.9) },
]

/** Banda fina de tres ondas (marino, lila, cielo) a todo el ancho; el dibujo se repite, no se deforma. */
export default function WaveBand({ className = '' }) {
  return (
    <svg className={`wave-band ${className}`} width="100%" height={HEIGHT} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="wave-band-tile" width={TILE} height={HEIGHT} patternUnits="userSpaceOnUse">
          {WAVES.map(({ color, d }) => (
            <path key={color} d={d} fill="none" style={{ stroke: color }} strokeWidth={1.75} strokeLinecap="round" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height={HEIGHT} fill="url(#wave-band-tile)" />
    </svg>
  )
}
