import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion'
import { RIBBON_COLORS, buildCurve, ribbonPath, ribbonWidth, zigzag } from '../lib/ribbonGeometry'

/*
 * Hilo conductor de cintas de la página de inicio: UN solo lienzo SVG, del Hero a la banda de Contacto.
 *
 * El recorrido es un zigzag: cada zona de la página es un barrido ondulado de borde a borde y TODOS
 * los giros ocurren fuera de pantalla (arcos elípticos más allá de los bordes). Los barridos se
 * colocan sobre las zonas vacías entre bloques (medidas del DOM real) para no pisar el texto.
 * Las cintas se dibujan al hacer scroll (la punta se afila) y ondulan lentamente.
 * El lienzo termina a ras de la banda de Contacto: ahí quedan cortadas en plano.
 */

const IDS = ['inicio', 'sobre-mi', 'about-content', 'portafolio', 'carousel', 'habilidades', 'contact-band']

const rectIn = (el, origin) => {
  const r = el.getBoundingClientRect()
  return { t: r.top - origin.top, b: r.bottom - origin.top }
}

function buildPoints(W, m) {
  const { hero: H, about: A, content: C, portfolio: F, carousel: Cr, skills: S, band: B } = m
  const hh = H.b - H.t
  const crh = Cr.b - Cr.t
  const narrow = W < 700
  const k = narrow ? 0.55 : 1 // amplitud de las ondas

  const zones = [
    { y: H.t + 0.64 * hh, amp: 58 * k, drift: -70 }, // Hero
    { y: A.t + 150, amp: 34 * k, drift: 20 }, // Sobre mí: zona superior vacía
    { y: C.b + 84, amp: 28 * k, drift: 24 }, // Sobre mí: zona inferior vacía
    { y: F.t + 60, amp: 22 * k, drift: 10 }, // Portafolio: zona superior
    { y: Cr.t + 0.3 * crh, amp: 32 * k, drift: 24 }, // por detrás de las tarjetas
    { y: Cr.b + 58, amp: 30 * k, drift: 16 }, // riel bajo el carrusel
    { y: S.b - 104, amp: 30 * k, drift: 18 }, // parte inferior de Habilidades
  ]
  const pts = zigzag(W, zones)

  // Banda de contacto: última pasada, en diagonal, hasta salir cortada por el borde inferior
  pts.push([1.12 * W, B.t + 36], [0.8 * W, B.t + 78], [0.52 * W, B.t + 150], [0.32 * W, B.t + 236], [0.22 * W, B.b + 70])
  return pts
}

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
        const sEnd = done ? Infinity : sHead - r * 42
        paths.current[r]?.setAttribute('d', ribbonPath(g, r, time, scroll, sEnd, reduce))
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
      const [hero, about, content, portfolio, carousel, skills, band] = els.map((e) => rectIn(e, origin))
      const W = origin.width
      const narrow = W < 700
      const width = ribbonWidth(W)

      geo.current = {
        ...buildCurve(buildPoints(W, { hero, about, content, portfolio, carousel, skills, band }), narrow ? 14 : 18),
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
      {RIBBON_COLORS.map((c, i) => (
        <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
      ))}
    </svg>
  )
}
