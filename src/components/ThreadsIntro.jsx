import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animate } from 'framer-motion'
import { img } from '../data/content'

let played = false
const LANDING_PATH = window.location.pathname // solo cuenta la página por la que se entra a la web
const FONT_WAIT_MS = 1500
const LOGO_W = 555 // caja de los trazos, la misma proporción que el monograma
const LOGO_H = 556
const INK = 80 // grosor con el que cada trazo descubre su parte del logo; cada parte es una imagen propia y no puede destapar a las demás

// Los trazos del monograma, siguiendo su forma: L exterior, ola, L interior, ola, M y S.
const STROKES = [
  [[63, 23], [23, 87], [11, 163], [33, 258], [66, 325], [80, 382], [66, 448], [20, 496]],
  [[37, 507], [94, 472], [175, 467], [270, 496], [365, 529], [451, 534], [529, 489]],
  [[123, 52], [92, 111], [90, 182], [123, 273], [149, 325], [149, 382], [109, 441]],
  [[109, 441], [139, 420], [185, 408], [270, 420], [346, 453], [422, 462], [500, 426]],
  [[135, 61], [130, 125], [161, 201], [246, 256], [318, 225], [365, 144], [411, 83], [446, 70]],
  [[476, 79], [427, 102], [411, 154], [451, 235], [508, 325], [531, 401], [508, 462], [439, 499]],
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
// Tramo visible de una línea. Sin tramo se oculta: con punta redonda, un trazo de largo 0 pintaría un punto
const dash = (el, from, to, total) => {
  el.setAttribute('stroke-dasharray', `${Math.max(0, to - from)} ${total + 1}`)
  el.setAttribute('stroke-dashoffset', -from)
  el.setAttribute('visibility', to - from > 0.01 ? 'visible' : 'hidden')
}

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
  const imageRefs = useRef([])
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
    // El logo real espera oculto bajo el que viaja: al aparecer la web no se ve doble
    const mark = document.querySelector('header img[src*="monograma"]')
    if (mark) mark.style.visibility = 'hidden'
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
    const arrivals = threaded ? [0.86, 0.89, 0.92] : [0.68, 0.73, 0.78]

    const paint = (t) => {
      if (!veilRef.current) return // ya desmontada: al pararse, la animación aún da un último paso
      maskRefs.current.forEach((el, i) => {
        dash(el, 0, inkLens[i] * span(t, 0.02 + i * 0.015, 0.2 + i * 0.02), inkLens[i])
        el.setAttribute('stroke-width', INK + 50 * span(t, 0.27, 0.3)) // cierra cualquier borde al terminar, antes de las líneas
      })
      strokeRefs.current.forEach((el, i) => {
        const at = 0.31 + i * 0.015
        dash(el, sweepLens[i] * span(t, at + 0.05, at + 0.2), sweepLens[i] * span(t, at, at + 0.15), sweepLens[i])
        el.style.opacity = t > at && t < at + 0.2 ? 1 : 0
      })
      // Al pasar las líneas por el centro, el logo queda entero y limpio
      if (t > 0.38) imageRefs.current.forEach((el) => el.removeAttribute('mask'))

      const move = span(t, 0.5, 0.66)
      const box = Object.fromEntries(['x', 'y', 'w', 'h'].map((k) => [k, scene.start[k] + (scene.end[k] - scene.start[k]) * move]))
      logoRef.current.setAttribute('transform', `translate(${box.x} ${box.y}) scale(${box.w / LOGO_W} ${box.h / LOGO_H})`)

      threadRefs.current.forEach((el, i) => {
        const head = threadLens[i] * span(t, 0.58, arrivals[i])
        dash(el, leadLens[i] * span(t, 0.62, 0.71), head, threadLens[i])
        el.style.opacity = head > 0 ? 0.8 : 0
      })
      arrivals.forEach((at, i) => {
        if (t >= at - 0.02 && slots[i] && !risen.has(slots[i])) rise(slots[i])
      })
      veilRef.current.style.opacity = 1 - span(t, 0.7, 0.86)
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
      if (mark) mark.style.visibility = ''
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
            {STROKE_PATHS.map((d, i) => (
              <g key={d}>
                <mask id={`threads-intro-ink-${i}`} maskUnits="userSpaceOnUse" x="-60" y="-60" width={LOGO_W + 120} height={LOGO_H + 120}>
                  <path ref={(el) => { maskRefs.current[i] = el }} d={d} fill="none" stroke="#fff" strokeWidth={INK} strokeLinecap="round" />
                </mask>
                <image ref={(el) => { imageRefs.current[i] = el }} href={img(`brand/trazos/${i + 1}`)} width={LOGO_W} height={LOGO_H} preserveAspectRatio="none" mask={`url(#threads-intro-ink-${i})`} />
              </g>
            ))}
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
