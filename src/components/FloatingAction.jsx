import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, MessageSquare } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/** Botón flotante: lleva a Contacto; en la página de contacto sirve para volver arriba. */
export default function FloatingAction() {
  const { pathname } = useLocation()
  const atContact = pathname === '/contacto'
  const cls =
    'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 sm:bottom-6 sm:right-6 grid h-12 w-12 place-items-center rounded-full bg-navy text-white shadow-xl shadow-navy/30 ring-4 ring-white/70'
  return (
    <AnimatePresence mode="wait">
      <motion.div key={atContact ? 'top' : 'chat'} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className={cls}>
        {atContact ? (
          <button aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="grid h-full w-full place-items-center">
            <ArrowUp size={20} />
          </button>
        ) : (
          <Link to="/contacto" aria-label="Ir a contacto" className="grid h-full w-full place-items-center">
            <MessageSquare size={20} />
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
