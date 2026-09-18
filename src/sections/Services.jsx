import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { img, services, toolLabels } from '../data/content'

export default function Services() {
  return (
    <section id="servicios" className="relative overflow-hidden pb-44 pt-20 sm:pb-52 sm:pt-24">
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />

      {/* Marca de agua con el monograma */}
      <img
        src={img('brand/monograma')}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] w-[28rem] max-w-none -translate-x-1/2 -translate-y-[60%] select-none opacity-[0.05] sm:w-[36rem]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy">Servicios</h2>
          <p className="mx-auto mt-2 max-w-md text-xs text-navy/60">
            Diseño gráfico, identidad visual, motion y estrategia, con un enfoque claro y cuidado.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text, tools }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Icon size={34} strokeWidth={1.3} className="text-navy" />
              <h3 className="mt-3 text-[13px] font-bold text-navy">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-navy/65">{text}</p>
              <div className="mt-3 flex gap-1.5">
                {tools.map((t) => (
                  <img key={t} src={img(`tools/${t}`)} alt={toolLabels[t]} title={toolLabels[t]} className="h-5 w-5 opacity-90" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
