import { motion } from 'framer-motion'

/** Aparición suave por opacidad (una sola vez, en cuanto asoma): nunca deja pantallas vacías al hacer scroll. */
export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.01, margin: '0px 0px 120px 0px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
