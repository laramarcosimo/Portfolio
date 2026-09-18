import { motion } from 'framer-motion'
import SectionDots from '../components/SectionDots'
import { hero } from '../data/content'

export default function Hero({ active }) {
  return (
    <section id="inicio" className="relative min-h-[calc(100svh-4rem)]">
      <div className="absolute inset-0 -z-10 bg-fog" aria-hidden="true" />

      <div className="relative z-10 px-5 pt-16 text-center sm:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-display text-4xl font-medium leading-tight tracking-tight text-navy sm:text-6xl"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 text-sm font-medium text-navy/60"
        >
          {hero.tagline}
        </motion.p>
      </div>

      <SectionDots current={active} className="absolute inset-x-0 bottom-8 z-10" />
    </section>
  )
}
