import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import Reveal from '../components/Reveal'
import { projects } from '../data/content'

const GAP = 28

export default function Portfolio() {
  const [index, setIndex] = useState(1)
  const [cardW, setCardW] = useState(250)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    const update = () => setCardW(window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 230 : 260)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const last = projects.length - 1
  const go = (i) => setIndex(Math.max(0, Math.min(last, i)))
  const x = -(index + 0.5) * (cardW + GAP) + GAP / 2
  const current = projects[index]
  const open = projects.find((p) => p.id === openId)

  return (
    <section
      id="portafolio"
      aria-roledescription="carrusel"
      aria-label="Portafolio"
      className="relative pb-28 pt-24 sm:pb-32 sm:pt-28"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === 'ArrowRight') go(index + 1)
      }}
    >
      <div className="absolute inset-0 -z-10 bg-mist" aria-hidden="true" />

      <div className="relative z-10">
        <Reveal className="px-5 text-center">
          <p className="mb-2 text-sm font-bold text-lilac">Portafolio</p>
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Proyectos seleccionados</h2>
        </Reveal>

        {/* Las cintas forman el riel bajo el borde inferior de este contenedor */}
        <div id="carousel" className="relative mx-auto mt-10 h-[420px] max-w-5xl overflow-x-clip sm:h-[460px]">
          <motion.div
            className="absolute left-1/2 top-1/2 flex -translate-y-1/2 cursor-grab items-center active:cursor-grabbing"
            style={{ gap: GAP }}
            animate={{ x }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -50) go(index + 1)
              else if (offset.x > 50) go(index - 1)
            }}
          >
            {projects.map((p, i) => {
              const active = i === index
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => (active ? setOpenId(p.id) : go(i))}
                  aria-label={active ? `Abrir proyecto ${p.title}` : `Ir a ${p.title}`}
                  aria-current={active}
                  animate={{ scale: active ? 1.1 : 0.92 }}
                  whileHover={{ y: -8 }}
                  className="shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-2xl hover:shadow-navy/25"
                  style={{ width: cardW, aspectRatio: '3 / 4' }}
                >
                  <img src={p.cover} alt={`Portada del proyecto ${p.title}`} draggable="false" className="h-full w-full object-cover" />
                </motion.button>
              )
            })}
          </motion.div>

          {[
            { dir: -1, Icon: ChevronLeft, label: 'Proyecto anterior', side: 'left-3' },
            { dir: 1, Icon: ChevronRight, label: 'Proyecto siguiente', side: 'right-3' },
          ].map(({ dir, Icon, label, side }) => (
            <button
              key={label}
              onClick={() => go(index + dir)}
              disabled={index + dir < 0 || index + dir > last}
              aria-label={label}
              className={`absolute ${side} top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-md transition hover:bg-sky/30 disabled:opacity-30`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        <div className="mt-14 text-center" aria-live="polite">
          <p className="text-lg font-bold text-navy">{current.title}</p>
          <p className="text-sm font-medium text-navy/65">{current.category}</p>
          <button
            onClick={() => setOpenId(current.id)}
            className="mt-3 rounded-full border border-navy/20 px-5 py-2 text-sm font-semibold text-navy transition hover:border-sky hover:bg-sky/20"
          >
            Ver proyecto
          </button>
          <div className="mt-5 flex justify-center gap-1">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                aria-label={`Ir al proyecto ${i + 1}: ${p.title}`}
                aria-current={i === index}
                className="grid h-6 w-6 place-items-center"
              >
                <span className={`block h-2 rounded-full transition-all ${i === index ? 'w-6 bg-navy' : 'w-2 bg-navy/25'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal key={open.id} project={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </section>
  )
}
