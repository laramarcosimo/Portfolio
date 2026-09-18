import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import RibbonSet from '../components/Ribbon'
import Reveal from '../components/Reveal'
import { projects } from '../data/content'

function Mockup({ layout, colors: [a, b] }) {
  const bg = { background: `linear-gradient(135deg, ${a}, ${b})` }
  return (
    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl" style={bg}>
      {layout === 'browser' && (
        <div className="w-[78%] overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="flex gap-1 border-b border-navy/10 px-2.5 py-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-navy/20" />
            ))}
          </div>
          <div className="space-y-2 p-3">
            <div className="h-10 rounded bg-navy/10" />
            <div className="h-2 w-2/3 rounded bg-navy/20" />
            <div className="h-2 w-1/2 rounded bg-navy/10" />
          </div>
        </div>
      )}
      {layout === 'poster' && (
        <div className="grid h-[72%] w-[48%] rotate-[-6deg] place-items-center rounded-lg bg-white shadow-xl">
          <div className="h-14 w-14 rounded-full" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
        </div>
      )}
      {layout === 'phone' && (
        <div className="h-[82%] w-[34%] rounded-[1.25rem] border-4 border-white bg-white/90 p-2 shadow-xl">
          <div className="h-full rounded-xl" style={{ background: `linear-gradient(180deg, ${b}, ${a})` }} />
        </div>
      )}
    </div>
  )
}

export default function Portfolio() {
  const track = useRef(null)
  const [index, setIndex] = useState(0)

  const step = () => {
    const el = track.current
    const card = el?.querySelector('article')
    return card ? card.offsetWidth + 24 : 320
  }

  const onScroll = useCallback(() => {
    const el = track.current
    if (!el) return
    setIndex(Math.min(projects.length - 1, Math.round(el.scrollLeft / step())))
  }, [])

  useEffect(() => {
    onScroll()
  }, [onScroll])

  const goTo = (i) => track.current?.scrollTo({ left: i * step(), behavior: 'smooth' })
  const move = (dir) => goTo(Math.max(0, Math.min(projects.length - 1, index + dir)))

  return (
    <section id="portafolio" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <RibbonSet variant="carousel" className="inset-x-0 bottom-0 z-0 h-[65%]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-lilac">Portafolio</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Proyectos seleccionados</h2>
          </Reveal>
          <div className="flex gap-2">
            {[
              { dir: -1, Icon: ChevronLeft, label: 'Anterior', disabled: index === 0 },
              { dir: 1, Icon: ChevronRight, label: 'Siguiente', disabled: index === projects.length - 1 },
            ].map(({ dir, Icon, label, disabled }) => (
              <button
                key={label}
                onClick={() => move(dir)}
                disabled={disabled}
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-sm transition hover:border-sky hover:bg-sky/20 disabled:opacity-30"
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-14 pt-4 sm:-mx-8 sm:px-8"
        >
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -10 }}
              className="group w-[82%] shrink-0 snap-start rounded-3xl bg-white p-4 shadow-lg transition-shadow hover:shadow-2xl hover:shadow-navy/20 sm:w-[46%] lg:w-[31.5%]"
            >
              <Mockup layout={p.layout} colors={p.colors} />
              <div className="flex items-start justify-between px-2 pb-2 pt-5">
                <div>
                  <p className="text-xs font-medium text-navy/60">
                    {p.category} · {p.year}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-navy">{p.title}</h3>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-navy transition group-hover:bg-navy group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="flex justify-center gap-2 rounded-full">
          {projects.map((p, i) => (
            <button
              key={p.title}
              onClick={() => goTo(i)}
              aria-label={`Ir al proyecto ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 rounded-full bg-white shadow transition-all ${i === index ? 'w-8' : 'w-2.5 opacity-70'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
