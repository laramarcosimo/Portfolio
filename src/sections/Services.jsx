import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { services } from '../data/content'

const tones = {
  sky: { bg: 'bg-sky/25', icon: 'text-[#4f9be0]' },
  lilac: { bg: 'bg-lilac/20', icon: 'text-lilac' },
}

export default function Services() {
  return (
    <section id="servicios" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lilac">Servicios</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Cómo puedo ayudarte</h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text, tone }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span className={`grid h-16 w-16 place-items-center rounded-2xl ${tones[tone].bg}`}>
                <Icon size={30} strokeWidth={1.5} className={tones[tone].icon} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-navy/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
