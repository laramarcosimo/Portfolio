import { motion, useReducedMotion } from 'framer-motion'
import { useContactRoutes } from '../components/useContactRoutes'
import { useUi } from '../i18n/ui'
import { DUR, EASE_EXPO } from '../lib/motion'

const TONES = { mail: 'ivory', wa: 'sky', li: 'lilac', ig: 'navy' }

/** Contacto: un cartel marino, igual en ambos temas. La palabra es el cartel; las vías son pestañas de carpeta que llenan el resto, desde el borde inferior. */
export default function Contact() {
  const routes = useContactRoutes()
  const t = useUi()
  const reduce = useReducedMotion()
  const rise = (delay) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: DUR.slow, delay, ease: EASE_EXPO } })

  return (
    <section id="contacto" className="contact-stage">
      <span className="folder-waves contact-waves" aria-hidden="true" />
      <motion.h1 {...rise(0)} className="contact-title">{t.contacto}</motion.h1>
      <motion.p {...rise(0.08)} className="contact-line">{t.heroUbicacion}</motion.p>
      <ul className="contact-routes">
        {routes.map(({ key, Icon, name, detail, href, external }, i) => (
          <motion.li key={key} {...rise(0.15 + i * 0.08)}>
            <a href={href} {...(external && { target: '_blank', rel: 'noreferrer' })} className={`contact-route contact-route--${TONES[key]}`}>
              <Icon size={28} />
              <span className="contact-route-name">{name}</span>
              <span className="contact-route-detail">{detail}</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
