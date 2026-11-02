import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animate } from 'framer-motion'
import { img } from '../data/content'

let played = false
const LANDING_PATH = window.location.pathname // solo cuenta la página por la que se entra a la web
const FONT_WAIT_MS = 1500
const LOGO_W = 555 // caja de los trazos, la misma proporción que el monograma
const LOGO_H = 556
const INK = 60 // grosor con el que cada trazo descubre el logo real

// Los tres trazos del monograma, siguiendo su forma: L y ola exterior, L y ola interior, M y S.
const STROKES = [
  [[58, 0], [8, 100], [22, 190], [55, 290], [58, 400], [12, 500], [23, 516], [150, 470], [285, 505], [415, 548], [543, 495]],
  [[121, 30], [84, 130], [118, 240], [145, 340], [108, 441], [215, 408], [325, 440], [425, 470], [518, 426]],
  [[135, 40], [128, 120], [175, 210], [258, 253], [343, 208], [395, 98], [463, 50], [493, 60], [430, 130], [495, 270], [548, 400], [453, 501]],
]

/** Une los puntos con un spline Catmull-Rom. */
function spline(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [p0, p1, p2, p3] = [pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(pts.length - 1, i + 2)]]
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`
  }
  return d
}
const STROKE_PATHS = STROKES.map(spline)

const clamp = (n) => Math.min(1, Math.max(0, n))
const smooth = (n) => n * n * (3 - 2 * n)
const span = (t, from, to) => smooth(clamp((t - from) / (to - from)))
const dash = (el, from, to, total) => el.setAttribute('stroke-dasharray', `0 ${from} ${Math.max(0, to - from)} ${total + 1}`)

/** Cada vez que se carga o recarga una página con hilos, arriba del todo; no al navegar dentro de la web. */
export function shouldPlayIntro(reduce) {
  if (played || reduce || window.location.pathname !== LANDING_PATH || window.scrollY > 0) return false
  played = true
  return true
}

/**
 * Entrada de la web: el monograma se dibuja solo en el centro, las tres líneas pasan por encima
 * y lo dejan limpio, viaja a su sitio en la barra y de él se sueltan los hilos, que hacen subir
 * cada carpeta al llegar a ella.
 * En móvil no hay hilos: las carpetas suben en cuanto el monograma se coloca.
 * trace: mide los hilos (null si no hay) · rootRef: su contenedor · colors: color de cada línea.
 */
export default function ThreadsIntro({ trace, rootRef, colors, onDone }) {
  const [scene, setScene] = useState(null)
  const veilRef = useRef(null)
  const logoRef = useRef(null)
  const imageRef = useRef(null)
  const strokeRefs = useRef([])
  const maskRefs = useRef([])
  const threadRefs = useRef([])

  useEffect(() => {
    let alive = true
    const timeout = new Promise((resolve) => { setTimeout(resolve, FONT_WAIT_MS) })
    // Cargar la fuente antes de medir: con la de sustitución el título ocupa otra altura y los hilos no encajarían
    const fonts = document.fonts ? document.fonts.load("700 1em 'Quicksand'").then(() => document.fonts.ready) : timeout
    Promise.race([fonts, timeout]).then(() => {
      if (!alive) return
      const box = trace()
      const top = box ? rootRef.current.getBoundingClientRect().top : 0
      const mark = document.querySelector('header img[src*="monograma"]')?.getBoundingClientRect()
      const end = mark?.width ? { x: mark.left, y: mark.top, w: mark.width, h: mark.height } : { x: 16, y: 14, w: 36, h: 36 }
      const h = Math.min(window.innerHeight * 0.36, window.innerWidth * (window.innerWidth < 768 ? 0.36 : 0.6), 300)
      const w = h * (end.w / end.h)
      const vw = window.innerWidth
      const midY = window.innerHeight / 2
      setScene({
        w: window.innerWidth,
        h: window.innerHeight,
        top,
        start: { x: (window.innerWidth - w) / 2, y: (window.innerHeight - h) / 2, w, h },
        end,
        // Pasada de limpieza: tres olas paralelas que cruzan el logo de lado a lado
        sweeps: colors.map((_, i) => {
          const y = midY + (i - 1) * h * 0.3
          return `M${vw + 20} ${y}C${vw * 0.7} ${y - 70} ${vw * 0.35} ${y + 70} -20 ${y}`
        }),
        threads: box
          ? box.threads.map(({ start: [sx, sy], d }, i) => {
              // Sale de la base del monograma y baja hasta el arranque de su hilo
              const lx = end.x + end.w * (0.3 + i * 0.2)
              const ly = end.y + end.h - top
              const lead = `M${lx.toFixed(1)} ${ly.toFixed(1)}C${lx.toFixed(1)} ${(ly + 50).toFixed(1)} ${sx.toFixed(1)} ${(sy - 60).toFixed(1)} ${sx.toFixed(1)} ${sy.toFixed(1)}`
              return { lead, full: lead + d.slice(d.indexOf('C')) }
            })
          : [],
      })
    })
    return () => { alive = false }
  }, [trace, rootRef, colors])

  useEffect(() => {
    if (!scene) return undefined
    const threaded = scene.threads.length > 0
    const slots = [...rootRef.current.querySelectorAll('.folder-slot')]
    slots.forEach((slot) => { slot.style.opacity = '0' })
    const risen = new Set()
    const rise = (slot) => {
      risen.add(slot)
      slot.style.opacity = ''
      slot.animate(
        [{ opacity: 0, transform: 'translateY(46px)' }, { opacity: 1, transform: 'none' }],
        { duration: 750, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
    }

    const inkLens = maskRefs.current.map((el) => el.getTotalLength())
    const sweepLens = strokeRefs.current.map((el) => el.getTotalLength())
    const threadLens = threadRefs.current.map((el) => el.getTotalLength())
    const leadLens = scene.threads.map(({ lead }) => {
      const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      probe.setAttribute('d', lead)
      return probe.getTotalLength()
    })
    // Cada hilo llega a su carpeta un poco después que el anterior
    const arrivals = threaded ? [0.84, 0.87, 0.9] : [0.68, 0.73, 0.78]

    const paint = (t) => {
      maskRefs.current.forEach((el, i) => dash(el, 0, inkLens[i] * span(t, 0.02 + i * 0.03, 0.22 + i * 0.04), inkLens[i]))
      strokeRefs.current.forEach((el, i) => {
        const at = 0.31 + i * 0.015
        dash(el, sweepLens[i] * span(t, at + 0.05, at + 0.2), sweepLens[i] * span(t, at, at + 0.15), sweepLens[i])
        el.style.opacity = t > at && t < at + 0.2 ? 1 : 0
      })
      // Al pasar las líneas por el centro, el logo queda entero y limpio
      if (t > 0.38) imageRef.current.removeAttribute('mask')

      const move = span(t, 0.5, 0.66)
      const box = Object.fromEntries(['x', 'y', 'w', 'h'].map((k) => [k, scene.start[k] + (scene.end[k] - scene.start[k]) * move]))
      logoRef.current.setAttribute('transform', `translate(${box.x} ${box.y}) scale(${box.w / LOGO_W} ${box.h / LOGO_H})`)

      threadRefs.current.forEach((el, i) => {
        const head = threadLens[i] * span(t, 0.62, arrivals[i])
        dash(el, leadLens[i] * span(t, 0.64, 0.78), head, threadLens[i])
        el.style.opacity = head > 0 ? 0.8 : 0
      })
      arrivals.forEach((at, i) => {
        if (t >= at - 0.02 && slots[i] && !risen.has(slots[i])) rise(slots[i])
      })
      veilRef.current.style.opacity = 1 - span(t, 0.66, 0.84)
    }
    paint(0)
    const controls = animate(0, 1, {
      duration: threaded ? 3.8 : 3,
      ease: 'linear',
      onUpdate: paint,
      onComplete: onDone,
    })
    return () => {
      controls.stop()
      slots.forEach((slot) => { slot.style.opacity = '' })
    }
  }, [scene, rootRef, onDone])

  return createPortal(
    <div className="threads-intro" aria-hidden="true">
      <div ref={veilRef} className="threads-intro-veil" />
      {scene && (
        <svg width={scene.w} height={scene.h} className="absolute inset-0">
          {scene.threads.map(({ full }, i) => (
            <path
              key={colors[i]}
              ref={(el) => { threadRefs.current[i] = el }}
              d={full}
              transform={`translate(0 ${scene.top})`}
              fill="none"
              style={{ stroke: colors[i], opacity: 0 }}
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          ))}
          <g ref={logoRef}>
            <mask id="threads-intro-ink" maskUnits="userSpaceOnUse" x="-40" y="-40" width={LOGO_W + 80} height={LOGO_H + 80}>
              {STROKE_PATHS.map((d, i) => (
                <path key={d} ref={(el) => { maskRefs.current[i] = el }} d={d} fill="none" stroke="#fff" strokeWidth={INK} strokeLinecap="round" />
              ))}
            </mask>
            <image ref={imageRef} href={img('brand/monograma')} width={LOGO_W} height={LOGO_H} preserveAspectRatio="none" mask="url(#threads-intro-ink)" />
          </g>
          {scene.sweeps.map((d, i) => (
            <path
              key={d}
              ref={(el) => { strokeRefs.current[i] = el }}
              d={d}
              fill="none"
              style={{ stroke: colors[i], opacity: 0 }}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}
    </div>,
    document.body,
  )
}
