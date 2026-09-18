import { useState } from 'react'
import { motion } from 'framer-motion'
import { AtSign, Check, MapPin, MessageCircle, Send } from 'lucide-react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { contact, site } from '../data/content'

const field =
  'mt-1.5 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-medium text-navy placeholder:text-navy/40 transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/40'

const details = [
  { icon: AtSign, label: site.email, href: `mailto:${site.email}` },
  { icon: MessageCircle, label: site.phone, href: site.whatsapp },
  { icon: MapPin, label: site.city },
]

export default function Contact() {
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
    <section id="contacto" className="relative pb-28 pt-40 sm:pt-44">
      <div className="absolute inset-0 -z-10 bg-mist" aria-hidden="true" />

      {/* El arco de cintas enmarca este bloque */}
      <div className="relative z-10 mx-auto grid max-w-5xl gap-12 px-6 sm:px-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">{contact.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-navy/80">{contact.text}</p>
          <ul className="mt-8 space-y-4">
            {details.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className={`flex items-center gap-3 text-sm font-semibold text-navy ${href ? 'hover:text-lilac' : ''}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sky/30">
                    <Icon size={18} />
                  </span>
                  {label}
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
          className="space-y-4 rounded-3xl bg-white p-6 shadow-xl shadow-navy/10 sm:p-8"
        >
          <label className="block text-sm font-bold text-navy">
            Nombre
            <input name="name" required autoComplete="name" placeholder="Tu nombre" className={field} />
          </label>
          <label className="block text-sm font-bold text-navy">
            Email
            <input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className={field} />
          </label>
          <label className="block text-sm font-bold text-navy">
            Mensaje
            <textarea name="message" required rows={4} placeholder="Cuéntame sobre tu proyecto" className={`${field} resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <Button as="button" type="submit">
              Enviar mensaje <Send size={15} />
            </Button>
            {sent && (
              <p role="status" className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                <Check size={16} className="text-lilac" /> Se abrirá tu aplicación de correo.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
