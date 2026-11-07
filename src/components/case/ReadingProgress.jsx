import { createPortal } from 'react-dom'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Barra fina de progreso de lectura del proyecto: se rellena en lavanda al bajar. En el body para que la transición de página no la desplace. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return createPortal(<motion.div className="reading-progress" style={{ scaleX }} aria-hidden="true" />, document.body)
}
