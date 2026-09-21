import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion'

/*
 * Hilo conductor de cintas: UN solo lienzo SVG global, del Hero a la banda de Contacto.
 *
 * 1. Se miden las secciones reales del DOM y se fijan pocos puntos de paso (buildPoints),
 *    con un recorrido distinto en escritorio y en móvil.
 * 2. Una spline Catmull-Rom centrípeta los une y la curva se suaviza con fuerza y se
 *    remuestrea a distancia uniforme (buildCurve): giros amplios, sin quiebros.
 * 3. Tres cintas paralelas (marino, cielo, lavanda), dibujadas como bandas planas rellenas
 *    cuyo grosor se afina hasta cero en la punta. Ondulan con olas que viajan por longitud
 *    de arco y se DIBUJAN al hacer scroll.
 * 4. El lienzo termina a ras de la banda de Contacto: ahí las cintas quedan cortadas en plano.
 */

const COLORS = ['#192a56', '#96c9ff', '#9690e4']
const TAPER = 170 // longitud (px) de afinado de la punta
const IDS = ['inicio', 'sobre-mi', 'about-photo', 'about-content', 'portafolio', 'carousel', 'servicios', 'contact-band']

const rectIn = (el, origin) => {
  const r = el.getBoundingClientRect()
  return { l: r.left - origin.left, r: r.right - origin.left, t: r.top - origin.top, b: r.bottom - origin.top }
}

// Recorrido común de la banda de contacto: remolino que termina cortado en su borde inferior.
const bandSwirl = (W, B) => [
  [0.28 * W, B.t - 12],
  [0.5 * W, B.t + 14],
  [0.68 * W, B.t + 38],
  [0.77 * W, B.t + 112],
  [0.6 * W, B.t + 186],
  [0.36 * W, B.t + 204],
  [0.25 * W, B.t + 252],
  [0.23 * W, B.b + 70],
]

// Puntos de paso [x, y] del recorrido, en píxeles del contenedor.
function buildPoints(W, m) {
  const { hero: H, about: A, photo: P, content: C, portfolio: F, carousel: Cr, services: S, band: B } = m
  const hh = H.b - H.t
  const ph = P.b - P.t
  const crh = Cr.b - Cr.t
  const sh = S.b - S.t

  // MÓVIL: las cintas cruzan de lado a lado por las zonas vacías entre bloques y bajan pegadas
  // a los márgenes (medio fuera de pantalla), así no pisan ningún texto.
  if (W < 700) {
    return [
      [-0.06 * W, H.t + 0.6 * hh],
      [0.3 * W, H.t + 0.68 * hh],
      [0.64 * W, H.t + 0.58 * hh],
      [1.0 * W, H.t + 0.5 * hh],
      [1.03 * W, H.b - 30],
      [1.0 * W, A.t + 40],
      [0.7 * W, A.t + 105],
      [0.36 * W, A.t + 140],
      [0.05 * W, A.t + 200],
      [0, P.t + 0.35 * ph],
      [0, A.b - 190],
      [0.12 * W, A.b - 100],
      [0.45 * W, A.b - 66],
      [0.8 * W, A.b - 46],
      [1.0 * W, A.b + 10],
      [1.0 * W, F.t + 40],
      [0.7 * W, F.t + 92],
      [0.36 * W, F.t + 108],
      [0.06 * W, Cr.t + 0.1 * crh],
      [0.4 * W, Cr.t + 0.36 * crh],
      [0.8 * W, Cr.t + 0.52 * crh],
      [1.0 * W, Cr.b - 12],
      [0.7 * W, Cr.b + 40],
      [0.4 * W, Cr.b + 56],
      [0.1 * W, Cr.b + 42],
      [0, Cr.b + 96],
      [0, F.b + 20],
      [0, S.t + 0.5 * sh],
      [0.08 * W, S.b - 96],
      [0.3 * W, S.b - 44],
      ...bandSwirl(W, B),
    ]
  }

  // ESCRITORIO
  return [
    // HERO: cruce ondulado a todo lo ancho y giro amplio fuera de pantalla
    [-0.06 * W, H.t + 0.6 * hh],
    [0.25 * W, H.t + 0.66 * hh],
    [0.52 * W, H.t + 0.72 * hh],
    [0.8 * W, H.t + 0.55 * hh],
    [1.08 * W, H.t + 0.5 * hh],
    [1.16 * W, H.b - 30],
    // SOBRE MÍ: barrido superior de derecha a izquierda y lazo redondeado alrededor de la foto
    [1.0 * W, A.t + 96],
    [0.7 * W, A.t + 122],
    [0.42 * W, A.t + 104],
    [P.l - 60, A.t + 166],
    [P.l - 128, P.t + 0.36 * ph],
    [P.l - 96, P.b - 10],
    [P.l + 0.2 * (P.r - P.l), C.b + 66],
    [0.6 * W, C.b + 100],
    [0.88 * W, C.b + 104],
    [1.1 * W, A.b - 8],
    [1.14 * W, A.b + 56],
    [0.96 * W, F.t + 86],
    [0.62 * W, F.t + 98],
    [0.32 * W, F.t + 100],
    [0.2 * W, Cr.t + 0.08 * crh],
    [0.42 * W, Cr.t + 0.3 * crh],
    [0.7 * W, Cr.t + 0.46 * crh],
    [0.9 * W, Cr.b - 14],
    [0.72 * W, Cr.b + 38],
    [0.45 * W, Cr.b + 56],
    [0.2 * W, Cr.b + 34],
    [-0.04 * W, Cr.b + 60],
    // SERVICIOS: bajan por el margen izquierdo hacia la banda de contacto
    [-0.08 * W, Cr.b + 130],
    [-0.04 * W, F.b + 12],
    [0.03 * W, S.t + 0.6 * sh],
    [0.12 * W, S.b - 56],
    ...bandSwirl(W, B),
  ]
}

// Spline Catmull-Rom centrípeta (sin lazos ni sobreimpulsos) muestreada cada ~`step` px.
function sampleSpline(pts, step) {
  const out = []
  const dist = (a, b) => Math.max(Math.hypot(a[0] - b[0], a[1] - b[1]), 1e-3)
  const mix = (a, b, ka, kb) => [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb]
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p0 = pts[i - 1] ?? [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]]
    const p3 = pts[i + 2] ?? [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]]
    const t0 = 0
    const t1 = t0 + Math.sqrt(dist(p0, p1))
    const t2 = t1 + Math.sqrt(dist(p1, p2))
    const t3 = t2 + Math.sqrt(dist(p2, p3))
    const n = Math.max(2, Math.ceil(dist(p1, p2) / step))
    for (let k = 0; k < n; k++) {
      const t = t1 + ((t2 - t1) * k) / n
      const a1 = mix(p0, p1, (t1 - t) / (t1 - t0), (t - t0) / (t1 - t0))
      const a2 = mix(p1, p2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1))
      const a3 = mix(p2, p3, (t3 - t) / (t3 - t2), (t - t2) / (t3 - t2))
      const b1 = mix(a1, a2, (t2 - t) / (t2 - t0), (t - t0) / (t2 - t0))
      const b2 = mix(a2, a3, (t3 - t) / (t3 - t1), (t - t1) / (t3 - t1))
      out.push(mix(b1, b2, (t2 - t) / (t2 - t1), (t - t1) / (t2 - t1)))
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

// Suavizado por media móvil (extremos fijos): redondea giros cerrados y quiebros.
function smooth(pts, radius, passes) {
  let cur = pts
  for (let p = 0; p < passes; p++) {
    const src = cur
    cur = src.map((pt, i) => {
      const w = Math.min(radius, i, src.length - 1 - i)
      if (w === 0) return pt
      let x = 0
      let y = 0
      for (let k = -w; k <= w; k++) {
        x += src[i + k][0]
        y += src[i + k][1]
      }
      return [x / (2 * w + 1), y / (2 * w + 1)]
    })
  }
  return cur
}

// Remuestreo a distancia uniforme: la longitud de arco guía la onda y el dibujado.
function resample(pts, step) {
  const out = [pts[0]]
  let carry = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (seg === 0) continue
    let d = step - carry
    while (d <= seg) {
      const k = d / seg
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k])
      d += step
    }
    carry = seg - (d - step)
  }
  out.push(pts[pts.length - 1])
  return out
}

// `radius`: semiventana de suavizado en muestras de 8 px (mayor = curvas más amplias).
function buildCurve(waypoints, radius, step = 26) {
  const base = resample(smooth(sampleSpline(waypoints, 8), radius, 5), step)
  const norm = base.map((_, i) => {
    const a = base[i - 1] ?? base[i]
    const b = base[i + 1] ?? base[i]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  })
  // y máxima acumulada: sirve para saber hasta dónde está "dibujado" el recorrido
  let max = -Infinity
  const maxY = base.map(([, y]) => (max = Math.max(max, y)))
  return { base, norm, maxY, step }
}

// Segmentos Bézier cúbicos Catmull-Rom (sin el "M" inicial).
function curve(pts) {
  const f = (n) => n.toFixed(1)
  let d = ''
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

const smoothstep = (t) => t * t * (3 - 2 * t)

export default function RibbonWave({ containerRef }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const paths = useRef([])
  const geo = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const draw = useCallback(
    (time) => {
      const g = geo.current
      if (!g) return
      const n = g.base.length
      const scroll = scrollY.get()

      // Hasta dónde está "dibujado" el recorrido según el scroll (siempre incluye el hero)
      const limit = reduce ? Infinity : Math.max(scroll + g.vh * 0.62, g.heroBottom + 40)
      let head = n - 1
      for (let i = 0; i < n; i++) {
        if (g.maxY[i] > limit) {
          head = i
          break
        }
      }
      const done = head >= n - 1
      const sHead = head * g.step

      for (let r = 0; r < 3; r++) {
        const off = (r - 1) * g.spacing
        const sEnd = done ? Infinity : sHead - r * 42
        const left = []
        const right = []
        for (let i = 0; i < n; i++) {
          const s = i * g.step
          if (s > sEnd) break
          // Olas lentas que viajan por longitud de arco, con la fase arrastrada por el scroll
          const wave = reduce
            ? 0
            : (Math.sin(s / g.lambda + time / 3000 + r * 0.9 + scroll / 800) + 0.5 * Math.sin(s / (g.lambda * 1.7) - time / 4300 + r * 1.7)) *
              g.amp *
              0.7
          const k = off + wave
          const nx = g.norm[i][0]
          const ny = g.norm[i][1]
          const x = g.base[i][0] + nx * k
          const y = g.base[i][1] + ny * k
          const t = done ? 1 : smoothstep(Math.min(1, Math.max(0, (sEnd - s) / TAPER)))
          const hw = (g.width / 2) * Math.max(t, 0.02)
          left.push([x + nx * hw, y + ny * hw])
          right.push([x - nx * hw, y - ny * hw])
        }
        if (left.length < 2) {
          paths.current[r]?.setAttribute('d', '')
          continue
        }
        right.reverse()
        const d = `M${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}${curve(left)} L${right[0][0].toFixed(1)} ${right[0][1].toFixed(1)}${curve(right)}Z`
        paths.current[r]?.setAttribute('d', d)
      }
    },
    [reduce, scrollY],
  )

  useAnimationFrame((t) => draw(t))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const measure = () => {
      const origin = container.getBoundingClientRect()
      const els = IDS.map((id) => document.getElementById(id))
      if (els.some((e) => !e)) return
      const [hero, about, photo, content, portfolio, carousel, services, band] = els.map((e) => rectIn(e, origin))
      const W = origin.width
      const narrow = W < 700

      // Grosor: ~5 % más fino que antes (2,47 % del ancho, entre 9,5 y 38 px)
      const width = Math.max(9.5, Math.min(38, W * 0.0247))
      geo.current = {
        ...buildCurve(buildPoints(W, { hero, about, photo, content, portfolio, carousel, services, band }), narrow ? 14 : 20),
        width,
        spacing: width + Math.max(2, width * 0.1),
        amp: narrow ? 7 : 14,
        lambda: narrow ? 260 : 380,
        vh: window.innerHeight,
        heroBottom: hero.b,
      }
      setBox({ w: W, h: band.b })
      draw(performance.now())
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    window.addEventListener('load', measure)
    document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [containerRef, draw])

  return (
    <svg
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 overflow-hidden"
    >
      {COLORS.map((c, i) => (
        <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
      ))}
    </svg>
  )
}
