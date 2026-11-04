import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useContactRoutes } from '../components/useContactRoutes'
import { useUi } from '../i18n/ui'
import { DUR, EASE_EXPO } from '../lib/motion'

const TONES = { mail: 'ivory', wa: 'sky', li: 'lilac', ig: 'navy' }
const THREAD = { ivory: '#5d74b5', sky: '#96c9ff', lilac: '#9690e4', navy: '#192a56' } // la tarjeta blanca lleva un azul medio para que su hilo se vea
const GAP = 12 // px entre hilos al nacer

/** S de un solo trazo, vertical al salir y al llegar, igual que en Proyectos. */
const flowing = (sx, sy, ex, ey) => {
  const pull = (ey - sy) * 0.62
  return `M${sx} ${sy}C${sx} ${sy + pull} ${ex} ${ey - pull} ${ex} ${ey}`
}

/** Hilos desde el título hasta cada tarjeta. Solo con las tarjetas en fila (escritorio). */
function ContactThreads({ stageRef, titleRef, cardRefs, tones }) {
  const reduce = useReducedMotion()
  const [box, setBox] = useState(null)
  useEffect(() => {
    const stage = stageRef.current
    const measure = () => {
      if (!window.matchMedia('(min-width: 1024px)').matches) return setBox(null)
      const s = stage.getBoundingClientRect()
      const t = titleRef.current.getBoundingClientRect()
      const cards = cardRefs.current.map((c) => c?.getBoundingClientRect())
      if (cards.some((c) => !c)) return setBox(null)
      const sx = t.left - s.left + t.width * 0.18
      const sy = t.bottom - s.top + 8
      const inset = Math.min(...cards.map((c) => c.width)) / 2
      setBox({
        w: s.width,
        h: s.height,
        paths: cards.map((c, i) => flowing(sx + (i - (cards.length - 1) / 2) * GAP, sy, c.left - s.left + inset, c.top - s.top + 1)),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [stageRef, titleRef, cardRefs])
  if (!box) return null
  return (
    <svg className="contact-threads" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
      {box.paths.map((d, i) => (
        <motion.path
          key={tones[i]}
          d={d}
          fill="none"
          stroke={THREAD[tones[i]]}
          strokeWidth={1.75}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.75, delay: 0.3 + i * 0.06, ease: EASE_EXPO }}
        />
      ))}
    </svg>
  )
}

/** Contacto: sobre el fondo de la web, como Inicio. Del título bajan hilos hasta cada vía de contacto, como en Proyectos. */
export default function Contact() {
  const routes = useContactRoutes()
  const t = useUi()
  const reduce = useReducedMotion()
  const stageRef = useRef(null)
  const titleRef = useRef(null)
  const cardRefs = useRef([])
  const rise = (delay) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: DUR.slow, delay, ease: EASE_EXPO } })

  return (
    <section ref={stageRef} id="contacto" className="contact-stage">
      <span className="folder-waves contact-waves" aria-hidden="true" />
      <ContactThreads stageRef={stageRef} titleRef={titleRef} cardRefs={cardRefs} tones={routes.map((r) => TONES[r.key])} />
      <div ref={titleRef} className="contact-head">
        <motion.h1 {...rise(0)} className="contact-title">{t.contacto}</motion.h1>
        <motion.p {...rise(0.08)} className="contact-line">{t.heroUbicacion}</motion.p>
      </div>
      <ul className="contact-routes">
        {routes.map(({ key, Icon, name, detail, href, external }, i) => (
          <li key={key} ref={(el) => { cardRefs.current[i] = el }}>
            <motion.a {...rise(0.15 + i * 0.08)} href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} className={`contact-route contact-route--${TONES[key]}`}>
              <Icon size={24} />
              <span className="contact-route-name">{name}</span>
              <span className="contact-route-detail">{detail}</span>
            </motion.a>
          </li>
        ))}
      </ul>
    </section>
  )
}
