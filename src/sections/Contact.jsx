import { useState } from 'react'
import { motion } from 'framer-motion'
import { AtSign, Check, MessageCircle, Send } from 'lucide-react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionDots from '../components/SectionDots'
import { contactItems, site } from '../data/content'

const field =
  'mt-1 w-full rounded-[3px] border border-navy/20 bg-white px-3 py-2 text-[13px] text-navy placeholder:text-navy/35 transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/40'

// Iconos de los enlaces de contacto (la web original: correo, WhatsApp, LinkedIn e Instagram)
const brandPaths = {
  instagram:
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm4.5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z',
  linkedin:
    'M4.5 9h3.5v11H4.5V9Zm1.75-5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.3v1.6h.05C13.8 9.7 15 9 16.6 9c3.4 0 4 2.2 4 5.1V20h-3.5v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10V9Z',
}

function ContactIcon({ kind }) {
  if (kind === 'mail') return <AtSign size={18} />
  if (kind === 'phone') return <MessageCircle size={18} />
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={brandPaths[kind]} />
    </svg>
  )
}

/** Bloque de contacto: los cuatro enlaces de la web original y un formulario. `band`: banda gris con el remolino de cintas (portada). */
export default function Contact({ active, band = false }) {
  const [sent, setSent] = useState(false)

  // Sin backend: abre el cliente de correo con el mensaje ya redactado.
  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = `Contacto desde el portafolio — ${data.get('name')}`
    const body = `${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contacto" className="relative">
      {band && (
        // Banda gris: aquí termina el recorrido de cintas, cortado a ras del borde inferior
        <div id="contact-band" className="relative h-[300px] overflow-hidden sm:h-[380px]">
          <div className="absolute inset-0 -z-10 bg-fog" aria-hidden="true" />
          <SectionDots current={active} className="absolute inset-x-0 top-6 z-10" />
          <span className="absolute left-[14%] top-[34%] h-4 w-4 rotate-45 bg-lilac/25" aria-hidden="true" />
          <span className="absolute right-[15%] top-[44%] h-3 w-3 rotate-45 bg-lilac/25" aria-hidden="true" />
          <span className="absolute -left-10 top-[40%] h-44 w-44 rounded-full bg-navy/[0.04]" aria-hidden="true" />
          <span className="absolute right-[6%] top-[18%] h-10 w-10 rounded-full bg-navy/[0.05]" aria-hidden="true" />
        </div>
      )}

      <div className="relative z-10 bg-white">
        <div className="mx-auto grid max-w-3xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-14">
          <Reveal>
            <h2 className="text-3xl font-medium tracking-tight text-navy">Contacto</h2>
            <ul className="mt-6 space-y-3">
              {contactItems.map((c) => (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.kind === 'mail' ? undefined : '_blank'}
                    rel="noreferrer"
                    className="flex items-center gap-3 text-[13px] font-semibold text-navy transition hover:text-lilac"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-sky/30">
                      <ContactIcon kind={c.kind} />
                    </span>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
          >
            <label className="block text-xs font-medium text-navy">
              Nombre <span className="text-red-500">*</span>
              <input name="name" required autoComplete="name" placeholder="Tu nombre" className={field} />
            </label>
            <label className="block text-xs font-medium text-navy">
              Email <span className="text-red-500">*</span>
              <input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className={field} />
            </label>
            <label className="block text-xs font-medium text-navy">
              Mensaje <span className="text-red-500">*</span>
              <textarea name="message" required rows={3} placeholder="Mensaje" className={`${field} resize-none`} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Button as="button" type="submit">
                Enviar <Send size={14} />
              </Button>
              {sent && (
                <p role="status" className="flex items-center gap-1.5 text-xs font-medium text-navy">
                  <Check size={14} className="text-lilac" /> Se abrirá tu aplicación de correo.
                </p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
