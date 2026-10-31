import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_EXPO } from '../lib/motion'

const LINES = ['var(--color-ink)', 'var(--color-lilac)', 'var(--color-sky)'] // el color de cada carpeta, en su orden
const SPREAD = 11 // px entre hilos al nacer: salen casi paralelos y se separan después
const SAMPLES = 12

/** Posición sin transformaciones: los hilos apuntan a donde la pestaña acaba, aunque aún esté subiendo. */
function offsetIn(root, el) {
  let x = 0
  let y = 0
  for (let n = el; n && n !== root; n = n.offsetParent) {
    x += n.offsetLeft
    y += n.offsetTop
  }
  return { x, y }
}

/** S suave con tangente vertical en ambos extremos, muestreada y unida con un spline Catmull-Rom: sin quiebros. */
function flowingPath(sx, sy, ex, ey) {
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const u = i / SAMPLES
    return [sx + (ex - sx) * (u * u * (3 - 2 * u)), sy + (ey - sy) * u]
  })
  const f = (n) => n.toFixed(1)
  let d = `M${f(sx)} ${f(sy)}`
  for (let i = 0; i < SAMPLES; i += 1) {
    const [p0, p1, p2, p3] = [pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(SAMPLES, i + 2)]]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

/** Solo con las carpetas en fila de escritorio: nacen juntos bajo el bloque de título y acaban en cada pestaña. */
function tracePaths(root, name, block) {
  if (!name || !block || !window.matchMedia('(min-width: 1024px)').matches) return null
  const tabs = [...root.querySelectorAll('.folder-tab')]
  if (tabs.length !== LINES.length) return null
  const sy = offsetIn(root, block).y + block.offsetHeight + 10
  const cx = offsetIn(root, name).x + name.offsetWidth * 0.22
  // Mismo punto de llegada en cada pestaña (no su centro, que varía con el texto): los hilos quedan equidistantes
  const inset = Math.min(...tabs.map((tab) => tab.offsetWidth)) / 2
  const paths = tabs.map((tab, i) => {
    const p = offsetIn(root, tab)
    return flowingPath(cx + (i - 1) * SPREAD, sy, p.x + inset, p.y)
  })
  return { w: root.offsetWidth, h: root.offsetHeight, paths }
}

/**
 * Los tres hilos hasta las pestañas de las carpetas.
 * rootRef: contenedor posicionado que incluye las carpetas · nameRef: el título (da la x) · blockRef: el bloque del título (da la y).
 */
export default function FolderThreads({ rootRef, nameRef, blockRef }) {
  const reduce = useReducedMotion()
  const [box, setBox] = useState(null)
  const [hovered, setHovered] = useState(-1)
  const [opened, setOpened] = useState(-1)

  useEffect(() => {
    const root = rootRef.current
    const measure = () => {
      const next = tracePaths(root, nameRef.current, blockRef.current)
      setBox((b) => (JSON.stringify(b) === JSON.stringify(next) ? b : next))
      setOpened([...root.querySelectorAll('.folder')].findIndex((f) => f.getAttribute('aria-expanded') === 'true'))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    root.querySelectorAll('.folder-tab').forEach((tab) => ro.observe(tab)) // el ancho cambia con el idioma
    const mo = new MutationObserver(measure)
    mo.observe(root.querySelector('.folders'), { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-expanded'] })
    document.fonts?.ready.then(measure)

    const indexOf = (target) => {
      const f = target.closest?.('.folder')
      return f ? [...root.querySelectorAll('.folder')].indexOf(f) : -1
    }
    const onOver = (e) => {
      if (e.pointerType !== 'touch') setHovered(indexOf(e.target))
    }
    const onFocus = (e) => setHovered(indexOf(e.target))
    const clear = () => setHovered(-1)
    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerleave', clear)
    root.addEventListener('focusin', onFocus)
    root.addEventListener('focusout', clear)
    return () => {
      ro.disconnect()
      mo.disconnect()
      root.removeEventListener('pointerover', onOver)
      root.removeEventListener('pointerleave', clear)
      root.removeEventListener('focusin', onFocus)
      root.removeEventListener('focusout', clear)
    }
  }, [rootRef, nameRef, blockRef])

  if (!box) return null
  return (
    <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} className="folder-threads pointer-events-none absolute inset-0" aria-hidden="true">
      {box.paths.map((d, i) => (
        <g key={LINES[i]} className="home-line" style={{ opacity: hovered === i || opened === i ? 1 : 0.8 }}>
          <motion.path
            d={d}
            fill="none"
            style={{ stroke: LINES[i] }}
            strokeWidth={1.75}
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.75, delay: 0.3 + i * 0.06, ease: EASE_EXPO }}
          />
        </g>
      ))}
    </svg>
  )
}
