import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionDots from '../components/SectionDots'
import { contact, site } from '../data/content'

const field =
  'mt-1 w-full rounded-[3px] border border-navy/20 bg-white px-3 py-2 text-[13px] text-navy placeholder:text-navy/35 transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/40'

export default function Contact({ active }) {
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
      {/* Banda gris: aquí termina el remolino de cintas, cortado a ras del borde inferior */}
      <div id="contact-band" className="relative h-[300px] overflow-hidden sm:h-[380px]">
        <div className="absolute inset-0 -z-10 bg-fog" aria-hidden="true" />
        <SectionDots current={active} className="absolute inset-x-0 top-6 z-10" />
        {/* Formas decorativas suaves */}
        <span className="absolute left-[14%] top-[34%] h-4 w-4 rotate-45 bg-lilac/25" aria-hidden="true" />
        <span className="absolute right-[15%] top-[44%] h-3 w-3 rotate-45 bg-lilac/25" aria-hidden="true" />
        <span className="absolute -left-10 top-[40%] h-44 w-44 rounded-full bg-navy/[0.04]" aria-hidden="true" />
        <span className="absolute right-[6%] top-[18%] h-10 w-10 rounded-full bg-navy/[0.05]" aria-hidden="true" />
      </div>

      <div className="relative z-10 bg-white">
      <div className="mx-auto grid max-w-3xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 md:gap-14">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight text-navy">{contact.title}</h2>
          <p className="mt-3 text-xs leading-relaxed text-navy/70">{contact.text}</p>
          <ul className="mt-5 space-y-1.5 text-xs font-medium text-navy">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-lilac">{site.email}</a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-lilac">{site.phone}</a>
            </li>
            <li className="text-navy/60">{site.city}</li>
          </ul>
          <Button href={`mailto:${site.email}`} className="mt-5">
            Contactar
          </Button>
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
            <textarea name="message" required rows={3} placeholder="Cuéntame sobre tu proyecto" className={`${field} resize-none`} />
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
