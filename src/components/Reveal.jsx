import { motion } from 'framer-motion'
import { DUR, EASE_EXPO, RISE } from '../lib/motion'

/** Aparición lenta por opacidad, una sola vez, en cuanto asoma: nunca deja pantallas vacías al hacer scroll. */
export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: '0px 0px -60px 0px' }}
      transition={{ duration: DUR.slow, delay, ease: EASE_EXPO }}
    >
      {children}
    </motion.div>
  )
}
