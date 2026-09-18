import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import RibbonTrack from '../components/Ribbon'
import useRibbonProgress from '../hooks/useRibbonProgress'
import SectionDots from '../components/SectionDots'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import { site } from '../data/content'

const field =
  'mt-1.5 w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/40 transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/30'

export default function Contact() {
  const ref = useRef(null)
  const progress = useRibbonProgress(ref)
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con un servicio de formularios (Formspree, Resend, etc.)
    setSent(true)
    e.currentTarget.reset()
  }

  return (
    <section id="contacto" ref={ref} className="bg-white">
      {/* Banda superior con el lazo final de las cintas */}
      <div className="relative h-[300px] bg-mist sm:h-[420px]">
        <SectionDots current="contacto" className="absolute inset-x-0 top-6" />
        <RibbonTrack name="contact" progress={progress} className="inset-x-0 top-0 z-[1] h-full" />
      </div>

      <div className="mx-auto grid max-w-3xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-20">
        <Reveal>
          <h2 className="text-4xl tracking-tight text-navy">Contacto</h2>
          <p className="mt-4 text-sm leading-relaxed text-navy/70">
            ¿Tienes un proyecto en mente? Cuéntamelo y te responderé lo antes posible. También puedes escribirme a{' '}
            <a href={`mailto:${site.email}`} className="font-semibold underline decoration-sky decoration-2 underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </Reveal>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
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
            <textarea name="message" required rows={4} placeholder="Cuéntame sobre tu proyecto" className={`${field} resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <Button as="button" type="submit">
              Enviar <Send size={15} />
            </Button>
            {sent && (
              <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-navy">
                <Check size={16} className="text-lilac" /> ¡Gracias! Te responderé pronto.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  )
}
