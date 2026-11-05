import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { img } from '../data/content'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

const PHOTOS = ['about/color1', 'about/color2', 'about/color3', 'about/curiosa', 'about/color5', 'about/color6', 'about/creativa']
const WHOLE = new Set(['about/curiosa']) // fotos con fondo blanco: se muestran enteras, sin recortar
const STEP = 13 // grados entre tarjetas sobre el arco
const RADIUS = 'var(--about-r)'
const LOOP = PHOTOS.length * 2 // el juego se repite: el arco siempre está lleno y da la vuelta sin fin
const TURN = LOOP * STEP

/** Una tarjeta sobre el arco: su ángulo sale del avance del scroll y, al salir por un lado, vuelve a entrar por el otro. */
function Card({ i, progress, src, word, whole }) {
  const angle = useTransform(progress, (p) => {
    const a = (((i - p * PHOTOS.length * 1.5) * STEP) % TURN + TURN) % TURN
    return a > TURN / 2 ? a - TURN : a
  })
  const transform = useTransform(angle, (a) => `rotate(${a}deg) translateY(calc(${RADIUS} * -1))`)
  const opacity = useTransform(angle, (a) => Math.max(0, 1 - Math.max(0, Math.abs(a) - 34) / 12))
  return (
    <motion.figure className="about-card" style={{ transform, opacity }}>
      <img src={src} alt="" decoding="async" className={whole ? 'about-whole' : undefined} />
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const words = t.aboutWords
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="sobre-mi-titulo" className={`about${reduce ? ' about--still' : ''}`}>
      <div className="about-sticky">
        <h2 id="sobre-mi-titulo" className="about-title">{about.title}</h2>
        <div className="about-stage">
          <ul className="about-arc">
            {reduce
              ? PHOTOS.map((p, i) => (
                  <li key={p}><figure className="about-card"><img src={img(p)} alt="" loading="lazy" decoding="async" /><figcaption>{words[i]}</figcaption></figure></li>
                ))
              : Array.from({ length: LOOP }, (_, i) => (
                  <li key={i} aria-hidden={i >= PHOTOS.length || undefined}>
                    <Card i={i} progress={scrollYProgress} src={img(PHOTOS[i % PHOTOS.length])} word={words[i % PHOTOS.length]} whole={WHOLE.has(PHOTOS[i % PHOTOS.length])} />
                  </li>
                ))}
          </ul>
        </div>
        <div className="about-copy">
          <p className="about-text">{t.sobreMiCorto}</p>
          <Link to="/curriculum" className="text-link">{t.verCurriculum}</Link>
        </div>
      </div>
    </section>
  )
}
