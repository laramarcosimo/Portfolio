import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import RibbonSet from '../components/Ribbon'
import Button from '../components/Button'
import { navLinks } from '../data/content'

export default function Hero({ active }) {
  return (
    <section id="inicio" className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center overflow-hidden bg-white">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-5 pt-16 text-center sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-full border border-navy/10 bg-mist px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy"
        >
          Lara Marcos Simó · Diseño &amp; Front-End
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl md:text-7xl"
        >
          Creatividad <span className="text-lilac">Minimalista</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-xl text-base text-navy/70 sm:text-lg"
        >
          Interfaces y marcas con calma visual: menos ruido, más intención.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
          <Button href="#portafolio">
            Ver proyectos <ArrowDown size={16} />
          </Button>
        </motion.div>
      </div>

      <RibbonSet variant="hero" className="inset-x-0 bottom-0 z-0 h-[52%] min-h-[240px]" />

      <nav
        aria-label="Secciones"
        className="relative z-10 mb-6 flex items-center gap-2 rounded-full bg-white/85 px-4 py-2.5 shadow-md backdrop-blur"
      >
        {navLinks.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            aria-label={l.label}
            title={l.label}
            className="grid h-5 w-5 place-items-center"
          >
            <span
              className={`block rounded-full transition-all ${
                active === l.id ? 'h-2.5 w-7 bg-navy' : 'h-2.5 w-2.5 bg-navy/25 hover:bg-sky'
              }`}
            />
          </a>
        ))}
      </nav>
    </section>
  )
}
