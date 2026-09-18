import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import RibbonSet from '../components/Ribbon'
import Button from '../components/Button'
import Reveal from '../components/Reveal'

const field =
  'w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/30'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con un backend / servicio de formularios (Formspree, Resend, etc.)
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-mist py-24 sm:py-32">
      <Reveal className="relative z-10 mx-auto mb-12 max-w-xl px-5 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lilac">Contacto</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Hablemos de tu proyecto</h2>
      </Reveal>

      <div className="relative mx-auto max-w-2xl px-5">
        {/* Cintas que envuelven la tarjeta: unas detrás, otras por delante de los bordes */}
        <RibbonSet variant="contactBack" className="-inset-y-[18%] left-1/2 z-0 w-screen -translate-x-1/2" />

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 space-y-4 rounded-3xl bg-white p-6 pt-12 shadow-2xl shadow-navy/15 sm:p-10 sm:pt-14"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-navy">
              Nombre
              <input name="name" required autoComplete="name" placeholder="Tu nombre" className={`${field} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium text-navy">
              Email
              <input name="email" type="email" required autoComplete="email" placeholder="tu@email.com" className={`${field} mt-1.5`} />
            </label>
          </div>
          <label className="block text-sm font-medium text-navy">
            Mensaje
            <textarea name="message" required rows={5} placeholder="Cuéntame sobre tu proyecto" className={`${field} mt-1.5 resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <Button as="button" type="submit">
              Enviar mensaje <Send size={16} />
            </Button>
            {sent && (
              <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-navy">
                <Check size={16} className="text-lilac" /> ¡Gracias! Te responderé pronto.
              </p>
            )}
          </div>
        </motion.form>

        <RibbonSet variant="contactFront" className="-inset-y-[18%] left-1/2 z-20 w-screen -translate-x-1/2" />
      </div>
    </section>
  )
}
