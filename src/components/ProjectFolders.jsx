import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { animate, AnimatePresence, cubicBezier, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { DUR } from '../lib/motion'

/* ---------- Móvil y tableta: el escenario bajo la carpeta ---------- */

const EASE_EXPO = [0.22, 1, 0.36, 1] // curva suave, igual para todo
const SLOW = 1.1 // s: carpeta, portadas, alturas y scroll

const STAGGER = 0.06 // s entre portadas al salir
const CLOSE_S = 1.1
const SWITCH_MS = 600 // lo que tardan las portadas en volver antes de cambiar de carpeta
const DRAG_MIN = 6 // px a partir de los que un gesto ya es arrastre
const SWIPE = 40 // px que bastan para pasar a la portada siguiente
const MANY = 4 // a partir de aquí, abanico más cerrado que gira al arrastrar
const LIFT_SCALE = 1.08

/** Hombro de la pestaña: una sola curva continua que baja hasta la lámina y se solapa con ella, sin muescas ni costuras. */
function TabShoulder() {
  return (
    <svg className="tab-shoulder" viewBox="0 0 36 41" preserveAspectRatio="none" shapeRendering="geometricPrecision" aria-hidden="true">
      <path d="M0 0C9 0 13 5 17 17C21 31 26 40 36 40V41H0Z" />
    </svg>
  )
}

/** La carpeta de la fila: siempre en su sitio y a su tamaño; solo cambia de estado. */
function Folder({ group, items, isOpen, stageId, onToggle, buttonRef, level, order }) {
  const t = useUi()
  const Heading = `h${level}`
  const state = isOpen ? t.cerrar : t.abrir
  return (
    <Heading className="folder-slot" style={{ '--o': order }}>
      <button
        ref={buttonRef}
        id={`carpeta-${group.id}-boton`}
        type="button"
        className={`folder folder--${group.color}`}
        data-sheets={items.length}
        data-out={isOpen || undefined}
        aria-expanded={isOpen}
        aria-controls={isOpen ? stageId : undefined}
        aria-label={`${group.label} · ${t.nProyectos(items.length)}: ${items.map((p) => p.name).join(', ')}. ${state}`}
        onClick={(e) => onToggle(e.detail === 0)}
      >
        <span className="folder-tab">
          <span className="folder-tab-text">
            {group.label}
            <span className="font-medium"> · {t.nProyectos(items.length)}</span>
          </span>
          <TabShoulder />
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

/** Proporción de cada portada; si la imagen ya está en caché se conoce sin esperar. */
function useAspects(items) {
  const [known, setKnown] = useState({})
  const read = (src) => {
    const im = new Image()
    im.src = src
    return im
  }
  useEffect(() => {
    let alive = true
    items.forEach((p) => {
      const im = read(p.cover)
      im.onload = () => alive && setKnown((k) => (k[p.slug] ? k : { ...k, [p.slug]: im.naturalWidth / im.naturalHeight }))
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((p) => p.slug).join()])
  return items.map((p) => {
    if (known[p.slug]) return known[p.slug]
    const im = read(p.cover)
    return im.naturalWidth ? im.naturalWidth / im.naturalHeight : 4 / 3
  })
}

const stepFor = (n) => (n === 2 ? 22 : n === 3 ? 24 : 14)

/**
 * Medidas del escenario: el mayor abanico que cabe en el ancho y en la pantalla, contando la portada levantada.
 * Se reserva todo ese sitio: nada puede pisar la fila ni lo que venga después.
 */
function fanLayout(width, viewH, aspects, fix) {
  const n = aspects.length
  const narrow = !fix && width < 640
  const fw = fix ? fix.fw : narrow ? Math.min(width * 0.84, 340) : Math.max(320, Math.min(width * 0.38, 520))
  const fh = fix ? fix.fh : Math.round(fw * 0.62)
  const step = stepFor(n)
  const room = Math.max(narrow ? 240 : 300, viewH - 72 - (narrow ? 150 : 192) - fh / 2 - 32)
  const half = width / 2 - 4
  const angles = n === 1 ? [-3] : n >= MANY ? [-3, -2, -1, 0, 1, 2, 3].map((k) => k * step) : aspects.map((_, i) => (i - (n - 1) / 2) * step)
  const tall = Math.min(...aspects)
  const wide = Math.max(...aspects)

  const fits = (cw) => {
    let top = 0
    for (const a of angles) {
      for (const asp of [tall, wide]) {
        const ch = cw / asp
        const r = ch * 0.28 + fh * 0.2
        const lift = ch * 0.24
        const rad = (Math.abs(a) * Math.PI) / 180
        const restX = r * Math.sin(rad) + (cw / 2) * Math.cos(rad) + (ch / 2) * Math.sin(rad)
        const liftX = (r + lift) * Math.sin(rad) + (LIFT_SCALE * cw) / 2
        if (Math.max(restX, liftX) > half) return null
        const restTop = r * Math.cos(rad) + (ch / 2) * Math.cos(rad) + (cw / 2) * Math.sin(rad)
        top = Math.max(top, restTop, (r + lift) * Math.cos(rad) + (LIFT_SCALE * ch) / 2)
      }
    }
    return top > room ? null : top
  }
  let cw = narrow ? fw : Math.min(fw * 0.82, 400)
  if (fix) cw = Math.min(cw, fw * 0.9)
  let top = fits(cw)
  while (top === null && cw > 80) {
    cw -= 2
    top = fits(cw)
  }
  top = Math.ceil(top ?? room) + 8
  return { fw, fh, cw, step, pivot: top, sceneH: top + Math.ceil(fh / 2) + 8 }
}

/** Una portada: el brazo gira alrededor del centro de la carpeta; dentro, la portada se endereza y crece sobre sí misma. */
function FanCover({ project, index, angle, geo, aspect, out, entered, lifted, reduce, dragging, hidden, z, onLift, onDrop, onCoverClick, onCoverPointerDown, onKeyNav, linkRef, label }) {
  const ch = geo.cw / aspect
  const r = ch * 0.28 + geo.fh * 0.2
  const lift = ch * 0.24
  const rise = r // sale desde dentro, a la altura del centro de la carpeta
  const delay = out && !entered && !reduce ? index * STAGGER : 0
  const dur = reduce ? 0 : out ? (entered ? (dragging ? 0 : DUR.quick * 1.5) : SLOW) : SWITCH_MS / 1000
  const ease = { duration: dur, delay, ease: EASE_EXPO }
  const fade = { duration: reduce ? 0 : 0.16, delay: out ? delay : Math.max(0, dur - 0.16), ease: 'linear' }
  const shown = out && !hidden
  return (
    <motion.div className="fan-arm" style={{ zIndex: z }} initial={{ rotate: 0 }} animate={{ rotate: out ? angle : 0 }} transition={ease}>
      <motion.div
        className="fan-cover"
        style={{ left: -geo.cw / 2, top: -r - ch / 2, width: geo.cw, height: ch, pointerEvents: shown ? 'auto' : 'none' }}
        initial={{ y: rise, scale: 0.84, rotate: 0, opacity: 0 }}
        animate={out ? { y: lifted ? -lift : 0, scale: lifted ? LIFT_SCALE : 1, rotate: lifted ? -angle : 0, opacity: hidden ? 0 : 1 } : { y: rise, scale: 0.84, rotate: 0, opacity: 0 }}
        transition={{ ...ease, opacity: fade }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && onLift(index)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && onDrop(index)}
      >
        <Link
          ref={linkRef}
          to={`/proyectos/${project.slug}`}
          className="fan-link"
          draggable={false}
          tabIndex={shown ? 0 : -1}
          onPointerDown={(e) => onCoverPointerDown(e, index)}
          onClick={(e) => onCoverClick(e, index)}
          onFocus={() => onLift(index, true)}
          onBlur={() => onDrop(index)}
          onKeyDown={(e) => onKeyNav(e, index)}
        >
          <img src={project.cover} alt={label} draggable={false} />
        </Link>
      </motion.div>
    </motion.div>
  )
}

/** Lo que se abre bajo la fila: la carpeta grande, su abanico y, debajo, el proyecto que se está mirando. */
function FolderStage({ id, group, items, level, out, collapsed, held, reduce, origin, focusFirst, onClose }) {
  const t = useUi()
  const { projectPages } = useProjectPages()
  const Title = `h${level + 1}`
  const n = items.length
  const many = n >= MANY
  const aspects = useAspects(items)
  const stageRef = useRef(null)
  const innerRef = useRef(null)
  const links = useRef([])
  const gesture = useRef(null)
  const tap = useRef(null)
  const swiped = useRef(false)
  const dropTimer = useRef(0)
  const [size, setSize] = useState(null)
  const [height, setHeight] = useState(held.current) // al cambiar de carpeta se parte de la altura anterior: la página no salta
  const [lifted, setLifted] = useState(null)
  const [shown, setShown] = useState(many ? Math.floor(n / 2) : 0)
  const [rot, setRot] = useState((n - 1) / 2)
  const [dragging, setDragging] = useState(false)
  const [entered, setEntered] = useState(false)

  useLayoutEffect(() => {
    const el = stageRef.current
    const fit = () => setSize({ w: el.clientWidth, h: window.innerHeight })
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])
  const geo = size && fanLayout(size.w, size.h, aspects)

  // Se mide antes de pintar; la altura crece de 0 a lo medido
  useLayoutEffect(() => {
    if (!innerRef.current) return undefined
    const measure = () => {
      const h = innerRef.current?.offsetHeight ?? 0
      held.current = h
      setHeight(h)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [geo?.sceneH])

  useEffect(() => {
    if (!out) {
      setEntered(false)
      setLifted(null)
      return undefined
    }
    const timer = setTimeout(() => setEntered(true), reduce ? 0 : (SLOW + 0.05 + STAGGER * Math.max(0, n - 1)) * 1000)
    return () => clearTimeout(timer)
  }, [out, n, reduce])

  // La página baja solo lo justo para que el escenario se vea entero
  useEffect(() => {
    if (!out || !height || !stageRef.current) return undefined
    const nav = document.querySelector('.sticky.top-0')?.offsetHeight ?? 0
    const top = stageRef.current.getBoundingClientRect().top
    const over = top + height + 16 - window.innerHeight
    const peek = stageRef.current.clientWidth < 640 ? 8 : 80 // en fila, los bolsillos siguen a la vista para poder cambiar de carpeta
    const shift = Math.min(over, top - nav - peek)
    if (shift <= 1) return undefined
    const from = window.scrollY
    if (reduce) {
      window.scrollTo({ top: from + shift, behavior: 'instant' })
      return undefined
    }
    const run = animate(0, shift, { duration: SLOW, ease: EASE_EXPO, onUpdate: (v) => window.scrollTo({ top: from + v, behavior: 'instant' }) })
    const stop = () => run.stop()
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    return () => {
      run.stop()
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [out, height, reduce])

  // Abierta con teclado: el foco pasa a la primera portada cuando ya está fuera
  useEffect(() => {
    if (!out || !focusFirst || !entered) return
    links.current[many ? Math.floor(n / 2) : 0]?.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered])

  const lift = (i, center) => {
    clearTimeout(dropTimer.current)
    setLifted(i)
    setShown(i)
    if (center && many) setRot(i)
  }
  // Un respiro al salir: mover el ratón a la vecina no hace bajar y subir la portada
  const drop = (i) => {
    clearTimeout(dropTimer.current)
    dropTimer.current = setTimeout(() => setLifted((c) => (c === i ? null : c)), 90)
  }
  useEffect(() => () => clearTimeout(dropTimer.current), [])

  const onCoverPointerDown = (e, i) => {
    tap.current = { touch: e.pointerType !== 'mouse', wasLifted: lifted === i }
  }
  // Con el dedo, el primer toque trae la portada al frente y el segundo abre el proyecto
  const onCoverClick = (e, i) => {
    const first = tap.current
    tap.current = null
    if (e.detail === 0 || !first?.touch || first.wasLifted) return
    e.preventDefault()
    lift(i, true)
  }
  const go = (i) => {
    const next = Math.max(0, Math.min(n - 1, i))
    lift(next, true)
    return next
  }
  const onKeyNav = (e, i) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    links.current[go(i + (e.key === 'ArrowRight' ? 1 : -1))]?.focus({ preventScroll: true })
  }

  const rotAt = (g, dx) => Math.max(0, Math.min(n - 1, g.rot - dx / ((geo.cw ?? geo.sp / 0.6) * 0.55)))
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && (e.button !== 0 || !many)) return
    swiped.current = false
    gesture.current = { x: e.clientX, id: e.pointerId, rot, from: lifted ?? shown }
  }
  const onPointerMove = (e) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.x
    if (!swiped.current) {
      if (Math.abs(dx) < DRAG_MIN) return
      swiped.current = true
      e.currentTarget.setPointerCapture(g.id)
      if (many) setDragging(true)
    }
    if (many) setRot(rotAt(g, dx))
  }
  const onPointerEnd = (e) => {
    const g = gesture.current
    gesture.current = null
    if (!g || !swiped.current) return
    setDragging(false)
    const dx = e.clientX - g.x
    if (many) go(Math.round(rotAt(g, dx)))
    else if (Math.abs(dx) > SWIPE) go(g.from + (dx < 0 ? 1 : -1))
  }
  const onClickCapture = (e) => {
    if (!swiped.current) return
    swiped.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  const project = items[shown] ?? items[0]
  const meta = [project.category, projectPages[project.slug]?.context?.split(' · ')[0]].filter(Boolean).join(' · ')
  const grow = { duration: reduce ? 0 : out ? SLOW : CLOSE_S, ease: EASE_EXPO }
  const hiddenPose = geo ? { scale: origin.w / geo.fw, x: origin.dx, opacity: 0 } : {}
  const partBox = geo && { width: geo.fw, height: geo.fh, left: -geo.fw / 2, top: -geo.fh / 2 }

  return (
    <motion.div
      ref={stageRef}
      id={id}
      role="region"
      aria-labelledby={`carpeta-${group.id}-boton`}
      className="folder-stage"
      style={{ '--o': origin.order }}
      initial={{ height: held.current }}
      animate={{ height: collapsed ? 0 : height }}
      transition={{ duration: grow.duration, ease: EASE_EXPO }}
    >
      {geo && (
        <div ref={innerRef} className="stage-inner">
          <div
            className="stage-scene"
            style={{ height: geo.sceneH }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onClickCapture={onClickCapture}
            data-many={many || undefined}
          >
            <motion.div
              className={`stage-grow folder--${group.color}`}
              style={{ top: geo.pivot }}
              initial={hiddenPose}
              animate={out ? { scale: 1, x: 0, opacity: 1 } : hiddenPose}
              transition={{ ...grow, opacity: { duration: reduce ? 0 : out ? 0.3 : grow.duration * 0.6, delay: out ? 0 : grow.duration * 0.4, ease: 'easeOut' } }}
            >
              <div className="big-part big-back" style={partBox} onClick={onClose} aria-hidden="true">
                <span className="big-tab">
                  <TabShoulder />
                </span>
                <span className="folder-back">
                  <span className="folder-inner">
                    <span className="folder-waves" />
                  </span>
                </span>
              </div>
              <div className="fan">
                {items.map((p, i) => {
                  const d = many ? i - rot : i - (n - 1) / 2
                  return (
                    <FanCover
                      key={p.slug}
                      project={p}
                      index={i}
                      angle={n === 1 ? -3 : d * geo.step}
                      geo={geo}
                      aspect={aspects[i]}
                      out={out}
                      entered={entered}
                      lifted={lifted === i}
                      reduce={reduce}
                      dragging={dragging}
                      hidden={many && Math.abs(d) > 3.2}
                      z={lifted === i ? 50 : many ? 20 - Math.round(Math.abs(d) * 2) : 10 + i}
                      onLift={lift}
                      onDrop={drop}
                      onCoverClick={onCoverClick}
                      onCoverPointerDown={onCoverPointerDown}
                      onKeyNav={onKeyNav}
                      linkRef={(el) => {
                        links.current[i] = el
                      }}
                      label={t.portadaDe(p.name)}
                    />
                  )
                })}
              </div>
              <div className="big-part big-front" style={partBox} aria-hidden="true">
                <span className="folder-front" onClick={onClose}>
                  <span className="folder-flap">
                    <span className="folder-waves" />
                  </span>
                  <span className="folder-pocket">
                    <span className="big-label">{group.label}</span>
                    <span className="folder-state">
                      {t.cerrar}
                      <span className="folder-plus" />
                    </span>
                  </span>
                </span>
              </div>
            </motion.div>
          </div>

          <div className="stage-info">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={project.slug}
                className="stage-info-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: out ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.22, ease: 'easeOut' }}
              >
                <Title className="stage-info-name">{project.name}</Title>
                <p className="stage-info-meta">{meta}</p>
                <Link to={`/proyectos/${project.slug}`} className="stage-info-go" aria-label={`${t.verProyecto}: ${project.name}`}>
                  {t.verProyecto} <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </AnimatePresence>
            <span className="sr-only" aria-live="polite">{project.name}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/** Móvil y tableta (menos de 1024 px): las carpetas no se mueven nunca. Al pulsar una, debajo se abre su escenario. */
function MobileFolders({ level }) {
  const { projectGroups, featuredProjects } = useContent()
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState(null) // lo que el botón anuncia
  const [shownId, setShownId] = useState(null) // la carpeta cuyo escenario está en pantalla
  const [out, setOut] = useState(false)
  const buttons = useRef({})
  const root = useRef(null)
  const timer = useRef(0)
  const anchor = useRef(null) // al cambiar el escenario de sitio, la carpeta pulsada no se mueve de la pantalla
  const viaKeyboard = useRef(false)
  const held = useRef(0)
  const closeRef = useRef(null)
  const itemsOf = (g) => g.slugs.map((s) => featuredProjects.find((p) => p.slug === s))

  const close = () => {
    clearTimeout(timer.current)
    setSelected(null)
    setOut(false)
    const gone = () => {
      held.current = 0
      setShownId(null)
    }
    if (reduce) gone()
    else timer.current = setTimeout(gone, CLOSE_S * 1000)
  }
  closeRef.current = close

  const toggle = (id, keyboard) => {
    if (selected === id) {
      close()
      return
    }
    clearTimeout(timer.current)
    viaKeyboard.current = keyboard
    setSelected(id)
    if (!shownId || shownId === id) {
      setShownId(id)
      setOut(true)
      return
    }
    // Cambio directo: las portadas vuelven a entrar y aparece la carpeta nueva
    const swap = () => {
      anchor.current = { id, top: buttons.current[id].getBoundingClientRect().top }
      setShownId(id)
      setOut(true)
    }
    if (reduce) {
      swap()
      return
    }
    setOut(false)
    timer.current = setTimeout(swap, SWITCH_MS)
  }

  useLayoutEffect(() => {
    const a = anchor.current
    anchor.current = null
    if (!a) return
    const moved = buttons.current[a.id].getBoundingClientRect().top - a.top
    if (Math.abs(moved) > 0.5) window.scrollBy({ top: moved, behavior: 'instant' })
  }, [shownId])

  useEffect(() => {
    if (!selected) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      closeRef.current()
      buttons.current[selected]?.focus({ preventScroll: true })
    }
    // Clic fuera: cualquier sitio que no sea una carpeta, una portada o la ficha del proyecto
    const onClick = (e) => {
      if (!e.target.isConnected || e.target.closest('.folder, .fan-cover, .stage-info-body, .big-back, .folder-front')) return
      closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [selected])

  useEffect(() => () => clearTimeout(timer.current), [])

  const shownGroup = projectGroups.find((g) => g.id === shownId)
  const stageId = 'carpeta-escenario'
  const originOf = () => {
    const a = buttons.current[shownId]?.getBoundingClientRect()
    const b = root.current?.getBoundingClientRect()
    return { w: a?.width ?? 300, dx: a && b ? a.left + a.width / 2 - (b.left + b.width / 2) : 0, order: projectGroups.findIndex((g) => g.id === shownId) * 2 + 1 }
  }

  return (
    <div ref={root} className="folders" data-active={selected ? 'true' : undefined}>
      {projectGroups.map((g, i) => (
        <Folder
          key={g.id}
          group={g}
          items={itemsOf(g)}
          isOpen={selected === g.id}
          stageId={stageId}
          onToggle={(keyboard) => toggle(g.id, keyboard)}
          buttonRef={(n) => {
            buttons.current[g.id] = n
          }}
          level={level}
          order={i * 2}
        />
      ))}
      {shownGroup && (
        <FolderStage
          key={shownGroup.id}
          id={stageId}
          group={shownGroup}
          items={itemsOf(shownGroup)}
          level={level}
          out={out}
          collapsed={!selected}
          held={held}
          reduce={reduce}
          origin={originOf()}
          focusFirst={viaKeyboard.current}
          onClose={close}
        />
      )}
    </div>
  )
}

/* ---------- Escritorio (1024 px o más): capa fija centrada, sin mover la fila ni el scroll ---------- */

const EXPO = cubicBezier(0.16, 1, 0.3, 1)
const IN_OUT = cubicBezier(0.65, 0, 0.35, 1)
const HOME = cubicBezier(0.5, 0, 0.15, 1)
const MAX_SCALE = 1.75

function FolderFace({ group, count }) {
  const t = useUi()
  return (
    <>
      <span className="folder-tab">
        <span className="folder-tab-text">
          {group.label}
          <span className="font-medium"> · {t.nProyectos(count)}</span>
        </span>
        <TabShoulder />
      </span>
      <span className="folder-back">
        <span className="folder-inner">
          <span className="folder-waves" aria-hidden="true" />
        </span>
      </span>
    </>
  )
}

/** La carpeta de la fila: siempre en su sitio. Mientras está levantada, la capa la oculta (data-lifted) y solo deja su hueco. */
function DeskFolder({ group, items, isOpen, onToggle, buttonRef, level }) {
  const t = useUi()
  const Heading = `h${level}`
  return (
    <Heading className="folder-slot">
      <button
        ref={buttonRef}
        type="button"
        className={`folder folder--${group.color}`}
        data-sheets={items.length}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`${group.label} · ${t.nProyectos(items.length)}: ${items.map((p) => p.name).join(', ')}. ${t.abrir}`}
        onClick={onToggle}
      >
        <FolderFace group={group} count={items.length} />
        {items.map((p) => (
          <img key={p.slug} src={p.cover} alt="" className="folder-sheet" draggable={false} />
        ))}
        <span className="folder-front">
          <span className="folder-flap">
            <span className="folder-waves" aria-hidden="true" />
          </span>
          <span className="folder-pocket">
            <span className="folder-state">
              {t.abrir}
              <span className="folder-plus" />
            </span>
          </span>
        </span>
      </button>
    </Heading>
  )
}

/** Foto exacta de la carpeta cerrada, leída del propio CSS: de aquí sale todo y aquí vuelve todo. */
function measure(button) {
  const r = button.getBoundingClientRect()
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const seen = []
  const sheets = [...button.querySelectorAll('.folder-sheet')].map((im) => {
    const cs = getComputedStyle(im)
    const aspect = im.naturalWidth ? im.naturalWidth / im.naturalHeight : 4 / 3
    if (cs.display === 'none') return { hidden: true, aspect }
    const s = { l: parseFloat(cs.left), t: parseFloat(cs.top), w: parseFloat(cs.width), h: parseFloat(cs.height), rotate: parseFloat(cs.rotate) || 0, aspect }
    seen.push(s)
    return s
  })
  return {
    x: r.left,
    y: r.top,
    w: r.width,
    h: r.height,
    frontTop: parseFloat(getComputedStyle(button.querySelector('.folder-front')).top),
    cut: parseFloat(getComputedStyle(button).getPropertyValue('--cut')) * rem,
    sheets: sheets.map((s) => (s.hidden ? { ...seen[seen.length - 1], aspect: s.aspect, hidden: true } : s)),
  }
}

const viewport = () => ({
  W: document.documentElement.clientWidth,
  H: window.innerHeight,
  nav: document.querySelector('header.sticky')?.offsetHeight ?? 0,
})

/** Composición abierta: la carpeta, tan grande como permite la pantalla, y las portadas encima y solapadas con ella. Las portadas van en coordenadas de la carpeta. */
function stageLayout({ W, H, nav }, geo, infoH, active) {
  const n = geo.sheets.length
  const many = n >= MANY
  const bottom = H - 8 - infoH - 6
  const S = Math.min(MAX_SCALE, (bottom - nav - 8) / geo.h, (W - 48) / geo.w)
  const fw = geo.w * S
  const fx = (W - fw) / 2
  const fy = bottom - geo.h * S
  const flapRight = fy + geo.frontTop * S
  const flapLeft = flapRight + geo.cut * S
  const top = 12
  const baseline = flapLeft + 6 * S // la activa entra en el bolsillo aunque la solapa baje hacia la izquierda
  const cx = W / 2
  const ang = many ? 8 : 10
  const rad = (ang * Math.PI) / 180
  const boxes = geo.sheets.map((s) => {
    const ch = Math.min(baseline - top, (fw * (n > 1 ? 0.86 : 0.92)) / s.aspect)
    return { ch, cw: ch * s.aspect }
  })
  const reach = (b, k) => ({
    x: k * ((b.cw / 2) * Math.cos(rad) + (b.ch / 2) * Math.sin(rad)),
    y: k * ((b.ch / 2) * Math.cos(rad) + (b.cw / 2) * Math.sin(rad)),
  })
  const zone = flapRight - 2 - top
  const scales = boxes.map((b) => Math.min(many ? 0.68 : 0.78, zone / (2 * reach(b, 1).y)))
  const maxD = Math.min(2, n - 1)
  const spread = n > 1 ? Math.min(...boxes.map((b, i) => Math.min(b.cw * (many ? 0.42 : 0.62), (W / 2 - 8 - reach(b, scales[i]).x) / maxD))) : 0
  const covers = boxes.map((b, i) => {
    const d = i - active
    const cw = b.cw / S
    const ch = b.ch / S
    if (d === 0) return { cw, ch, d, x: (cx - b.cw / 2 - fx) / S, y: (baseline - b.ch - fy) / S, r: 0, s: 1, o: 1 }
    const k = Math.max(-2, Math.min(2, d))
    // Las laterales terminan por encima de la línea de la solapa: nunca quedan cortadas en el aire
    return { cw, ch, d, x: (cx + k * spread - b.cw / 2 - fx) / S, y: (flapRight - 2 - reach(b, scales[i]).y - b.ch / 2 - fy) / S, r: k * ang, s: scales[i], o: Math.abs(d) > 2 ? 0 : 1 }
  })
  return { fx, fy, S, covers, closeTop: top }
}

/** Corte de las portadas, en coordenadas de la carpeta: su borde inferior es la línea inclinada de la solapa, 2 px dentro de ella. */
function clipOf(geo) {
  const far = 4000
  const right = geo.frontTop + 2
  const left = right + geo.cut
  return `polygon(${-far}px ${-far}px, ${geo.w + far}px ${-far}px, ${geo.w + far}px ${right}px, ${geo.w}px ${right}px, 0px ${left}px, ${-far}px ${left}px)`
}

const shutPose = (geo, stage) => {
  const p = { fx: geo.x, fy: geo.y, fs: 1, scrim: 0, ui: 0, label: 0, plus: 0 }
  stage.covers.forEach((c, i) => {
    const s = geo.sheets[i]
    p[`x${i}`] = s.l + s.w / 2 - c.cw / 2
    p[`y${i}`] = s.t + s.h / 2 - c.ch / 2
    p[`r${i}`] = s.rotate
    p[`s${i}`] = s.w / c.cw
    p[`o${i}`] = s.hidden ? 0 : 1
    p[`e${i}`] = 0
  })
  return p
}

const openPose = (stage) => {
  const p = { fx: stage.fx, fy: stage.fy, fs: stage.S, scrim: 1, ui: 1, label: 1, plus: 45 }
  stage.covers.forEach((c, i) => {
    p[`x${i}`] = c.x
    p[`y${i}`] = c.y
    p[`r${i}`] = c.r
    p[`s${i}`] = c.s
    p[`o${i}`] = c.o
    p[`e${i}`] = 1
  })
  return p
}

/** Coreografía de apertura. Cada pista: [clave, inicio, duración, curva]. */
function openTracks(n) {
  const tracks = [['fx', 0, 0.9, EXPO], ['fy', 0, 0.9, EXPO], ['fs', 0, 0.9, EXPO], ['scrim', 0, 0.5, IN_OUT], ['ui', 0.35, 0.45, IN_OUT], ['label', 0, 0.35, IN_OUT], ['plus', 0, 0.6, EXPO]]
  for (let i = 0; i < n; i++) {
    const at = 0.135 + i * 0.045
    // Primero sube; el lateral y el giro llegan después: sale del bolsillo antes de abrirse
    tracks.push([`y${i}`, at, 0.8, EXPO], [`s${i}`, at, 0.8, EXPO], [`x${i}`, at + 0.05, 0.82, EXPO], [`r${i}`, at + 0.08, 0.9, EXPO], [`o${i}`, at, 0.2, IN_OUT], [`e${i}`, at + 0.3, 0.5, IN_OUT])
  }
  return tracks
}

/** Coreografía de cierre: las portadas entran a la vez detrás de la solapa y luego la carpeta vuelve a casa. */
function closeTracks(n) {
  const tracks = [['fx', 0.34, 0.51, HOME], ['fy', 0.34, 0.51, HOME], ['fs', 0.34, 0.51, HOME], ['scrim', 0.4, 0.45, IN_OUT], ['ui', 0, 0.2, IN_OUT], ['label', 0.2, 0.4, IN_OUT], ['plus', 0.1, 0.5, IN_OUT]]
  for (let i = 0; i < n; i++) {
    tracks.push([`x${i}`, 0, 0.45, IN_OUT], [`y${i}`, 0, 0.45, IN_OUT], [`r${i}`, 0, 0.45, IN_OUT], [`s${i}`, 0, 0.45, IN_OUT], [`o${i}`, 0.25, 0.2, IN_OUT], [`e${i}`, 0, 0.2, IN_OUT])
  }
  return tracks
}

/** La capa: un solo padre transformado con la carpeta en tres pisos (fondo, portadas, solapa). Un único reloj mueve todo sin renders de React. */
function FolderLift({ group, items, level, geo: firstGeo, button, open, reduce, onClose, onGone }) {
  const t = useUi()
  const { projectPages } = useProjectPages()
  const Title = `h${level + 1}`
  const n = items.length
  const root = useRef(null)
  const folderEl = useRef(null)
  const scrimEl = useRef(null)
  const infoRef = useRef(null)
  const closeBtn = useRef(null)
  const labelShut = useRef(null)
  const labelOpen = useRef(null)
  const plusEl = useRef(null)
  const coverEls = useRef([])
  const edgeEls = useRef([])
  const links = useRef([])
  const gesture = useRef(null)
  const swiped = useRef(false)
  const pose = useRef(null)
  const run = useRef(null)
  const timeline = useRef(null)
  const last = useRef({})
  const goneRef = useRef(onGone)
  goneRef.current = onGone
  const clock = useMotionValue(0)
  const [geo, setGeo] = useState(firstGeo)
  const [vp, setVp] = useState(viewport)
  const [infoH, setInfoH] = useState(null)
  const [active, setActive] = useState(n >= MANY ? Math.floor(n / 2) : 0)
  const ready = infoH !== null
  const geoRef = useRef(geo)
  geoRef.current = geo

  const write = () => {
    const p = pose.current
    // El padre transformado vive en un píxel entero y la carpeta conserva dentro la fracción de la fila: la capa no redondea distinto y el estampado no salta
    const g = geoRef.current
    const ox = Math.floor(g.x)
    const oy = Math.floor(g.y)
    folderEl.current.style.transform = `translate(${p.fx - ox - p.fs * (g.x - ox)}px, ${p.fy - oy - p.fs * (g.y - oy)}px) scale(${p.fs})`
    scrimEl.current.style.opacity = p.scrim
    closeBtn.current.style.opacity = p.ui
    infoRef.current.style.opacity = p.ui
    labelShut.current.style.opacity = 1 - p.label
    labelOpen.current.style.opacity = p.label
    plusEl.current.style.rotate = `${p.plus}deg`
    for (let i = 0; i < n; i++) {
      const el = coverEls.current[i]
      if (!el) continue
      el.style.transform = `translate(${p[`x${i}`]}px, ${p[`y${i}`]}px) rotate(${p[`r${i}`]}deg) scale(${p[`s${i}`]})`
      el.style.opacity = p[`o${i}`]
      edgeEls.current[i].style.opacity = p[`e${i}`]
    }
  }

  const setOrder = (fan, covers) => {
    covers.forEach((c, i) => {
      const el = coverEls.current[i]
      if (el) el.style.zIndex = fan ? (c.d === 0 ? 50 : 20 - Math.abs(c.d) * 2) : i < 3 ? 10 + i : 5
    })
  }

  // El reloj es el único que escribe en el DOM: todo va a la par y se puede interrumpir desde donde esté
  useEffect(
    () =>
      clock.on('change', (time) => {
        const line = timeline.current
        if (!line) return
        for (const [key, at, dur, ease] of line.tracks) {
          const u = Math.max(0, Math.min(1, (time - at) / dur))
          pose.current[key] = line.from[key] + (line.to[key] - line.from[key]) * ease(u)
        }
        // La carpeta solo es capa propia en pleno movimiento: en el primer y el último tramo pinta igual que la fila
        const layered = time >= 0.03 && time < line.until
        if (layered !== line.layered) {
          line.layered = layered
          if (layered) root.current.dataset.layered = ''
          else delete root.current.dataset.layered
        }
        if (line.flip && time >= line.flip.at) {
          line.flip.run()
          line.flip = null
        }
        write()
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clock],
  )

  const finish = (isOpen) => {
    delete root.current?.dataset.moving
    delete root.current?.dataset.layered
    if (!isOpen) goneRef.current()
  }

  const play = (to, tracks, isOpen, flip) => {
    run.current?.stop()
    const total = Math.max(...tracks.map(([, at, dur]) => at + dur))
    if (reduce) {
      pose.current = { ...to }
      flip?.run()
      write()
      finish(isOpen)
      return
    }
    timeline.current = null
    clock.jump(0)
    timeline.current = { from: { ...pose.current }, to, tracks, flip, until: isOpen ? total : total - 0.1, layered: false }
    root.current.dataset.moving = ''
    run.current = animate(clock, total, {
      duration: total,
      ease: 'linear',
      onComplete: () => {
        pose.current = { ...to } // la última pose es la exacta, sin restos de redondeo
        write()
        timeline.current = null
        finish(isOpen)
      },
    })
  }

  useLayoutEffect(() => {
    setInfoH(infoRef.current.offsetHeight)
    const onResize = () => {
      setVp(viewport())
      setGeo(measure(button))
      setInfoH(infoRef.current.offsetHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [button])

  // Va antes que el efecto de abajo: si se desmonta, la fila reaparece en la misma confirmación que quita la capa
  useLayoutEffect(
    () => () => {
      run.current?.stop()
      timeline.current = null
      pose.current = null
      delete button.dataset.lifted
    },
    [button],
  )

  const stage = stageLayout(vp, geo, infoH ?? 0, active)
  const sizeKey = `${vp.W},${vp.H},${infoH},${geo.x},${geo.y},${geo.w}`

  useLayoutEffect(() => {
    if (!ready) return
    const shut = shutPose(geo, stage)
    const out = openPose(stage)
    const was = last.current
    last.current = { open, active, sizeKey }
    if (!pose.current) {
      // Primer fotograma: la capa, ya idéntica a la fila, sustituye a la fila antes de pintar
      pose.current = shut
      setOrder(false, stage.covers)
      write()
      button.dataset.lifted = ''
      play(out, openTracks(n), true, { at: 0.16, run: () => setOrder(true, stage.covers) })
      return
    }
    if (was.open !== open) {
      if (open) play(out, openTracks(n), true, { at: 0.16, run: () => setOrder(true, stage.covers) })
      else play(shut, closeTracks(n), false, { at: 0.2, run: () => setOrder(false, stage.covers) })
      return
    }
    if (was.sizeKey !== sizeKey) {
      run.current?.stop()
      timeline.current = null
      pose.current = open ? out : shut
      setOrder(open, stage.covers)
      write()
      finish(open)
      return
    }
    if (was.active !== active && open) {
      setOrder(true, stage.covers)
      play(out, Object.keys(out).map((k) => [k, 0, 0.5, EXPO]), true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, open, active, sizeKey])

  useEffect(() => {
    if (open) closeBtn.current?.focus({ preventScroll: true })
  }, [open])

  const move = (next) => {
    const i = Math.max(0, Math.min(n - 1, next))
    setActive(i)
    return i
  }

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const onCover = links.current.includes(document.activeElement)
        const i = move(active + (e.key === 'ArrowRight' ? 1 : -1))
        if (onCover) links.current[i]?.focus({ preventScroll: true })
      } else if (e.key === 'Tab') {
        const all = [...root.current.querySelectorAll('a[href], button')].filter((el) => el.tabIndex >= 0 && getComputedStyle(el).visibility === 'visible')
        const at = all.indexOf(document.activeElement)
        if (e.shiftKey ? at <= 0 : at === all.length - 1) {
          e.preventDefault()
          all[e.shiftKey ? all.length - 1 : 0]?.focus({ preventScroll: true })
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active])

  const onPointerDown = (e) => {
    swiped.current = false
    gesture.current = e.button === 0 ? { x: e.clientX, y: e.clientY } : null
  }
  const onPointerUp = (e) => {
    const g = gesture.current
    gesture.current = null
    if (!g) return
    const dx = e.clientX - g.x
    if (Math.abs(dx) > 8 || Math.abs(e.clientY - g.y) > 8) swiped.current = true
    if (Math.abs(dx) > SWIPE && n > 1) move(active + (dx < 0 ? 1 : -1))
  }
  const onClickCapture = (e) => {
    if (!swiped.current) return
    swiped.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  return createPortal(
    <div
      ref={root}
      className="lift"
      role="dialog"
      aria-modal="true"
      aria-label={group.label}
      inert={!open}
      data-closing={open ? undefined : true}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        gesture.current = null
      }}
      onClickCapture={onClickCapture}
    >
      <div ref={scrimEl} className="lift-scrim" style={{ opacity: 0 }} onClick={onClose} />
      <div ref={folderEl} className="lift-origin" style={{ left: Math.floor(geo.x), top: Math.floor(geo.y) }}>
      <div className={`lift-folder folder--${group.color}`} style={{ left: geo.x - Math.floor(geo.x), top: geo.y - Math.floor(geo.y), width: geo.w, height: geo.h }}>
        <span className="folder lift-layer lift-back" aria-hidden="true" onClick={onClose}>
          <FolderFace group={group} count={n} />
        </span>
        <div className="lift-covers" style={{ clipPath: clipOf(geo) }}>
          {ready &&
            items.map((p, i) => {
              const c = stage.covers[i]
              const reachable = open && c.o === 1
              return (
                <div
                  key={p.slug}
                  ref={(el) => {
                    coverEls.current[i] = el
                  }}
                  className="lift-cover"
                  data-side={c.d !== 0 || undefined}
                  style={{ width: c.cw, height: c.ch, '--k': c.cw / geo.sheets[i].w, pointerEvents: reachable ? undefined : 'none' }}
                >
                  <Link
                    ref={(el) => {
                      links.current[i] = el
                    }}
                    to={`/proyectos/${p.slug}`}
                    draggable={false}
                    tabIndex={reachable ? 0 : -1}
                    aria-current={c.d === 0 ? 'true' : undefined}
                    onClick={(e) => {
                      if (c.d === 0) return
                      e.preventDefault()
                      setActive(i)
                    }}
                  >
                    <img src={p.cover} alt={t.portadaDe(p.name)} draggable={false} decoding="sync" />
                    <span
                      ref={(el) => {
                        edgeEls.current[i] = el
                      }}
                      className="lift-edge"
                    />
                  </Link>
                </div>
              )
            })}
        </div>
        <span className="folder lift-layer lift-front" aria-hidden="true">
          <span className="folder-front" onClick={onClose}>
            <span className="folder-flap">
              <span className="folder-waves" aria-hidden="true" />
            </span>
            <span className="folder-pocket">
              <span className="folder-state">
                <span className="lift-label">
                  <span ref={labelShut}>{t.abrir}</span>
                  <span ref={labelOpen} className="lift-label-open">{t.cerrar}</span>
                </span>
                <span ref={plusEl} className="folder-plus" />
              </span>
            </span>
          </span>
        </span>
      </div>
      </div>
      <button ref={closeBtn} type="button" className="lift-close" style={{ top: stage.closeTop, opacity: 0 }} onClick={onClose}>
        {t.cerrar}
        <span className="folder-plus" aria-hidden="true" />
      </button>
      <div ref={infoRef} className="lift-info" style={{ opacity: 0 }}>
        {items.map((p, i) => (
          <div key={p.slug} className="lift-info-body" data-on={i === active || undefined}>
            <Title className="lift-name">{p.name}</Title>
            <p className="lift-meta">{[p.category, projectPages[p.slug]?.context?.split(' · ')[0]].filter(Boolean).join(' · ')}</p>
            <Link to={`/proyectos/${p.slug}`} className="lift-go" aria-label={`${t.verProyecto}: ${p.name}`}>
              {t.verProyecto} <span aria-hidden="true">→</span>
            </Link>
          </div>
        ))}
        <span className="sr-only" aria-live="polite">{items[active].name}</span>
      </div>
    </div>,
    document.body,
  )
}

/** Escritorio: la fila no se mueve nunca. Al pulsar una carpeta, sube a la capa fija y vuelve al cerrar. */
function DeskFolders({ level }) {
  const { projectGroups, featuredProjects } = useContent()
  const reduce = useReducedMotion()
  const [openId, setOpenId] = useState(null)
  const [live, setLive] = useState([]) // carpetas en la capa: la abierta y las que aún vuelven a su sitio
  const buttons = useRef({})
  const decoded = useRef([])
  const itemsOf = (g) => g.slugs.map((s) => featuredProjects.find((p) => p.slug === s))
  const locked = live.length > 0

  // Las portadas, ya descodificadas antes de que nadie pulse: el primer fotograma no espera a la imagen
  useEffect(() => {
    decoded.current = featuredProjects.filter((p) => p.cover).map((p) => {
      const im = new Image()
      im.src = p.cover
      im.decode?.().catch(() => {})
      return im
    })
  }, [featuredProjects])

  // La página no se mueve mientras haya capa; el hueco de la barra de scroll se compensa
  useLayoutEffect(() => {
    if (!locked) return undefined
    const { documentElement: html, body } = document
    const gutter = window.innerWidth - html.clientWidth
    const prev = [html.style.overflow, body.style.paddingRight]
    html.style.overflow = 'hidden'
    body.style.paddingRight = `${gutter}px`
    return () => {
      html.style.overflow = prev[0]
      body.style.paddingRight = prev[1]
    }
  }, [locked])

  const close = (id) => {
    setOpenId((cur) => (cur === id ? null : cur))
    buttons.current[id]?.focus({ preventScroll: true })
  }
  const toggle = (id) => {
    if (openId === id) {
      close(id)
      return
    }
    const geo = measure(buttons.current[id])
    setOpenId(id)
    setLive((l) => (l.some((e) => e.id === id) ? l : [...l, { id, geo }]))
  }

  return (
    <div className="folders">
      {projectGroups.map((g) => (
        <DeskFolder
          key={g.id}
          group={g}
          items={itemsOf(g)}
          isOpen={openId === g.id}
          onToggle={() => toggle(g.id)}
          buttonRef={(el) => {
            buttons.current[g.id] = el
          }}
          level={level}
        />
      ))}
      {live.map(({ id, geo }) => {
        const g = projectGroups.find((x) => x.id === id)
        return (
          <FolderLift
            key={id}
            group={g}
            items={itemsOf(g)}
            level={level}
            geo={geo}
            button={buttons.current[id]}
            open={openId === id}
            reduce={reduce}
            onClose={() => close(id)}
            onGone={() => setLive((l) => l.filter((e) => e.id !== id))}
          />
        )
      })}
    </div>
  )
}

const DESK_QUERY = '(min-width: 1024px)'
const subscribeDesk = (cb) => {
  const mq = window.matchMedia(DESK_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** Dos componentes separados: por debajo de 1024 px, el escenario bajo la carpeta; desde ahí, la capa fija. */
export default function ProjectFolders({ level = 3 }) {
  const desk = useSyncExternalStore(subscribeDesk, () => window.matchMedia(DESK_QUERY).matches, () => false)
  return desk ? <DeskFolders level={level} /> : <MobileFolders level={level} />
}
