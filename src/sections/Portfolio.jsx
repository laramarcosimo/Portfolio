import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RibbonTrack from '../components/Ribbon'
import useRibbonProgress from '../hooks/useRibbonProgress'
import SectionDots from '../components/SectionDots'
import { projects } from '../data/content'

const GAP = 28

function Mockup({ layout, colors: [a, b] }) {
  return (
    <div className="grid h-full w-full place-items-center" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
      {layout === 'browser' && (
        <div className="w-[70%] overflow-hidden rounded-md bg-white shadow-lg">
          <div className="flex gap-1 border-b border-navy/10 px-2 py-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-navy/25" />
            ))}
          </div>
          <div className="space-y-1.5 p-2.5">
            <div className="h-8 rounded-sm bg-navy/10" />
            <div className="h-1.5 w-2/3 rounded bg-navy/20" />
            <div className="h-1.5 w-1/2 rounded bg-navy/10" />
          </div>
        </div>
      )}
      {layout === 'poster' && (
        <div className="relative h-[68%] w-[58%]">
          <div className="absolute inset-0 -rotate-[8deg] rounded-sm bg-white shadow-lg" />
          <div className="absolute inset-0 rotate-[5deg] rounded-sm bg-white p-2.5 shadow-lg">
            <div className="h-7 w-7 rounded-full" style={{ background: a }} />
            <div className="mt-2 h-1.5 w-3/4 rounded bg-navy/25" />
            <div className="mt-1 h-1.5 w-1/2 rounded bg-navy/15" />
          </div>
        </div>
      )}
      {layout === 'phone' && (
        <div className="h-[82%] w-[32%] rounded-2xl border-[3px] border-white bg-white/90 p-1.5 shadow-lg">
          <div className="h-full rounded-xl" style={{ background: `linear-gradient(180deg, ${b}, ${a})` }} />
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  const progress = useRibbonProgress(ref)
  const [index, setIndex] = useState(2)
  const [cardW, setCardW] = useState(280)

  useEffect(() => {
    const update = () => setCardW(window.innerWidth < 640 ? 210 : 290)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const last = projects.length - 1
  const go = (i) => setIndex(Math.max(0, Math.min(last, i)))
  const x = -(index + 0.5) * (cardW + GAP) + GAP / 2
  const current = projects[index]

  return (
    <section
      id="portafolio"
      ref={ref}
      aria-roledescription="carrusel"
      aria-label="Portafolio"
      className="relative bg-mist py-32 sm:py-40"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === 'ArrowRight') go(index + 1)
      }}
    >
      <SectionDots current="portafolio" className="absolute inset-x-0 top-6" />
      <RibbonTrack name="portfolio" progress={progress} className="inset-0 z-[1]" />

      <h2 className="sr-only">Portafolio</h2>

      <div className="relative z-10">
        <div className="relative mx-auto h-[300px] max-w-5xl overflow-hidden sm:h-[340px]">
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
                  key={p.title}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${p.title}, ${p.category}`}
                  aria-current={active}
                  animate={{ scale: active ? 1.14 : 0.96 }}
                  whileHover={{ y: -6 }}
                  className="aspect-[4/3] shrink-0 overflow-hidden rounded-md bg-white shadow-lg transition-shadow hover:shadow-2xl hover:shadow-navy/25"
                  style={{ width: cardW }}
                >
                  <Mockup layout={p.layout} colors={p.colors} />
                </motion.button>
              )
            })}
          </motion.div>

          {[
            { dir: -1, Icon: ChevronLeft, label: 'Anterior', side: 'left-3' },
            { dir: 1, Icon: ChevronRight, label: 'Siguiente', side: 'right-3' },
          ].map(({ dir, Icon, label, side }) => (
            <button
              key={label}
              onClick={() => go(index + dir)}
              disabled={index + dir < 0 || index + dir > last}
              aria-label={label}
              className={`absolute ${side} top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-md transition hover:bg-sky/30 disabled:opacity-30`}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-navy/70" aria-live="polite">
          <span className="font-semibold text-navy">{current.title}</span> · {current.category} · {current.year}
        </p>
      </div>
    </section>
  )
}
