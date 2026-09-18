import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { img, services, toolLabels } from '../data/content'

export default function Services() {
  return (
    <section id="servicios" className="relative pb-44 pt-24 sm:pb-52 sm:pt-28">
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="mb-2 text-sm font-bold text-lilac">Servicios</p>
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Cómo puedo ayudarte</h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text, tools }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icono duotono: trazo marino sobre disco cielo/lavanda */}
              <span className="relative grid h-16 w-16 place-items-center">
                <span className="absolute inset-0 rounded-full bg-sky/30" aria-hidden="true" />
                <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-lilac/30" aria-hidden="true" />
                <Icon size={28} strokeWidth={1.6} className="relative text-navy" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/75">{text}</p>
              <div className="mt-4 flex gap-2">
                {tools.map((t) => (
                  <img key={t} src={img(`tools/${t}`)} alt={toolLabels[t]} title={toolLabels[t]} className="h-7 w-7" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
