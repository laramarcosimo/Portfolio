import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import { carouselCards, projects } from '../data/content'

const GAP = 16

export default function Portfolio() {
  const [index, setIndex] = useState(2)
  const [cardW, setCardW] = useState(270)
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    const update = () => setCardW(window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 230 : 270)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const last = carouselCards.length - 1
  const go = (i) => setIndex(Math.max(0, Math.min(last, i)))
  const x = -(index + 0.5) * (cardW + GAP) + GAP / 2
  const current = carouselCards[index]
  const project = projects.find((p) => p.id === current.projectId)
  const open = projects.find((p) => p.id === openId)

  return (
    <section
      id="portafolio"
      aria-roledescription="carrusel"
      aria-label="Portafolio"
      className="relative py-32 sm:py-40"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === 'ArrowRight') go(index + 1)
      }}
    >
      <div className="absolute inset-0 -z-10 bg-white" aria-hidden="true" />
      <h2 className="sr-only">Portafolio</h2>

      <div className="relative z-10">
        {/* Las cintas se enroscan por detrás de las tarjetas y forman el riel bajo este contenedor */}
        <div id="carousel" className="relative mx-auto h-[300px] overflow-x-clip sm:h-[340px]">
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
            {carouselCards.map((c, i) => {
              const active = i === index
              const p = projects.find((pr) => pr.id === c.projectId)
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => (active ? setOpenId(c.projectId) : go(i))}
                  aria-label={active ? `Abrir proyecto ${p.title}` : `Ir a ${p.title}`}
                  aria-current={active}
                  animate={{ scale: active ? 1.16 : 1 }}
                  whileHover={{ y: -6 }}
                  className="shrink-0 overflow-hidden rounded-[3px] bg-fog shadow-md transition-shadow hover:shadow-xl hover:shadow-navy/20"
                  style={{ width: cardW, aspectRatio: '5 / 4' }}
                >
                  <img src={c.src} alt={`${p.title}: ${p.category}`} draggable="false" className="h-full w-full object-cover" />
                </motion.button>
              )
            })}
          </motion.div>

          {[
            { dir: -1, Icon: ChevronLeft, label: 'Anterior', side: 'left-4' },
            { dir: 1, Icon: ChevronRight, label: 'Siguiente', side: 'right-4' },
          ].map(({ dir, Icon, label, side }) => (
            <button
              key={label}
              onClick={() => go(index + dir)}
              disabled={index + dir < 0 || index + dir > last}
              aria-label={label}
              className={`absolute ${side} top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-md transition hover:bg-sky/30 disabled:opacity-30`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        <div className="mt-40 text-center" aria-live="polite">
          <p className="text-sm font-semibold text-navy">
            {project.title} <span className="font-medium text-navy/55">· {project.category}</span>
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-0.5 px-6">
            {carouselCards.map((c, i) => (
              <button key={c.id} onClick={() => go(i)} aria-label={`Ir a la tarjeta ${i + 1}`} aria-current={i === index} className="grid h-5 w-5 place-items-center">
                <span className={`block h-1.5 w-1.5 rounded-full transition-colors ${i === index ? 'bg-navy' : 'bg-navy/20'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal key={open.id} project={open} onClose={() => setOpenId(null)} />}</AnimatePresence>
    </section>
  )
}
