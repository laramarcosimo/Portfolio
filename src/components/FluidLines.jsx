import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll } from 'framer-motion'
import { RIBBON_COLORS, buildCurve, ribbonPath, ribbonWidth } from '../lib/ribbonGeometry'

/**
 * Líneas fluidas: tres hilos finos (marino, cielo, lavanda) que nacen como un trazo apenas
 * visible en el lateral, engordan un poco y guían la mirada entre los bloques de contenido.
 *
 * - `build(W, rects, H)` devuelve los puntos de paso; `rects` son las cajas (top/bottom, relativas
 *   al contenedor) de los elementos indicados en `ids`.
 * - Se dibujan según el progreso de scroll (`useScroll`) y ondulan de forma continua y muy sutil;
 *   la fase de la onda avanza con el scroll.
 * - `minReveal(rects)` fuerza a que una parte (p. ej. el hero) esté siempre dibujada.
 */
const NO_IDS = []

export default function FluidLines({ containerRef, ids = NO_IDS, build, minReveal, className = '' }) {
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

      // Hasta dónde está dibujado el recorrido según el scroll (coordenadas del contenedor)
      const limit = reduce ? Infinity : Math.max(scroll + g.vh * 0.72 - g.pageTop, g.minY)
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
        const sEnd = done ? Infinity : sHead - r * 60
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
      const rects = {}
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) return
        const r = el.getBoundingClientRect()
        rects[id] = { t: r.top - origin.top, b: r.bottom - origin.top }
      }
      const W = origin.width
      const H = origin.height
      const narrow = W < 700
      const width = ribbonWidth(W)

      geo.current = {
        ...buildCurve(build(W, rects, H), narrow ? 14 : 18),
        width,
        spacing: width * 2.6 + 6,
        birth: 420,
        amp: narrow ? 8 : 16,
        lambda: narrow ? 300 : 430,
        vh: window.innerHeight,
        pageTop: origin.top + window.scrollY,
        minY: minReveal ? minReveal(rects) : -Infinity,
      }
      setBox((prev) => (prev.w === W && prev.h === H ? prev : { w: W, h: H }))
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
  }, [containerRef, ids, build, minReveal, draw])

  return (
    <svg
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w || 1} ${box.h || 1}`}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-0 overflow-hidden ${className}`}
    >
      {RIBBON_COLORS.map((c, i) => (
        <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
      ))}
    </svg>
  )
}
