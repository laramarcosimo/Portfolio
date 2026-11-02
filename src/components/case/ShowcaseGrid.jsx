import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1]

export function Rise({ children, className = '', delay = 0, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

// Bucle mudo que solo se descarga y reproduce cuando está a la vista.
function Loop({ src, label, className, style, width, height }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.15 })
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView])
  return <video ref={ref} src={src} muted loop playsInline preload="none" aria-label={label} width={width} height={height} className={className} style={style} />
}

/** Cada pieza con su propia proporción, sin marco ni fondo añadido; `fill` es solo el fondo propio de un arte transparente. */
export function Media({ item, eager = false }) {
  const { g, video, film, size, label, fill } = item
  const shared = {
    width: size[0],
    height: size[1],
    className: `cs-media${film ? ' cs-media--film' : ''}`,
    style: { '--r': size[0] / size[1], aspectRatio: `${size[0]} / ${size[1]}`, background: fill },
  }
  if (film) return <video {...shared} src={film} controls playsInline preload="metadata" aria-label={label} />
  if (video) return <Loop {...shared} src={video} label={label} />
  return <img {...shared} src={g.src} alt={g.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}

function Cell({ item }) {
  return (
    <Rise className="cs-cell">
      {item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" className="block">
          <Media item={item} />
          <span className="cs-caption cs-caption--link">{item.caption} <ArrowUpRight size={16} strokeWidth={1.5} /></span>
        </a>
      ) : (
        <>
          {item.frame ? (
            <div className="cs-frame" style={{ background: item.frame.bg, aspectRatio: `${item.size[0]} / ${item.size[1]}` }}>
              <div style={{ transform: `scale(${item.frame.scale})` }}><Media item={item} /></div>
            </div>
          ) : <Media item={item} />}
          {item.caption && <p className="cs-caption">{item.caption}</p>}
        </>
      )}
    </Rise>
  )
}

// Columnas proporcionales a cada pieza: la pareja comparte altura sin recortar nada.
const columns = (items) => items.map((x) => `minmax(0, ${x.size[0] / x.size[1]}fr)`).join(' ')
// Misma superficie en todos los paneles (4:3): dos logos de distinta forma pesan igual.
const LOGO_AREA = 0.2
const logoWidth = ([w, h], scale = 1) => `${Math.min(70, scale * 100 * Math.sqrt(LOGO_AREA * 0.75 * (w / h)))}%`

function Block({ block }) {
  if (block.type === 'logos') {
    return (
      <div className="cs-logos">
        {block.items.map((x) => (
          <Rise key={x.g.src}>
            <div className="cs-logo-panel" style={{ background: x.bg }}><img src={x.g.src} alt={x.g.alt} loading="lazy" decoding="async" style={{ width: logoWidth(x.size, x.scale) }} /></div>
            {x.caption && <p className="cs-caption">{x.caption}</p>}
          </Rise>
        ))}
      </div>
    )
  }
  if (block.type === 'grid' || block.type === 'squares') {
    return <div className={`cs-grid2${block.type === 'squares' ? ' cs-grid2--square' : ''}`}>{block.items.map((item, k) => <Cell key={k} item={item} />)}</div>
  }
  if (block.type === 'duo') {
    return <div className="cs-duo" style={{ '--cols': columns(block.items) }}>{block.items.map((item, k) => <Cell key={k} item={item} />)}</div>
  }
  return <div className={block.type === 'bleed' ? 'cs-bleed' : 'cs-single'}><Cell item={block.items[0]} /></div>
}

/** Bloques de imágenes: a sangre, a columna, dúo o logos enfrentados. */
export default function ShowcaseGrid({ blocks }) {
  return <div className="cs-rows">{blocks.map((block, i) => <Block key={i} block={block} />)}</div>
}
