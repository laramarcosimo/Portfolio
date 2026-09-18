import { useRef } from 'react'
import { motion } from 'framer-motion'
import RibbonTrack from '../components/Ribbon'
import useRibbonProgress from '../hooks/useRibbonProgress'
import SectionDots from '../components/SectionDots'
import Reveal from '../components/Reveal'
import { services, site } from '../data/content'

export default function Services() {
  const ref = useRef(null)
  const progress = useRibbonProgress(ref)

  return (
    <section id="servicios" ref={ref} className="relative bg-white pb-24 pt-60 sm:pb-32 sm:pt-64">
      <RibbonTrack name="services" progress={progress} className="inset-x-0 top-0 z-[1] h-[260px] " />
      <SectionDots current="servicios" className="absolute inset-x-0 bottom-6" />

      {/* Marca de agua */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 select-none text-[16rem] font-extrabold italic leading-none tracking-tighter text-navy/[0.04] sm:text-[24rem]"
      >
        {site.monogram}
      </span>

      <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-4xl tracking-tight text-navy">Servicios</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-navy/65">
            Diseño y desarrollo con un enfoque claro, cuidado y a medida.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Icon size={34} strokeWidth={1.4} className="text-navy" />
              <h3 className="mt-4 text-sm font-bold text-navy">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-navy/65">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
