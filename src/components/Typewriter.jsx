import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Escribe las líneas una tras otra (efecto máquina de escribir) al entrar en pantalla. */
export default function Typewriter({ lines, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [typed, setTyped] = useState(0)
  const total = lines.reduce((n, l) => n + l.length, 0)
  const count = prefersReduced() ? total : typed

  useEffect(() => {
    if (!inView) return undefined
    const id = setInterval(() => setTyped((c) => (c >= total ? c : c + 1)), 30)
    return () => clearInterval(id)
  }, [inView, total])

  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length, 0))

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => {
        const Tag = i === 0 ? 'h3' : 'p'
        return (
          <Tag key={line} className={`${i === 0 ? 'text-2xl font-bold sm:text-3xl' : 'mt-1 text-sm font-medium'} min-h-[1.4em] whitespace-pre`} aria-label={line}>
            <span aria-hidden="true">{line.slice(0, Math.max(0, count - starts[i]))}</span>
          </Tag>
        )
      })}
    </div>
  )
}
