import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { flyFolder } from '../lib/folderFlight'
import { DUR, EASE_EXPO } from '../lib/motion'

const DRAG_MIN = 5 // px a partir de los que un clic ya es arrastre
const DRAG_FLICK = 60 // px de arrastre que bastan para pasar a la portada siguiente

/** La carpeta: lámina trasera con pestaña, portadas en medio y solapa delantera con su bolsillo curvo. */
function Folder({ group, items, isOpen, isOut, panelId, onToggle, buttonRef, level }) {
  const t = useUi()
  const Heading = `h${level}`
  const state = isOpen ? t.cerrar : t.abrir
  return (
    <Heading className="folder-slot">
      <button
        ref={buttonRef}
        id={`${panelId}-boton`}
        type="button"
        className={`folder folder--${group.color}`}
        data-sheets={items.length}
        data-out={isOut || undefined}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-label={`${group.label} · ${t.nProyectos(items.length)}: ${items.map((p) => p.name).join(', ')}. ${state}`}
        onClick={onToggle}
      >
        <span className="folder-tab">
          {group.label}
          <span className="font-medium"> · {t.nProyectos(items.length)}</span>
        </span>
        <span className="folder-back">
          <span className="folder-inner">
            <span className="folder-waves" aria-hidden="true" />
          </span>
        </span>
        {items.map((p) => (
          <img key={p.slug} src={p.cover} alt="" className="folder-sheet" draggable={false} />
        ))}
        <span className="folder-front">
          <span className="folder-flap">
            <span className="folder-waves" aria-hidden="true" />
          </span>
          <span className="folder-pocket">
            <span className="folder-state">
              {state}
              <span className="folder-plus" />
            </span>
          </span>
        </span>
      </button>
    </Heading>
  )
}

const WHEEL_MIN = 4 // a partir de 4 proyectos, rueda; con 3 o menos, la fila de siempre
const WHEEL_STEP = 42 // grados entre portadas vecinas
const WHEEL_TICK = 60 // delta de rueda del ratón que pasa una portada

const mod = (a, n) => ((a % n) + n) % n
/** Distancia con signo por el camino más corto en el círculo. */
const wrapped = (i, pos, n) => {
  const d = mod(i - pos, n)
  return d > n / 2 ? d - n : d
}

/** Una portada en el cilindro: su giro, escala y atenuación salen solo de la distancia al frente. */
function WheelCover({ pos, i, n, radius, reduce, to, src, alt, onPick }) {
  const transform = useTransform(pos, (p) => {
    const d = wrapped(i, p, n)
    if (reduce) return 'translate(-50%, -50%)'
    const a = (d * WHEEL_STEP * Math.PI) / 180
    return `translate(-50%, -50%) translateX(${(radius * Math.sin(a)).toFixed(1)}px) translateZ(${(radius * (Math.cos(a) - 1)).toFixed(1)}px) rotateY(${(d * WHEEL_STEP).toFixed(2)}deg)`
  })
  const opacity = useTransform(pos, (p) => {
    const d = Math.abs(wrapped(i, p, n))
    if (reduce) return d < 0.5 ? 1 : 0
    return Math.max(0, d <= 1 ? 1 - d * 0.45 : (0.55 * (1.8 - d)) / 0.8)
  })
  const zIndex = useTransform(pos, (p) => 100 - Math.round(Math.abs(wrapped(i, p, n)) * 10))
  const pointerEvents = useTransform(opacity, (o) => (o > 0.05 ? 'auto' : 'none'))
  return (
    <motion.div className="folder-cover" style={{ transform, opacity, zIndex, pointerEvents }}>
      <Link to={to} tabIndex={-1} aria-hidden="true" draggable={false} onClick={(e) => onPick(e, i)}>
        <img src={src} alt={alt} draggable={false} />
      </Link>
    </motion.div>
  )
}

/** Rueda de portadas: arrastre, rueda y flechas del teclado; siempre se detiene en la portada más cercana y da la vuelta. */
function CoverWheel({ items, label, reduce, current, setCurrent, t }) {
  const n = items.length
  const stage = useRef(null)
  const pos = useMotionValue(0)
  const target = useRef(0)
  const drag = useRef(null)
  const moved = useRef(false)
  const anim = useRef(null)
  const api = useRef(null)
  const [radius, setRadius] = useState(320)

  useEffect(() => pos.on('change', (p) => setCurrent(mod(Math.round(p), n))), [pos, n, setCurrent])

  const goAbs = (to) => {
    target.current = to
    anim.current?.stop()
    if (reduce) pos.set(to)
    else anim.current = animate(pos, to, { duration: DUR.slow, ease: EASE_EXPO })
  }
  const stepBy = (delta) => goAbs(target.current + delta)
  useEffect(() => {
    api.current = { step: stepBy }
  })

  useEffect(() => {
    const el = stage.current
    const fit = () => setRadius(el.clientWidth * 0.46)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)

    // Rueda: si la página venía desplazándose, se la deja seguir; así el cursor que pasa por encima no se queda atrapado
    let acc = 0
    let last = 0
    let scrolled = 0
    const onScroll = () => {
      scrolled = performance.now()
    }
    const onWheel = (e) => {
      const now = performance.now()
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (!horizontal && now - scrolled < 400) return
      e.preventDefault()
      if (now - last < 320) return
      acc += horizontal ? e.deltaX : e.deltaY
      if (Math.abs(acc) >= WHEEL_TICK) {
        api.current?.step(acc > 0 ? 1 : -1)
        acc = 0
        last = now
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
      anim.current?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const perItem = () => Math.max(160, radius * 0.75)
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    moved.current = false
    anim.current?.stop()
    drag.current = { x: e.clientX, from: pos.get(), id: e.pointerId, t: e.timeStamp, lx: e.clientX, v: 0 }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!moved.current) {
      if (Math.abs(dx) < DRAG_MIN) return
      moved.current = true
      stage.current.setPointerCapture(d.id)
      stage.current.classList.add('is-dragging')
    }
    d.v = (e.clientX - d.lx) / Math.max(1, e.timeStamp - d.t)
    d.lx = e.clientX
    d.t = e.timeStamp
    if (!reduce) pos.set(d.from - dx / perItem())
  }
  const onPointerEnd = (e) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    stage.current.classList.remove('is-dragging')
    if (!moved.current) return
    const dx = e.clientX - d.x
    if (reduce) {
      if (Math.abs(dx) > DRAG_FLICK) stepBy(dx < 0 ? 1 : -1)
      return
    }
    const flick = Math.max(-0.6, Math.min(0.6, -d.v * 0.25)) // un gesto rápido pasa una portada, nunca varias
    goAbs(Math.round(pos.get() + flick))
  }
  const onPick = (e, i) => {
    if (moved.current) {
      moved.current = false
      e.preventDefault()
      return
    }
    if (i === current) return
    e.preventDefault() // la portada de al lado primero se centra
    stepBy(wrapped(i, target.current, n))
  }
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    stepBy(e.key === 'ArrowRight' ? 1 : -1)
  }

  return (
    <div
      ref={stage}
      className="folder-wheel"
      tabIndex={0}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {items.map((p, i) => (
        <WheelCover key={p.slug} pos={pos} i={i} n={n} radius={radius} reduce={reduce} to={`/proyectos/${p.slug}`} src={p.cover} alt={t.portadaDe(p.name)} onPick={onPick} />
      ))}
    </div>
  )
}

/** Lo que se despliega bajo la fila: título grande del proyecto a la vista y sus portadas enteras en una fila deslizable. */
function FolderPanel({ id, group, under, items, labelledBy, level, reduce, wrapperRef, panelRef }) {
  const t = useUi()
  const { projectPages } = useProjectPages()
  const row = useRef(null)
  const drag = useRef(null)
  const dragged = useRef(false) // el clic que cierra un arrastre no abre el proyecto
  const settling = useRef(null)
  const shown = useRef(0) // la portada centrada, también para recolocar al cambiar el tamaño
  const [current, setCurrent] = useState(0)
  const Title = `h${level + 1}`
  const many = items.length > 1
  const isWheel = items.length >= WHEEL_MIN
  const project = items[current] ?? items[0]
  const to = `/proyectos/${project.slug}`
  const meta = [project.category, projectPages[project.slug]?.context?.split(' · ')[0]].filter(Boolean).join(' · ')
  const position = `${current + 1} / ${items.length}`
  const swap = { duration: reduce ? 0 : DUR.slow, ease: EASE_EXPO }

  const slides = () => [...(row.current?.children ?? [])]
  const leftOf = (el) => el.offsetLeft + el.offsetWidth / 2 - row.current.clientWidth / 2
  const nearest = () => {
    const list = slides()
    const here = row.current.scrollLeft
    return list.reduce((best, el, i) => (Math.abs(leftOf(el) - here) < Math.abs(leftOf(list[best]) - here) ? i : best), 0)
  }
  const goTo = (i, behavior = reduce ? 'instant' : 'smooth') => {
    const el = slides()[i]
    if (el) row.current.scrollTo({ left: leftOf(el), behavior })
  }

  // Márgenes para poder centrar la primera y la última portada, sea cual sea su ancho
  const measure = () => {
    const el = row.current
    const list = slides()
    if (!many || !el || !list.length) return
    el.style.setProperty('--row-start', `${Math.max(0, (el.clientWidth - list[0].offsetWidth) / 2)}px`)
    el.style.setProperty('--row-end', `${Math.max(0, (el.clientWidth - list[list.length - 1].offsetWidth) / 2)}px`)
    goTo(shown.current, 'instant')
  }
  useLayoutEffect(() => {
    if (!many || isWheel) return undefined
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row.current)
    return () => {
      ro.disconnect()
      settling.current?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [many])

  // El título sigue a la portada centrada, llegue como llegue: dedo, trackpad, arrastre o teclado
  const onScroll = () => {
    const i = nearest()
    shown.current = i
    setCurrent(i)
  }

  const step = (delta) => goTo(Math.min(items.length - 1, Math.max(0, current + delta)))
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    step(e.key === 'ArrowRight' ? 1 : -1)
  }

  // Arrastre solo con ratón: el dedo ya lo resuelve el scroll nativo
  const onPointerDown = (e) => {
    dragged.current = false
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    settling.current?.()
    drag.current = { x: e.clientX, left: row.current.scrollLeft, from: nearest(), id: e.pointerId }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!dragged.current) {
      if (Math.abs(dx) < DRAG_MIN) return
      dragged.current = true
      row.current.classList.add('is-dragging') // sin imán mientras se arrastra
      row.current.setPointerCapture(d.id)
    }
    row.current.scrollLeft = d.left - dx
  }
  const onPointerEnd = (e) => {
    const d = drag.current
    drag.current = null
    if (!d || !dragged.current) return
    const dx = e.clientX - d.x
    let i = nearest()
    if (i === d.from && Math.abs(dx) > DRAG_FLICK) i = Math.min(items.length - 1, Math.max(0, d.from + (dx < 0 ? 1 : -1)))
    const el = row.current
    goTo(i)
    // Se devuelve el imán al llegar, para que no pegue un salto
    const done = () => {
      clearTimeout(timer)
      el.removeEventListener('scrollend', done)
      el.classList.remove('is-dragging')
      settling.current = null
    }
    const timer = setTimeout(done, reduce ? 0 : DUR.slow * 1000)
    el.addEventListener('scrollend', done)
    settling.current = done
  }
  const onClickCapture = (e) => {
    if (!dragged.current) return
    dragged.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div ref={wrapperRef} className={`folder-panel-clip ${under ? `folder--${under}` : ''}`}>
    <div
      ref={panelRef}
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`folder-panel folder--${group.color}`}
    >
      <div className="folder-panel-head">
        <Title className="folder-panel-title">
          <AnimatePresence initial={false}>
            <motion.span
              key={project.slug}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              exit={{ y: '-110%' }}
              transition={swap}
            >
              {project.name}
            </motion.span>
          </AnimatePresence>
        </Title>
        <p className="folder-panel-meta">{meta}</p>
      </div>

      <div className="folder-row-box">
        {/* El foco de teclado va a la fila; las portadas repiten el enlace de abajo */}
        {isWheel ? (
          <CoverWheel items={items} label={group.label} reduce={reduce} current={current} setCurrent={setCurrent} t={t} />
        ) : (
        <div
          ref={row}
          className="folder-row"
          data-single={!many}
          {...(many && {
            tabIndex: 0,
            role: 'group',
            'aria-label': group.label,
            onScroll,
            onKeyDown,
            onPointerDown,
            onPointerMove,
            onPointerUp: onPointerEnd,
            onPointerCancel: onPointerEnd,
            onClickCapture,
          })}
        >
          {items.map((p, i) => (
            <Link
              key={p.slug}
              to={`/proyectos/${p.slug}`}
              tabIndex={-1}
              aria-hidden="true"
              className="folder-cover"
              draggable={false}
              onClick={(e) => {
                if (i === current) return
                e.preventDefault() // la portada de al lado primero se centra
                goTo(i)
              }}
            >
              <img src={p.cover} alt={t.portadaDe(p.name)} draggable={false} onLoad={measure} />
            </Link>
          ))}
        </div>
        )}
      </div>

      <div className="folder-panel-foot">
        <Link to={to} className="folder-work-go" aria-label={`${t.verProyecto}: ${project.name}`}>
          {t.verProyecto} <span aria-hidden="true">→</span>
        </Link>
        {many && (
          <>
            <span className="sr-only" aria-live="polite">{`${project.name}, ${position}`}</span>
            <span className="folder-row-pos" aria-hidden="true">{position}</span>
          </>
        )}
      </div>
    </div>
    </div>
  )
}

/** Los proyectos: tres carpetas con sus láminas asomando. Cada una abre debajo sus trabajos, de una en una. */
export default function ProjectFolders({ level = 3 }) {
  const { projectGroups, featuredProjects } = useContent()
  const reduce = useReducedMotion()
  const [openId, setOpenId] = useState(null) // lo que el botón anuncia
  const [mounted, setMounted] = useState(null) // { id, under }: el panel en pantalla, también mientras se cierra
  const buttons = useRef({})
  const layer = useRef(null)
  const wrapper = useRef(null)
  const panel = useRef(null)
  const flight = useRef(null)
  const current = useRef(null)
  const pending = useRef(null) // cambio de carpeta: de dónde venía el panel anterior
  const itemsOf = (g) => g.slugs.map((s) => featuredProjects.find((p) => p.slug === s))

  const close = () => {
    const id = current.current
    current.current = null
    setOpenId(null)
    flight.current = flyFolder({
      dir: 'close',
      reduce,
      layer: layer.current,
      folder: buttons.current[id],
      wrapper: wrapper.current,
      panel: panel.current,
      onDone: () => flushSync(() => setMounted(null)),
    })
  }

  const toggle = (id) => {
    flight.current?.finish() // un clic a media animación la completa y sigue
    const was = current.current
    if (was === id) {
      close()
      return
    }
    if (was) {
      // Cambio de carpeta: el panel nuevo nace con la altura del anterior y su color se extiende sobre el viejo
      pending.current = {
        id,
        prevTop: wrapper.current.getBoundingClientRect().top,
        prevHeight: wrapper.current.offsetHeight,
        buttonTop: buttons.current[id].getBoundingClientRect().top,
      }
      const oldFront = buttons.current[was].querySelector('.folder-front')
      oldFront.style.transition = `transform ${DUR.quick}s cubic-bezier(0.16, 1, 0.3, 1)`
      oldFront.style.transform = ''
    }
    current.current = id
    setOpenId(id)
    setMounted({ id, under: was ? projectGroups.find((g) => g.id === was).color : null })
  }

  // Con el panel ya en el DOM pero aún sin pintar: se mide y arranca el vuelo, sin un solo fotograma intermedio
  useLayoutEffect(() => {
    if (!mounted || current.current !== mounted.id) return
    let startHeight = 0
    const was = pending.current
    pending.current = null
    if (was) {
      if (wrapper.current.getBoundingClientRect().top === was.prevTop) startHeight = was.prevHeight
      const shift = buttons.current[was.id].getBoundingClientRect().top - was.buttonTop
      if (shift) window.scrollBy({ top: shift, behavior: 'instant' }) // en móvil, el panel de arriba ya no está
    }
    flight.current = flyFolder({
      dir: 'open',
      reduce,
      layer: layer.current,
      folder: buttons.current[mounted.id],
      wrapper: wrapper.current,
      panel: panel.current,
      startHeight,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useEffect(() => {
    if (!openId) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      flight.current?.finish()
      close()
      buttons.current[openId]?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId])

  // Al salir de la página a media animación no queda ninguna portada volando
  useEffect(() => () => flight.current?.finish(), [])

  return (
    <div className="folders" data-active={mounted ? '' : undefined}>
      {projectGroups.map((g) => {
        const isShown = mounted?.id === g.id
        const panelId = `carpeta-${g.id}`
        return (
          <div key={g.id} className="contents">
            <Folder
              group={g}
              items={itemsOf(g)}
              isOpen={openId === g.id}
              isOut={isShown}
              panelId={panelId}
              onToggle={() => toggle(g.id)}
              buttonRef={(n) => {
                buttons.current[g.id] = n
              }}
              level={level}
            />
            {isShown && (
              <FolderPanel
                key={g.id}
                id={panelId}
                group={g}
                under={mounted.under}
                items={itemsOf(g)}
                labelledBy={`${panelId}-boton`}
                level={level}
                reduce={reduce}
                wrapperRef={wrapper}
                panelRef={panel}
              />
            )}
          </div>
        )
      })}
      <div ref={layer} className="folder-flight" aria-hidden="true" />
    </div>
  )
}
