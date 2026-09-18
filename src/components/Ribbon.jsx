import { useId } from 'react'
import { motion } from 'framer-motion'
import { RIBBON_COLORS, ribbonPresets } from '../data/ribbons'

const VIEW_W = 1440
const VIEW_H = 400
const BLEED = 80

// Curva suave (Bézier cúbica horizontal) que pasa por todos los puntos.
function ribbonPath(points) {
  const n = points.length - 1
  const xs = points.map((_, i) => -BLEED + ((VIEW_W + BLEED * 2) / n) * i)
  const top = points.map(([y]) => y)
  const bottom = points.map(([y, t]) => y + t)

  let d = `M${xs[0]} ${top[0]}`
  for (let i = 1; i <= n; i++) {
    const mx = (xs[i - 1] + xs[i]) / 2
    d += ` C${mx} ${top[i - 1]} ${mx} ${top[i]} ${xs[i]} ${top[i]}`
  }
  d += ` L${xs[n]} ${bottom[n]}`
  for (let i = n - 1; i >= 0; i--) {
    const mx = (xs[i + 1] + xs[i]) / 2
    d += ` C${mx} ${bottom[i + 1]} ${mx} ${bottom[i]} ${xs[i]} ${bottom[i]}`
  }
  return `${d} Z`
}

function Ribbon({ points, color, index, gid }) {
  const d = ribbonPath(points)
  return (
    <motion.g
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay: index * 0.15, ease: 'easeOut' }}
    >
      <motion.g
        animate={{ y: [0, index % 2 ? 9 : -9, 0] }}
        transition={{ duration: 7 + index * 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d={d} fill={color} />
        {/* sombreado longitudinal y vertical: da volumen y sensación de pliegue */}
        <path d={d} fill={`url(#${gid}-h)`} />
        <path d={d} fill={`url(#${gid}-v)`} />
      </motion.g>
    </motion.g>
  )
}

/**
 * Conjunto de cintas SVG apiladas (navy < sky < lilac) para crear profundidad.
 * `layers` permite pintar solo algunas (p. ej. una delante y otras detrás de una foto).
 * Se posiciona de forma absoluta: pásale `className` con inset/tamaño y z-index.
 */
export default function RibbonSet({
  variant = 'hero',
  layers = ['navy', 'sky', 'lilac'],
  className = '',
  mask,
}) {
  const gid = useId().replace(/:/g, '')
  const preset = ribbonPresets[variant]
  const order = ['navy', 'sky', 'lilac'].filter((k) => layers.includes(k) && preset[k])
  const style = mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined

  return (
    <div className={`pointer-events-none absolute overflow-hidden ${className}`} style={style} aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute left-1/2 h-full w-full min-w-[1000px] -translate-x-1/2"
        style={{ filter: 'drop-shadow(0 10px 14px rgba(25,42,86,0.18))' }}
      >
        <defs>
          <linearGradient id={`${gid}-h`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.12" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0.1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id={`${gid}-v`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        {order.map((key, i) => (
          <Ribbon key={key} points={preset[key]} color={RIBBON_COLORS[key]} index={i} gid={gid} />
        ))}
      </svg>
    </div>
  )
}
