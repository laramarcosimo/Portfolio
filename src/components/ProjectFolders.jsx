import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useContent, useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'
import { DUR } from '../lib/motion'

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

const DESK_CLIP = 0.536 // fracción de la altura donde empieza la solapa: lo que queda por debajo oculta las portadas

/** Abanico de escritorio, en unidades de la carpeta sin escalar (la escala la pone la celda): como la demo aprobada. */
function deskGeo(fw, H, aspects, many) {
  const cw = (many ? 0.5 : 0.63) * fw
  const sp = (many ? 0.3 : 0.585) * fw
  const ang = many ? 8 : 12
  const clipY = H * DESK_CLIP
  const arc = (d) => (Math.abs(d) * 0.108 - 0.138) * fw
  const box = aspects.map((a) => {
    const ch = Math.min(cw / a, 0.9 * fw)
    return { ch, w: ch * a }
  })
  let top = 0
  const ds = many ? [-2.2, 0, 2.2] : aspects.map((_, i) => i - (aspects.length - 1) / 2)
  for (const b of box) {
    for (const d of ds) {
      const rad = (Math.abs(d) * ang * Math.PI) / 180
      const cy = clipY + 0.08 * fw - b.ch / 2 + arc(d) - 0.16 * b.ch
      top = Math.min(top, cy - ((b.ch / 2) * Math.cos(rad) + (b.w / 2) * Math.sin(rad)) * 1.08)
    }
  }
  return { fw, sp, ang, clipY, arc, box, up: Math.ceil(-top + 0.03 * fw) }
}

/** Portada de escritorio: nace dentro de la carpeta (oculta por la solapa) y sale en abanico; al cerrar vuelve a entrar con ella. */
function DeskCover({ project, index, d, many, geo, out, entered, lifted, reduce, dragging, hidden, z, onLift, onDrop, onCoverClick, onCoverPointerDown, onKeyNav, linkRef, label, n }) {
  const { ch, w } = geo.box[index]
  const shown = out && !hidden
  const open = { x: d * geo.sp, y: geo.arc(d) + (lifted ? -0.16 * ch : 0), rotate: lifted ? 0 : n === 1 ? -3 : d * geo.ang, scale: lifted ? 1.08 : 1, opacity: hidden ? 0 : 1 }
  // Cerrada: asoma la parte alta de la portada, algo abierta en abanico, detrás de la solapa; desde ahí sale al abrir
  const pd = many ? Math.max(-1.2, Math.min(1.2, d)) : d
  const inside = { x: pd * geo.sp * 0.28, y: ch - 0.2 * geo.fw, rotate: n === 1 ? -1.5 : pd * geo.ang * 0.5, scale: 1, opacity: 1 }
  const delay = out && !entered && !reduce ? 0.05 + index * STAGGER : 0
  const dur = reduce ? 0 : out && entered ? (dragging ? 0 : DUR.quick * 1.2) : SLOW
  return (
    <motion.div
      className="fan-cover"
      style={{ left: -w / 2, top: 0.08 * geo.fw - ch, width: w, height: ch, zIndex: z, pointerEvents: shown ? 'auto' : 'none' }}
      initial={inside}
      animate={out ? open : inside}
      transition={{ duration: dur, delay, ease: EASE_EXPO }}
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
  )
}

/** Lo que se abre bajo la fila: la carpeta grande, su abanico y, debajo, el proyecto que se está mirando. */
function FolderStage({ id, group, items, level, out, collapsed, held, reduce, origin, focusFirst, onClose, desk, deskBox, onReserve }) {
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
    if (desk) return undefined
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
  const geo = desk ? deskGeo(deskBox.w, deskBox.H, aspects, many) : size && fanLayout(size.w, size.h, aspects)
  const deskUp = desk ? geo.up * deskBox.s : 0
  useEffect(() => {
    if (desk && out) onReserve(deskUp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desk, out, deskUp])

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
    if (desk || !out || !height || !stageRef.current) return undefined
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
  if (desk) {
    return (
      <>
        <div
          id={out ? id : undefined}
          className="desk-fan"
          data-many={many || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClickCapture={onClickCapture}
        >
          <div className="desk-pivot" style={{ top: geo.clipY }}>
            {items.map((p, i) => {
              const d = many ? i - rot : i - (n - 1) / 2
              return (
                <DeskCover
                  key={p.slug}
                  project={p}
                  index={i}
                  n={n}
                  d={d}
                  many={many}
                  geo={geo}
                  out={out}
                  entered={entered}
                  lifted={lifted === i}
                  reduce={reduce}
                  dragging={dragging}
                  hidden={many && Math.abs(d) > 2.2}
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
        </div>
        <div className="desk-info" data-on={out || undefined} aria-hidden={!out} style={{ '--s': deskBox.s }}>
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
              <Link to={`/proyectos/${project.slug}`} className="stage-info-go" tabIndex={out ? 0 : -1} aria-label={`${t.verProyecto}: ${project.name}`}>
                {t.verProyecto} <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>
          {out && <span className="sr-only" aria-live="polite">{project.name}</span>}
        </div>
      </>
    )
  }
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

/** Los proyectos: tres carpetas que no se mueven nunca. Al pulsar una, debajo se abre su escenario. */
const INFO_H = 124

export default function ProjectFolders({ level = 3 }) {
  const { projectGroups, featuredProjects } = useContent()
  const reduce = useReducedMotion()
  const [desk, setDesk] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)
  const [m, setM] = useState(null)
  const [up, setUp] = useState(0)
  const [selected, setSelected] = useState(null) // lo que el botón anuncia
  const [shownId, setShownId] = useState(null) // la carpeta cuyo escenario está en pantalla
  const [out, setOut] = useState(false)
  const buttons = useRef({})
  const root = useRef(null)
  const timer = useRef(0)
  const anchor = useRef(null) // móvil: al cambiar el escenario de sitio, la carpeta pulsada no se mueve de la pantalla
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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setDesk(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useLayoutEffect(() => {
    const el = root.current
    if (!desk || !el) return undefined
    const measure = () => {
      const cs = [...el.querySelectorAll(':scope > .folder-cell')]
      if (!cs.length) return
      setM({ W: el.clientWidth, w: cs[0].offsetWidth, H: cs[0].offsetHeight, lefts: cs.map((c) => c.offsetLeft), vh: window.innerHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [desk])

  // Como la demo: crece hacia el centro (1.25 a 1.85 veces) intentando que el abanico y la ficha quepan en pantalla
  const bigS = m ? Math.max(1.25, Math.min(1.85, (m.vh - 72 - 96 - INFO_H) / (m.H + 0.45 * m.w), (m.W - 24) / m.w / 1.3)) : 1
  const selIdx = projectGroups.findIndex((g) => g.id === selected)
  const cellPose = (i) => {
    if (!desk || !m || selIdx < 0) return { x: 0, y: 0, scale: 1, opacity: 1 }
    if (i === selIdx) return { x: m.W / 2 - (m.lefts[i] + m.w / 2), y: (m.H * (bigS - 1)) / 2, scale: bigS, opacity: 1 }
    return { x: 0, y: 0, scale: 0.85, opacity: 0.35 }
  }
  // La que se cierra sigue delante de las otras hasta terminar de volver a su sitio
  const [front, setFront] = useState(null)
  useEffect(() => {
    if (selected) {
      setFront(selected)
      return undefined
    }
    const id = setTimeout(() => setFront(null), SLOW * 1000)
    return () => clearTimeout(id)
  }, [selected])

  // Escritorio: la página baja solo lo justo para que el abanico y la ficha se vean
  useEffect(() => {
    if (!desk || !selected || !m || !root.current) return undefined
    const nav = document.querySelector('.sticky.top-0')?.offsetHeight ?? 0
    const top = root.current.getBoundingClientRect().top
    const over = top + 16 + up + m.H * bigS + INFO_H + 16 - window.innerHeight
    const shift = Math.min(over, top - nav - 8)
    if (shift <= 1) return undefined
    const from = window.scrollY
    if (reduce) {
      window.scrollTo({ top: from + shift, behavior: 'instant' })
      return undefined
    }
    const run = animate(0, shift, { duration: SLOW, ease: EASE_EXPO, onUpdate: (v) => window.scrollTo({ top: from + v, behavior: 'instant' }) })
    const stop = () => run.stop()
    window.addEventListener('wheel', stop, { passive: true })
    return () => {
      run.stop()
      window.removeEventListener('wheel', stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desk, selected, up])

  const toggle = (id, keyboard) => {
    if (desk) {
      viaKeyboard.current = keyboard
      if (selected === id) close()
      else setSelected(id)
      return
    }
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
      if (!e.target.isConnected || e.target.closest('.folder, .fan-cover, .stage-info-body, .big-back, .folder-front, .desk-info')) return
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

  const ease = { duration: reduce ? 0 : SLOW, ease: EASE_EXPO }
  return (
    <div ref={root} className="folders" data-active={selected ? 'true' : undefined}>
      <motion.div className="desk-spacer" style={{ gridRow: 1 }} initial={false} animate={{ height: desk && selected ? up : 0 }} transition={ease} aria-hidden="true" />
      {projectGroups.map((g, i) => (
        <motion.div key={g.id} className="folder-cell" style={{ zIndex: (selected ?? front) === g.id ? 3 : 1 }} initial={false} animate={cellPose(i)} transition={ease}>
          <Folder
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
          {desk && m && (
            <FolderStage
              id={stageId}
              group={g}
              items={itemsOf(g)}
              level={level}
              out={selected === g.id}
              reduce={reduce}
              focusFirst={viaKeyboard.current}
              onClose={close}
              held={held}
              desk
              deskBox={{ W: m.W, w: m.w, H: m.H, s: bigS }}
              onReserve={setUp}
            />
          )}
        </motion.div>
      ))}
      <motion.div className="desk-spacer" style={{ gridRow: 3 }} initial={false} animate={{ height: desk && selected && m ? m.H * (bigS - 1) + INFO_H : 0 }} transition={ease} aria-hidden="true" />
      {!desk && shownGroup && (
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
