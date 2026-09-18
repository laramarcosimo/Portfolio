import { motion, useTransform } from 'framer-motion'
import { RIBBON_COLORS, ribbonPaths } from '../data/ribbons'

function Strokes({ d, color, offset: [dx, dy], motionProps }) {
  return (
    <g transform={`translate(${dx} ${dy})`}>
      <motion.path d={d} fill="none" stroke={color} strokeWidth="var(--rw)" vectorEffect="non-scaling-stroke" {...motionProps} />
      {/* brillo superior: da volumen de cinta */}
      <motion.path
        d={d}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.16"
        strokeWidth="calc(var(--rw) * 0.22)"
        vectorEffect="non-scaling-stroke"
        transform="translate(-2 -5)"
        {...motionProps}
      />
    </g>
  )
}

// Cada cinta se dibuja con un pequeño retraso respecto a la anterior.
function ScrollLine({ progress, index, ...rest }) {
  const pathLength = useTransform(progress, [index * 0.1, 0.7 + index * 0.1], [0, 1], { clamp: true })
  return <Strokes {...rest} motionProps={{ style: { pathLength } }} />
}

function TimedLine({ index, ...rest }) {
  return (
    <Strokes
      {...rest}
      motionProps={{
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { duration: 1.6, delay: 0.2 + index * 0.18, ease: 'easeOut' },
      }}
    />
  )
}

/**
 * Tres cintas paralelas (navy, cielo, lavanda) sobre un mismo trazado.
 * Con `progress` se dibujan según el scroll; sin él, se animan al montarse.
 * `layers` (índices 0-2) permite pintar solo algunas para intercalarlas con otros elementos.
 * Posicionamiento y z-index vía `className`. El trazo mantiene su grosor al estirarse.
 */
export default function RibbonTrack({ name, progress, layers = [0, 1, 2], className = '', glow = false }) {
  const { d, viewH, offsets } = ribbonPaths[name]
  const filter = glow
    ? 'drop-shadow(0 0 10px rgba(150,201,255,.55)) drop-shadow(0 8px 10px rgba(25,42,86,.15))'
    : 'drop-shadow(0 8px 10px rgba(25,42,86,.15))'
  const Line = progress ? ScrollLine : TimedLine

  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <svg
        viewBox={`0 0 1440 ${viewH}`}
        preserveAspectRatio="none"
        className="absolute left-1/2 h-full w-full min-w-[900px] -translate-x-1/2 overflow-visible"
        style={{ filter }}
      >
        {layers.map((i) => (
          <Line key={i} d={d} color={RIBBON_COLORS[i]} offset={offsets[i]} index={i} progress={progress} />
        ))}
      </svg>
    </div>
  )
}
