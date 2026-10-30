import { useEffect, useRef, useState } from 'react'
import { useUi } from '../i18n/ui'

/** Como en un lector de libros electrónicos: una línea de progreso y en qué capítulo vas. Los capítulos son las secciones de la página. */
export default function ReaderProgress() {
  const t = useUi()
  const line = useRef(null)
  const [chapter, setChapter] = useState(null)

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const sections = [...document.querySelectorAll('main section[aria-label]')]
      const doc = document.documentElement
      const mark = window.innerHeight * 0.5
      let current = -1
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= mark) current = i
      })
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (line.current) line.current.style.transform = `scaleX(${progress})`
      const next = current >= 0 && sections.length > 1 ? { n: current + 1, of: sections.length, name: sections[current].getAttribute('aria-label') } : null
      setChapter((prev) => (prev?.n === next?.n && prev?.of === next?.of && prev?.name === next?.name ? prev : next))
    }
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    ask()
    window.addEventListener('scroll', ask, { passive: true })
    window.addEventListener('resize', ask)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', ask)
      window.removeEventListener('resize', ask)
    }
  }, [t])

  return (
    <div className="reader no-print" aria-hidden="true">
      {chapter && <p className="reader-label">{t.capitulo(chapter.n, chapter.of, chapter.name)}</p>}
      <span ref={line} className="reader-line" />
    </div>
  )
}
