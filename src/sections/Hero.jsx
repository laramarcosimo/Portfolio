import { motion } from 'framer-motion'
import RibbonTrack from '../components/Ribbon'
import SectionDots from '../components/SectionDots'

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-[calc(100svh-4rem)] bg-mist">
      <div className="relative z-10 px-5 pt-20 text-center sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl leading-tight tracking-tight text-navy sm:text-5xl md:text-6xl"
        >
          Creatividad Minimalista
        </motion.h1>
      </div>

      <RibbonTrack name="hero" className="inset-x-0 top-[26%] z-[1] h-[420px]" />

      <SectionDots current="inicio" className="absolute inset-x-0 bottom-8" />
    </section>
  )
}
