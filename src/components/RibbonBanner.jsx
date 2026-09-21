import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useReducedMotion } from 'framer-motion'
import { RIBBON_COLORS, buildCurve, ribbonPath, ribbonWidth } from '../lib/ribbonGeometry'

/** Banda decorativa de las páginas interiores: tres cintas que cruzan de borde a borde con giros fuera de pantalla. */
export default function RibbonBanner({ height = 170, className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const paths = useRef([])
  const geo = useRef(null)
  const [w, setW] = useState(0)

  const draw = useCallback(
    (time) => {
      const g = geo.current
      if (!g) return
      for (let r = 0; r < 3; r++) paths.current[r]?.setAttribute('d', ribbonPath(g, r, time, 0, Infinity, reduce))
    },
    [reduce],
  )

  useAnimationFrame((t) => draw(t))

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => {
      const W = el.getBoundingClientRect().width
      const width = ribbonWidth(W) * 0.85
      const k = W < 700 ? 0.6 : 1
      const pts = [
        [-0.12 * W, height * 0.62],
        [0.2 * W, height * (0.5 - 0.16 * k)],
        [0.5 * W, height * (0.55 + 0.14 * k)],
        [0.8 * W, height * (0.46 - 0.12 * k)],
        [1.12 * W, height * 0.42],
      ]
      geo.current = { ...buildCurve(pts, 12), width, spacing: width + Math.max(2, width * 0.1), amp: W < 700 ? 6 : 10, lambda: 320 }
      setW(W)
      draw(performance.now())
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [height, draw])

  return (
    <div ref={ref} className={`relative overflow-hidden bg-fog ${className}`} style={{ height }} aria-hidden="true">
      <svg width={w} height={height} viewBox={`0 0 ${w || 1} ${height}`} className="absolute inset-0">
        {RIBBON_COLORS.map((c, i) => (
          <path key={c} ref={(el) => (paths.current[i] = el)} fill={c} />
        ))}
      </svg>
    </div>
  )
}
