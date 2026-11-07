import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { img } from '../data/content'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

const PHOTOS = ['about/aprender', 'about/evolucionar', 'about/curiosa', 'about/lectora', 'about/constante2', 'about/creativa2', 'about/organizada']
const WHOLE = new Set(['about/curiosa']) // fotos con fondo blanco: se muestran enteras, sin recortar
// Encuadre de cada foto dentro de la tarjeta (lo que se conserva al recortar)
const POS = { 'about/constante2': '100% 50%', 'about/lectora': '50% 0%', 'about/evolucionar': '50% 8%' }
const STEP = 13 // grados entre tarjetas sobre el arco
const RADIUS = 'var(--about-r)'
const LOOP = PHOTOS.length * 2 // el juego se repite: el arco siempre está lleno y da la vuelta sin fin
const TURN = LOOP * STEP

/** Una tarjeta sobre el arco: su ángulo sale del avance del scroll y, al salir por un lado, vuelve a entrar por el otro. */
function Card({ i, progress, src, word, whole, pos, onOpen }) {
  const angle = useTransform(progress, (p) => {
    const a = (((i - p * PHOTOS.length * 1.5) * STEP) % TURN + TURN) % TURN
    return a > TURN / 2 ? a - TURN : a
  })
  const transform = useTransform(angle, (a) => `rotate(${a}deg) translateY(calc(${RADIUS} * -1))`)
  const opacity = useTransform(angle, (a) => Math.max(0, 1 - Math.max(0, Math.abs(a) - 34) / 12))
  return (
    <motion.figure className="about-card" style={{ transform, opacity }}>
      <img src={src} alt="" decoding="async" onClick={() => onOpen(src, word)} className={whole ? 'about-whole' : undefined} style={pos && { objectPosition: pos }} />
      <figcaption>{word}</figcaption>
    </motion.figure>
  )
}

/**
 * Sobre mí: la sección se queda fija mientras el scroll hace pasar las fotos por un arco;
 * al llegar a la última, la página sigue bajando con normalidad.
 */
export default function AboutRing() {
  const { about } = useContent()
  const t = useUi()
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const stageRef = useRef(null)
  const copyRef = useRef(null)
  useLayoutEffect(() => {
    const stage = stageRef.current
    const copy = copyRef.current
    if (!stage || !copy || reduce) return undefined
    const fit = () => {
      const arc = stage.querySelector('.about-arc')
      const card = stage.querySelector('.about-card')
      if (!arc || !card) return
      const w = card.offsetWidth
      const h = card.offsetHeight
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const R = arc.offsetTop - (w * 0.8 + rem) // top del arco = about-top + radio
      const cy = -0.7 * w + h / 2 // centro de la tarjeta respecto al centro del arco
      stage.style.marginBottom = '0px'
      const textBox = copy.getBoundingClientRect()
      const arcBox = arc.getBoundingClientRect()
      const half = textBox.width / 2
      const textTop = textBox.top - arcBox.top // en coordenadas del centro del arco
      let worst = -Infinity
      for (let a = -46; a <= 46; a += 0.5) {
        const op = Math.max(0, 1 - Math.max(0, Math.abs(a) - 34) / 12)
        if (op < 0.15) continue
        const t = (a * Math.PI) / 180
        const xs = [-w / 2, w / 2].map((x) => Math.cos(t) * x - Math.sin(t) * (h / 2 - R))
        if (Math.max(...xs) < -half || Math.min(...xs) > half) continue
        for (const x of [-w / 2, w / 2]) worst = Math.max(worst, cy + Math.sin(t) * x + Math.cos(t) * (h / 2 - R))
      }
      const gap = 1.25 * rem
      stage.style.marginBottom = Math.max(0, worst + gap - textTop) + 'px'
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(document.documentElement)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [reduce])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // En móvil y tablet también se puede girar el arco arrastrando con el dedo; el scroll sigue moviéndolo igual
  const spin = useMotionValue(0)
  const progress = useTransform([scrollYProgress, spin], ([p, s]) => p + s)
  const touch = useRef(null)
  const moved = useRef(0)
  // Al tocar una foto se abre en grande; si el dedo ha arrastrado el arco, no cuenta como toque
  const [big, setBig] = useState(null)
  const open = (src, word) => { if (moved.current < 8) setBig({ src, word }) }
  useEffect(() => {
    if (!big) return
    const esc = (e) => e.key === 'Escape' && setBig(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [big])
  const onDown = (e) => { moved.current = 0; if (e.pointerType !== 'mouse') touch.current = e.clientX }
  const onMove = (e) => {
    if (touch.current == null) return
    const card = e.currentTarget.querySelector('.about-card')?.offsetWidth || 120
    moved.current += Math.abs(e.clientX - touch.current)
    spin.set(spin.get() - (e.clientX - touch.current) / (card * PHOTOS.length * 1.5))
    touch.current = e.clientX
  }
  const onUp = () => { touch.current = null }
  const words = t.aboutWords
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="sobre-mi-titulo" className={`about${reduce ? ' about--still' : ''}`}>
      <div className="about-sticky">
        <h2 id="sobre-mi-titulo" className="about-title">{about.title}</h2>
        <div ref={stageRef} className="about-stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <ul className="about-arc">
            {reduce
              ? PHOTOS.map((p, i) => (
                  <li key={p}><figure className="about-card"><img src={img(p)} alt="" loading="lazy" decoding="async" /><figcaption>{words[i]}</figcaption></figure></li>
                ))
              : Array.from({ length: LOOP }, (_, i) => (
                  <li key={i} aria-hidden={i >= PHOTOS.length || undefined}>
                    <Card i={i} progress={progress} src={img(PHOTOS[i % PHOTOS.length])} word={words[i % PHOTOS.length]} whole={WHOLE.has(PHOTOS[i % PHOTOS.length])} pos={POS[PHOTOS[i % PHOTOS.length]]} onOpen={open} />
                  </li>
                ))}
          </ul>
        </div>
        <div ref={copyRef} className="about-copy">
          <p className="about-text">{t.sobreMiCorto}</p>
          <Link to="/curriculum" className="text-link">{t.verCurriculum}</Link>
        </div>
      </div>
      {big && (
        <div className="about-big" role="dialog" aria-modal="true" aria-label={big.word} onClick={() => setBig(null)}>
          <figure>
            <img src={big.src} alt={big.word} />
            <figcaption>{big.word}</figcaption>
          </figure>
          <button type="button" className="about-big-close" aria-label="Cerrar">×</button>
        </div>
      )}
    </section>
  )
}
