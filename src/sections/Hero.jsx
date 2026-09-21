import { motion } from 'framer-motion'
import { hero } from '../data/content'

export default function Hero() {
  return (
    // Compacto: el titular es la frase principal de la web y las líneas ocupan el hueco que queda debajo
    <section id="inicio" className="relative pb-16 sm:pb-40">
      <div className="relative z-10 px-6 pt-20 text-center sm:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-display text-balance text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-navy sm:text-6xl sm:font-medium"
        >
          {hero.title}
        </motion.h1>
      </div>
    </section>
  )
}
