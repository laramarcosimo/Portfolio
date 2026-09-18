import { useScroll } from 'framer-motion'

/** Progreso (0→1) de una sección al entrar en pantalla: dibuja las cintas al hacer scroll. */
export default function useRibbonProgress(ref) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'center 50%'] })
  return scrollYProgress
}
