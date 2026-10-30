import { FileText } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { InstagramIcon, LinkedInIcon } from '../components/BrandIcons'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { DUR, EASE_EXPO } from '../lib/motion'

/**
 * Contacto: un cartel marino, igual en ambos temas. La palabra es el cartel, el correo su primera línea;
 * las vías de contacto son pestañas de carpeta, en sus colores, que nacen del borde inferior.
 */
export default function Contact() {
  const { site, contactItems } = useContent()
  const t = useUi()
  const reduce = useReducedMotion()
  const [user, domain] = site.email.split('@')
  const by = Object.fromEntries(contactItems.map((c) => [c.kind, c]))
  const routes = [
    { key: 'wa', tone: 'sky', Icon: WhatsAppIcon, name: 'WhatsApp', detail: by.phone.label, href: by.phone.href },
    { key: 'li', tone: 'lilac', Icon: LinkedInIcon, name: 'LinkedIn', detail: site.name, href: by.linkedin.href },
    { key: 'ig', tone: 'ivory', Icon: InstagramIcon, name: 'Instagram', detail: site.instagramHandle, href: by.instagram.href },
  ]
  const rise = (delay) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: DUR.slow, delay, ease: EASE_EXPO } })

  return (
    <section id="contacto" className="contact-stage">
      <span className="folder-waves contact-waves" aria-hidden="true" />
      <motion.h1 {...rise(0)} className="contact-title">{t.contacto}</motion.h1>
      <div className="contact-line">
        <motion.a {...rise(0.08)} href={`mailto:${site.email}`} className="contact-mail" aria-label={`${t.correoElectronico}: ${site.email}`}>
          {user}<span className="contact-mail-at">@{domain}</span>
        </motion.a>
        <p className="text-base font-medium text-ivory/90 sm:text-lg">{t.heroUbicacion}</p>
      </div>
      <ul className="contact-routes">
        {routes.map(({ key, tone, Icon, name, detail, href }, i) => (
          <motion.li key={key} {...rise(0.15 + i * 0.08)}>
            <a href={href} target="_blank" rel="noreferrer" className={`contact-route contact-route--${tone}`}>
              <Icon size={28} />
              <span className="contact-route-name">{name}</span>
              <span className="contact-route-detail">{detail}</span>
            </a>
          </motion.li>
        ))}
        <motion.li {...rise(0.39)}>
          <Link to="/curriculum" className="contact-route contact-route--navy">
            <FileText size={28} strokeWidth={1.75} aria-hidden="true" />
            <span className="contact-route-name">{t.curriculumLabel}</span>
            <span className="contact-route-detail">{t.contactoCv}</span>
          </Link>
        </motion.li>
      </ul>
    </section>
  )
}
