import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion'

/*
 * Hilo conductor de cintas: UN solo lienzo SVG global, del Hero a la banda de Contacto.
 *
 * 1. Se miden las secciones reales del DOM y se fijan puntos de paso (buildPoints).
 * 2. Una spline Catmull-Rom centrípeta los une, se suaviza la curvatura y se remuestrea a
 *    distancia uniforme (buildCurve): un único recorrido continuo, sin cortes ni quiebros.
 * 3. Tres cintas paralelas (marino, cielo, lavanda), dibujadas como bandas planas rellenas
 *    cuyo grosor se afina hasta cero en la punta. Ondulan con olas que viajan por longitud
 *    de arco y se DIBUJAN al hacer scroll, con un destello luminoso en la punta.
 * 4. El lienzo termina a ras de la banda de Contacto: ahí las cintas quedan cortadas en plano.
 */

const COLORS = ['#192a56', '#96c9ff', '#9690e4']
const TAPER = 150 // longitud (px) de afinado de la punta
const IDS = ['inicio', 'sobre-mi', 'about-photo', 'portafolio', 'carousel', 'servicios', 'contact-band']

const rectIn = (el, origin) => {
  const r = el.getBoundingClientRect()
  return { l: r.left - origin.left, r: r.right - origin.left, t: r.top - origin.top, b: r.bottom - origin.top }
}

// Puntos de paso [x, y] del recorrido, en píxeles del contenedor.
function buildPoints(W, m) {
  const { hero: H, about: A, photo: P, portfolio: F, carousel: Cr, services: S, band: B } = m
  const hh = H.b - H.t
  const ph = P.b - P.t
  const crh = Cr.b - Cr.t
  const sh = S.b - S.t
  const narrow = W < 700

  return [
    // HERO: cruce ondulado a todo lo ancho
    [-0.06 * W, H.t + 0.6 * hh],
    [0.24 * W, H.t + 0.66 * hh],
    [0.5 * W, H.t + 0.72 * hh],
    [0.78 * W, H.t + 0.56 * hh],
    [1.06 * W, H.t + 0.44 * hh],
    [1.12 * W, H.t + 0.8 * hh],
    // SOBRE MÍ: barrido superior de derecha a izquierda y lazo alrededor de la foto
    [0.93 * W, H.b + 0.04 * (A.b - A.t)],
    [0.62 * W, A.t + 110],
    [0.36 * W, A.t + 92],
    ...(narrow
      ? [
          [0.1 * W, A.t + 140],
          [0.03 * W, P.t + 0.35 * ph],
          [0.03 * W, P.b + 40],
          [0.05 * W, A.b - 24],
          [0.12 * W, F.t + 50],
          [0.22 * W, F.t + 100],
        ]
      : [
          [Math.max(0.05 * W, P.l - 110), A.t + 150],
          [P.l - 120, P.t + 0.2 * ph],
          [P.l - 80, P.t + 0.68 * ph],
          [P.l + 0.1 * (P.r - P.l), P.b + 62],
          [0.55 * W, A.b - 46],
          [0.84 * W, A.b - 70],
          [0.94 * W, A.b + 10],
          [0.92 * W, F.t + 70],
          [0.62 * W, F.t + 44],
          [0.3 * W, F.t + 64],
          [0.18 * W, F.t + 128],
        ]),
    // PORTAFOLIO: "S" por detrás del carrusel y riel inferior que se afina hacia la izquierda
    [0.27 * W, Cr.t + 0.12 * crh],
    [0.56 * W, Cr.t + 0.3 * crh],
    [0.8 * W, Cr.t + 0.42 * crh],
    [0.9 * W, Cr.b - 10],
    [0.72 * W, Cr.b + 34],
    [0.45 * W, Cr.b + 54],
    [0.2 * W, Cr.b + 32],
    [-0.05 * W, Cr.b + 52],
    // SERVICIOS: bajan por el margen izquierdo hacia la banda de contacto
    [-0.07 * W, F.b + 20],
    [0.02 * W, S.t + 0.6 * sh],
    [0.1 * W, S.b - 50],
    // BANDA DE CONTACTO: remolino que termina cortado a ras del borde inferior
    [0.28 * W, B.t - 12],
    [0.5 * W, B.t + 14],
    [0.68 * W, B.t + 50],
    [0.73 * W, B.t + 118],
    [0.56 * W, B.t + 174],
    [0.36 * W, B.t + 190],
    [0.26 * W, B.t + 236],
    [0.23 * W, B.b + 60],
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

function buildCurve(waypoints, step = 30) {
  const base = resample(smooth(sampleSpline(waypoints, 8), 9, 4), step)
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
  const glow = useRef(null)
  const geo = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const draw = useCallback(
    (time) => {
      const g = geo.current
      if (!g) return
      const n = g.base.length
      const scroll = scrollY.get()

      // Punto hasta el que se ha "dibujado" el recorrido (según el scroll; siempre incluye el hero)
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

      let tip = null
      for (let r = 0; r < 3; r++) {
        const off = (r - 1) * g.spacing
        const sEnd = done ? Infinity : sHead - r * 42
        const left = []
        const right = []
        const mid = []
        for (let i = 0; i < n; i++) {
          const s = i * g.step
          if (s > sEnd) break
          const wave = reduce
            ? 0
            : (Math.sin(s / 330 + time / 2600 + r * 0.9 + scroll / 700) + 0.5 * Math.sin(s / 540 - time / 3900 + r * 1.7)) * g.amp * 0.7
          const k = off + wave
          const x = g.base[i][0] + g.norm[i][0] * k
          const y = g.base[i][1] + g.norm[i][1] * k
          const t = done ? 1 : smoothstep(Math.min(1, Math.max(0, (sEnd - s) / TAPER)))
          const hw = (g.width / 2) * Math.max(t, 0.02)
          left.push([x + g.norm[i][0] * hw, y + g.norm[i][1] * hw])
          right.push([x - g.norm[i][0] * hw, y - g.norm[i][1] * hw])
          mid.push([x, y])
        }
        if (left.length < 2) {
          paths.current[r]?.setAttribute('d', '')
          continue
        }
        right.reverse()
        const d = `M${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}${curve(left)} L${right[0][0].toFixed(1)} ${right[0][1].toFixed(1)}${curve(right)}Z`
        paths.current[r]?.setAttribute('d', d)
        if (r === 1) tip = mid[mid.length - 1]
      }

      // Destello luminoso en la punta mientras se dibuja
      const el = glow.current
      if (el) {
        if (done || !tip) el.setAttribute('opacity', '0')
        else {
          el.setAttribute('opacity', '1')
          el.setAttribute('cx', tip[0].toFixed(1))
          el.setAttribute('cy', tip[1].toFixed(1))
        }
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
      const [hero, about, photo, portfolio, carousel, services, band] = els.map((e) => rectIn(e, origin))
      const W = origin.width

      const width = Math.max(11, Math.min(40, W * 0.026))
      geo.current = {
        ...buildCurve(buildPoints(W, { hero, about, photo, portfolio, carousel, services, band })),
        width,
        spacing: width + Math.max(2, width * 0.1),
        amp: W < 700 ? 8 : 15,
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
      <defs>
        <radialGradient id="ribbon-glow">
          <stop offset="0" stopColor="#bdf0ff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#7fd8ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7fd8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {COLORS.map((c, i) => (
        <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
      ))}
      <circle ref={glow} r="46" fill="url(#ribbon-glow)" opacity="0" />
    </svg>
  )
}
