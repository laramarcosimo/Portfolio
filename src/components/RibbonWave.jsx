import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion'

/**
 * Hilo conductor de cintas: UN solo lienzo SVG global, desde el Hero hasta el Footer.
 *
 * El trazado se construye a partir de puntos de paso medidos sobre las secciones reales
 * del DOM, así la salida de una sección coincide exactamente con la entrada de la siguiente
 * (no hay cortes) y se recalcula al redimensionar. Las tres cintas son copias paralelas del
 * mismo recorrido (desplazadas a lo largo de la normal) y ondulan de forma permanente.
 *
 * Capas: `back` (z-0, detrás del contenido) y `front` (z-20), que repite las cintas
 * recortadas a la esquina inferior derecha de la foto para que la abracen por delante.
 */

const COLORS = ['#192a56', '#96c9ff', '#9690e4'] // marino, cielo, lavanda
const CLIP_ID = 'ribbon-front-clip'

const rectIn = (el, origin) => {
  const r = el.getBoundingClientRect()
  return { l: r.left - origin.left, r: r.right - origin.left, t: r.top - origin.top, b: r.bottom - origin.top }
}

/** Puntos de paso [x, y] del recorrido, en píxeles del contenedor. */
function buildPoints(W, m) {
  const { hero: H, about: A, photo: P, portfolio: F, rail: R, services: S, contact: C, footer: Ft } = m
  const hh = H.b - H.t
  const ph = P.b - P.t
  const pw = P.r - P.l
  const ch = C.b - C.t
  const narrow = W < 700
  const lx = narrow ? 0 : 0.05 // posición de las patas del arco de contacto

  return [
    // HERO: cruce horizontal en la mitad inferior
    [-0.06 * W, H.t + 0.62 * hh],
    [0.22 * W, H.t + 0.74 * hh],
    [0.5 * W, H.t + 0.66 * hh],
    [0.78 * W, H.t + 0.5 * hh],
    [1.06 * W, H.t + 0.56 * hh],
    [1.1 * W, H.t + 0.86 * hh],
    [0.82 * W, H.b - 24],
    // SOBRE MÍ: bajan desde la esquina superior izquierda y pasan por detrás de la foto,
    // y abrazan por delante su esquina inferior derecha.
    ...(narrow
      ? [
          [0.6 * W, A.t + 30],
          [0.2 * W, P.t + 0.2 * ph],
          [0.45 * W, P.t + 0.5 * ph],
          [0.85 * W, P.t + 0.75 * ph],
          [1.03 * W, P.t + 0.9 * ph],
          [P.r - 40, P.b - 16],
          [P.r - 130, P.b + 30],
          [0.03 * W, P.b + 80],
          [0.02 * W, A.b - 10],
        ]
      : [
          [0.5 * W, A.t + 0.06 * (A.b - A.t)],
          [Math.max(-0.02 * W, P.l - 0.1 * W), P.t - 34],
          [P.l - 30, P.t + 0.16 * ph],
          [P.l + 0.3 * pw, P.t + 0.46 * ph],
          [P.l + 0.72 * pw, P.t + 0.66 * ph],
          [P.r + 42, P.t + 0.7 * ph],
          [P.r + 66, P.t + 0.87 * ph],
          [P.r + 6, P.b - 26],
          [P.r - 70, P.b + 38],
          [0.16 * W, A.b - 6],
        ]),    // PORTAFOLIO: por el margen izquierdo hasta el riel ondulado bajo el carrusel (izquierda → derecha)
    [0.04 * W, F.t + 0.32 * (F.b - F.t)],
    [-0.02 * W, R - 24],
    [0.2 * W, R + 14],
    [0.4 * W, R - 14],
    [0.6 * W, R + 16],
    [0.8 * W, R - 12],
    [1.02 * W, R - 34],
    [1.07 * W, R + 70],
    // SERVICIOS: bajan por el margen derecho y recorren la parte inferior hacia la izquierda
    [1.03 * W, F.b + 30],
    [0.98 * W, S.t + 0.5 * (S.b - S.t)],
    [0.9 * W, S.b - 70],
    [0.62 * W, S.b - 40],
    [0.36 * W, S.b - 90],
    [0.12 * W, S.b - 60],
    [-0.06 * W, S.b - 10],
    // CONTACTO: arco que enmarca el bloque (sube por la izquierda, cruza arriba, baja por la derecha)
    [-0.04 * W, C.t + 0.5 * ch],
    [lx * W, C.t + 0.3 * ch],
    [0.14 * W, C.t + 90],
    [0.5 * W, C.t + 50],
    [0.86 * W, C.t + 90],
    [(1 - lx) * W, C.t + 0.3 * ch],
    [(1 - lx + 0.01) * W, C.t + 0.62 * ch],
    [0.86 * W, C.b - 10],
    [0.66 * W, Ft.t + 12],
    [0.55 * W, Ft.t + 60],
  ]
}

/** Spline Catmull-Rom → Béziers cúbicas. */
function toPath(pts) {
  const f = (n) => n.toFixed(1)
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

function normals(pts) {
  return pts.map((_, i) => {
    const a = pts[i - 1] ?? pts[i]
    const b = pts[i + 1] ?? pts[i]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    return [-dy / len, dx / len]
  })
}

export default function RibbonWave({ containerRef }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const backPaths = useRef([])
  const frontPaths = useRef([])
  const geo = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0, clip: null })

  const draw = useCallback(
    (time) => {
      const g = geo.current
      if (!g) return
      const scroll = scrollY.get()
      for (let r = 0; r < 3; r++) {
        const off = (r - 1) * g.gap
        const pts = g.base.map(([x, y], i) => {
          // vaivén ondulatorio permanente + fase arrastrada por el scroll (parallax)
          const wave = reduce
            ? 0
            : (Math.sin(time / 2800 + i * 0.42 + r * 0.9 + scroll / 520) + 0.5 * Math.sin(time / 4300 - i * 0.27 + r * 1.7)) * g.amp * 0.7
          const k = off + wave
          return [x + g.norm[i][0] * k, y + g.norm[i][1] * k]
        })
        const d = toPath(pts)
        backPaths.current[r]?.setAttribute('d', d)
        frontPaths.current[r]?.setAttribute('d', d)
      }
    },
    [reduce, scrollY],
  )

  useAnimationFrame((t) => {
    if (!reduce) draw(t)
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const measure = () => {
      const origin = container.getBoundingClientRect()
      const get = (id) => document.getElementById(id)
      const els = ['inicio', 'sobre-mi', 'about-photo', 'portafolio', 'carousel', 'servicios', 'contacto', 'site-footer'].map(get)
      if (els.some((e) => !e)) return
      const [hero, about, photo, portfolio, carousel, services, contact, footer] = els.map((e) => rectIn(e, origin))
      const W = origin.width

      const base = buildPoints(W, { hero, about, photo, portfolio, rail: carousel.b + 6, services, contact, footer })
      const rw = parseFloat(getComputedStyle(container).getPropertyValue('--rw')) || 16
      geo.current = { base, norm: normals(base), gap: rw * 3.6, amp: W < 700 ? 9 : 16 }

      setBox({
        w: W,
        h: origin.height,
        // Región donde las cintas se dibujan POR DELANTE de la foto (esquina inferior derecha)
        clip: { x: photo.r - 130, y: photo.t + 0.82 * (photo.b - photo.t), w: 300, h: 0.18 * (photo.b - photo.t) + 90 },
      })
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

  const paths = (store) =>
    COLORS.map((c, i) => (
      <path
        key={c}
        ref={(el) => (store.current[i] = el)}
        fill="none"
        stroke={c}
        strokeWidth="var(--rw)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))

  const svgProps = {
    width: box.w,
    height: box.h,
    viewBox: `0 0 ${box.w || 1} ${box.h || 1}`,
    'aria-hidden': true,
    className: 'pointer-events-none absolute left-0 top-0',
  }

  return (
    <>
      <svg {...svgProps} className={`${svgProps.className} z-0`}>
        {paths(backPaths)}
      </svg>
      <svg {...svgProps} className={`${svgProps.className} z-20`}>
        <defs>
          <clipPath id={CLIP_ID}>{box.clip && <rect {...box.clip} rx="0" />}</clipPath>
        </defs>
        <g clipPath={`url(#${CLIP_ID})`}>{paths(frontPaths)}</g>
      </svg>
    </>
  )
}
