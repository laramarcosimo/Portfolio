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

/** Entrada y salida suaves y amplias. */
const flow = (t, from, to) => {
  const n = clamp((t - from) / (to - from))
  return n < 0.5 ? 8 * n ** 4 : 1 - (-2 * n + 2) ** 4 / 2
}

/**
 * Pantalla de carga: el monograma se dibuja en el centro, se apaga, aparece un montón de carpetas
 * cerradas y estas se reparten hasta su sitio mientras la web aparece alrededor. Son copias de las
 * carpetas reales, así que al terminar el relevo no se nota. En escritorio se dibujan luego los hilos.
 * trace: mide los hilos (null si no hay) · rootRef: su contenedor · colors: color de cada hilo.
 */
export default function ThreadsIntro({ trace, rootRef, colors, onDone }) {
  const [scene, setScene] = useState(null)
  const veilRef = useRef(null)
  const logoRef = useRef(null)
  const imageRefs = useRef([])
  const maskRefs = useRef([])
  const threadRefs = useRef([])
  const stackRef = useRef(null)

  useEffect(() => {
    let alive = true
    const timeout = new Promise((resolve) => { setTimeout(resolve, FONT_WAIT_MS) })
    // Cargar la fuente antes de medir: con la de sustitución el título ocupa otra altura y los hilos no encajarían
    const fonts = document.fonts ? document.fonts.load("700 1em 'Quicksand'").then(() => document.fonts.ready) : timeout
    Promise.race([fonts, timeout]).then(() => {
      if (!alive) return
      const box = trace()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const h = Math.min(vh * 0.36, vw * (vw < 768 ? 0.36 : 0.6), 300)
      setScene({
        w: vw,
        h: vh,
        top: box ? rootRef.current.getBoundingClientRect().top : 0,
        logo: { x: (vw - h) / 2, y: (vh - h) / 2, size: h },
        threads: box ? box.threads.map(({ d }) => d) : [],
      })
    }).catch(onDone) // si algo falla, la web se muestra igualmente
    return () => { alive = false }
  }, [trace, rootRef, onDone])

  useEffect(() => {
    if (!scene) return undefined
    const threaded = scene.threads.length > 0
    const slots = [...rootRef.current.querySelectorAll('.folder-slot')]
    slots.forEach((slot) => { slot.style.opacity = '0' })

    const inkLens = maskRefs.current.map((el) => el.getTotalLength())
    const threadLens = threadRefs.current.map((el) => el.getTotalLength())
    const stack = slots.slice(0, 3).map((slot) => ({ slot, copy: null, box: null }))
    const layDown = () => stack.forEach((item, i) => {
      const box = item.slot.getBoundingClientRect()
      const copy = item.slot.cloneNode(true)
      copy.setAttribute('inert', '')
      copy.style.cssText = `position:absolute;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;margin:0;opacity:0;will-change:transform`
      // Fuera de la portada no le llega su altura aplanada: la copia lleva la misma que la carpeta real
      copy.querySelector('.folder')?.style.setProperty('--folder-h', `${item.slot.querySelector('.folder')?.offsetHeight}px`)
      stackRef.current.appendChild(copy)
      item.copy = copy
      item.box = box
      item.tilt = (i - 1) * 4
    })
    let laid = false

    const paint = (t) => {
      if (!veilRef.current) return // ya desmontada: al pararse, la animación aún da un último paso
      maskRefs.current.forEach((el, i) => {
        dash(el, 0, inkLens[i] * span(t, 0.02 + i * 0.015, 0.22 + i * 0.02), inkLens[i])
        el.setAttribute('stroke-width', INK + 50 * span(t, 0.3, 0.33)) // cierra cualquier borde al terminar
      })
      if (t > 0.34) imageRefs.current.forEach((el) => el.removeAttribute('mask'))

      // El montón se copia aquí, con las carpetas reales ya asentadas
      if (t >= 0.36 && !laid) {
        laid = true
        layDown()
      }
      const size = scene.logo.size * 1.3
      stack.forEach(({ copy, box, tilt, slot }, i) => {
        if (!copy) return
        const shown = span(t, 0.42 + (2 - i) * 0.012, 0.52)
        const spread = flow(t, 0.52 + i * 0.02, 0.82 + i * 0.02)
        const small = Math.min(1, size / box.width)
        const dx = scene.logo.x + scene.logo.size / 2 - (box.left + box.width / 2)
        const dy = scene.logo.y + scene.logo.size / 2 - (box.top + box.height / 2) + 24 * (1 - shown)
        copy.style.opacity = shown
        copy.style.transform = `translate(${dx * (1 - spread)}px, ${dy * (1 - spread)}px) rotate(${tilt * (1 - spread)}deg) scale(${small + (1 - small) * spread})`
        if (t > 0.9) slot.style.opacity = 1 // relevo: debajo ya están las reales, idénticas
      })
      logoRef.current.style.opacity = 1 - span(t, 0.36, 0.44)
      veilRef.current.style.opacity = 1 - span(t, 0.62, 0.84)
      threadRefs.current.forEach((el, i) => {
        dash(el, 0, threadLens[i] * span(t, 0.84 + i * 0.01, 0.99), threadLens[i])
        el.style.opacity = 0.8
      })
    }
    paint(0)
    const controls = animate(0, 1, {
      duration: threaded ? 4 : 3.6,
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
        <>
          <div ref={stackRef} />
          <svg width={scene.w} height={scene.h} className="absolute inset-0">
            <g ref={logoRef} transform={`translate(${scene.logo.x} ${scene.logo.y}) scale(${scene.logo.size / LOGO_W} ${scene.logo.size / LOGO_H})`}>
              {STROKE_PATHS.map((d, i) => (
                <g key={d}>
                  <mask id={`threads-intro-ink-${i}`} maskUnits="userSpaceOnUse" x="-60" y="-60" width={LOGO_W + 120} height={LOGO_H + 120}>
                    <path ref={(el) => { maskRefs.current[i] = el }} d={d} fill="none" stroke="#fff" strokeWidth={INK} strokeLinecap="round" />
                  </mask>
                  <image ref={(el) => { imageRefs.current[i] = el }} href={img(`brand/trazos/${i + 1}`)} width={LOGO_W} height={LOGO_H} preserveAspectRatio="none" mask={`url(#threads-intro-ink-${i})`} />
                </g>
              ))}
            </g>
          </svg>
          <svg width={scene.w} height={scene.h} className="absolute inset-0">
            {scene.threads.map((d, i) => (
              <path
                key={colors[i]}
                ref={(el) => { threadRefs.current[i] = el }}
                d={d}
                transform={`translate(0 ${scene.top})`}
                fill="none"
                style={{ stroke: colors[i] }}
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            ))}
          </svg>
        </>
      )}
    </div>,
    document.body,
  )
}
