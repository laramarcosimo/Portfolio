import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageSquare } from 'lucide-react'

export default function FloatingAction({ active }) {
  const atContact = active === 'contacto'
  return (
    <AnimatePresence mode="wait">
      <motion.a
        key={atContact ? 'top' : 'chat'}
        href={atContact ? '#inicio' : '#contacto'}
        aria-label={atContact ? 'Volver arriba' : 'Ir a contacto'}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-navy text-white shadow-xl shadow-navy/30 ring-4 ring-white/70"
      >
        {atContact ? <ArrowUp size={20} /> : <MessageSquare size={20} />}
      </motion.a>
    </AnimatePresence>
  )
}
