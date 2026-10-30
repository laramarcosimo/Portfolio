import { animate, cubicBezier } from 'framer-motion'

const EASE = cubicBezier(0.16, 1, 0.3, 1)
const DURATION = 0.95 // s
const NAV_SPACE = 170 // la barra y el bolsillo de la carpeta siguen a la vista, en px
const FLAP_DEG = -28

const span = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)))
const smooth = (s) => s * s * (3 - 2 * s)
const lerp = (a, b, k) => a + (b - a) * k

/** Una lámina y su portada: caja de origen, caja de destino y por dónde la tapa la solapa (recorte en %, recto sobre la lámina girada). */
function pair(sheet, cover, base, folderBox, front) {
  const cs = getComputedStyle(sheet)
  const [tx = 0, ty = 0] = cs.translate === 'none' ? [] : cs.translate.split(' ').map(parseFloat)
  const deg = cs.rotate === 'none' ? 0 : parseFloat(cs.rotate)
  const w = sheet.offsetWidth
  const h = sheet.offsetHeight
  const cx = folderBox.left - base.left + sheet.offsetLeft + tx + w / 2
  const cy = folderBox.top - base.top + sheet.offsetTop + ty + h / 2
  const to = cover.getBoundingClientRect()
  // Canto de la solapa (corte inclinado de 1.5rem): Y = b + aX
  const left = folderBox.left - base.left + front.offsetLeft
  const top = folderBox.top - base.top + front.offsetTop
  const a = -24 / front.offsetWidth
  const b = top + 24 - a * left
  const rad = (deg * Math.PI) / 180
  const [s, c] = [Math.sin(rad), Math.cos(rad)]
  const hiddenAt = (x) => {
    const v = (b + a * cx + a * x * c - cy - x * s) / (c + a * s)
    return Math.min(100, Math.max(0, ((v + h / 2) / h) * 100))
  }
  return {
    src: { cx, cy, w, deg },
    dst: { x: to.left - base.left, y: to.top - base.top, w: to.width, h: to.height },
    edge: [hiddenAt(-w / 2), hiddenAt(w / 2)],
    lift: h * 0.14,
  }
}

/**
 * Abre o cierra una carpeta con un único reloj: las portadas son las mismas láminas que salen y viajan, y solapa,
 * color, altura y desplazamiento se calculan del mismo instante. Las portadas viajan en una capa propia para que
 * ni el recorte de la fila ni el del panel las corten; la real y la lámina están ocultas mientras tanto, nunca hay dos.
 */
export function flyFolder({ dir, reduce, layer, folder, wrapper, panel, startHeight = 0, onDone }) {
  const opening = dir === 'open'
  const front = folder.querySelector('.folder-front')
  front.style.transition = ''
  const base = layer.getBoundingClientRect()
  const folderBox = folder.getBoundingClientRect()
  const panelBox = panel.getBoundingClientRect()
  const fullHeight = panel.offsetHeight
  const fromHeight = opening ? startHeight : wrapper.offsetHeight

  const sheets = [...folder.querySelectorAll('.folder-sheet')]
  const covers = [...panel.querySelectorAll('.folder-cover img')]
  panel.dataset.flying = ''
  const flights = reduce
    ? []
    : sheets.flatMap((sheet, i) => {
        const cover = covers[i]
        if (!cover || !sheet.offsetWidth || !cover.getBoundingClientRect().width) return []
        const p = pair(sheet, cover, base, folderBox, front)
        const el = document.createElement('img')
        el.src = sheet.currentSrc || sheet.src
        el.alt = ''
        el.decoding = 'sync'
        el.className = 'folder-ghost'
        Object.assign(el.style, { left: `${p.dst.x}px`, top: `${p.dst.y}px`, width: `${p.dst.w}px`, height: `${p.dst.h}px` })
        layer.append(el)
        return [{ ...p, el, i }]
      })

  // Lo justo para ver el panel al abrir; al cerrar, solo si la carpeta quedó por encima de la barra
  const box = wrapper.getBoundingClientRect()
  const startY = window.scrollY
  let delta = 0
  if (opening) {
    const need = box.top + fullHeight - window.innerHeight
    if (need > 0) delta = Math.max(0, Math.min(need, box.top - NAV_SPACE))
  } else if (folderBox.top < 80) {
    delta = folderBox.top - 80
  }
  let userScrolled = false
  const onUser = () => {
    userScrolled = true
  }
  window.addEventListener('wheel', onUser, { passive: true })
  window.addEventListener('touchmove', onUser, { passive: true })

  const paint = (u) => {
    const flap = opening ? EASE(span(u, 0, 0.7)) : 1 - smooth(span(u, 0.55, 1))
    const grow = opening ? EASE(span(u, 0.05, 1)) : 1 - EASE(span(u, 0, 0.85))
    const reveal = opening ? span(u, 0.4, 0.9) : 1 - span(u, 0, 0.2)

    front.style.transform = flap > 0 ? `perspective(900px) rotateX(${(FLAP_DEG * flap).toFixed(2)}deg)` : ''
    wrapper.style.height = `${lerp(opening ? fromHeight : 0, opening ? fullHeight : fromHeight, grow).toFixed(1)}px`
    const [l, r] = [(folderBox.left - panelBox.left) * (1 - grow), (panelBox.right - folderBox.right) * (1 - grow)]
    panel.style.clipPath = `inset(0 ${Math.max(0, r).toFixed(1)}px 0 ${Math.max(0, l).toFixed(1)}px)`
    panel.style.setProperty('--reveal', reveal.toFixed(3))

    flights.forEach(({ el, src, dst, edge, lift, i }) => {
      const k = opening ? EASE(span(u, 0.16 + i * 0.03, 1)) : 1 - EASE(span(u, i * 0.03, 0.8))
      const rise = opening
        ? EASE(span(u, 0, 0.25)) * (1 - k)
        : EASE(span(u, 0, 0.4)) * (1 - smooth(span(u, 0.6, 1)))
      const x = lerp(src.cx, dst.x + dst.w / 2, k) - (dst.x + dst.w / 2)
      const y = lerp(src.cy, dst.y + dst.h / 2, k) - (dst.y + dst.h / 2) - lift * rise
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${(src.deg * (1 - k)).toFixed(3)}deg) scale(${lerp(src.w / dst.w, 1, k).toFixed(4)})`
      if (flap >= 1) el.style.clipPath = 'none'
      else {
        // Lo que aún tapa la solapa no se ve: el recorte sigue su canto y se abre con ella
        const [yl, yr] = [lerp(edge[0], 100, flap), lerp(edge[1], 100, flap)]
        const slope = (yr - yl) * 0.2
        el.style.clipPath = `polygon(-20% -20%, 120% -20%, 120% ${(yr + slope).toFixed(2)}%, -20% ${(yl - slope).toFixed(2)}%)`
      }
    })

    if (delta && !userScrolled) window.scrollTo({ top: startY + delta * EASE(u), behavior: 'instant' })
  }

  let finished = false
  let controls = null
  const finish = () => {
    if (finished) return
    finished = true
    controls?.stop()
    paint(1)
    window.removeEventListener('wheel', onUser)
    window.removeEventListener('touchmove', onUser)
    if (opening) {
      wrapper.style.height = ''
      panel.style.clipPath = ''
      panel.style.removeProperty('--reveal')
      delete panel.dataset.flying
    }
    onDone?.() // al cerrar, retira el panel y devuelve las láminas en el mismo fotograma
    flights.forEach(({ el }) => el.remove())
    if (!opening) front.style.transform = ''
  }

  if (reduce) finish()
  else {
    paint(0)
    controls = animate(0, 1, { duration: DURATION, ease: 'linear', onUpdate: paint, onComplete: finish })
  }
  return { finish }
}
