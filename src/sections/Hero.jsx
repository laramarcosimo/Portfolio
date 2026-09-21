import { motion } from 'framer-motion'
import { hero } from '../data/content'

export default function Hero() {
  return (
    // En móvil el hero es más bajo (no una pantalla vacía) y el titular más grande y equilibrado
    <section id="inicio" className="relative pb-20 sm:min-h-[calc(100svh-4rem)] sm:pb-0">
      <div className="relative z-10 px-6 pt-20 text-center sm:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-display text-balance text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-navy sm:text-6xl sm:font-medium"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 text-base font-medium text-navy/60 sm:mt-3 sm:text-sm"
        >
          {hero.tagline}
        </motion.p>
      </div>
    </section>
  )
}
