import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useProjectPages } from '../data/useContent'
import { useUi } from '../i18n/ui'

/**
 * Visor del manual de marca dentro de la web: dibuja cada página del PDF con pdf.js,
 * así se ve igual en todos los navegadores y móviles, sin que el navegador lo descargue.
 */
export default function ManualViewer() {
  const { slug } = useParams()
  const { projectPages } = useProjectPages()
  const t = useUi()
  const page = projectPages[slug]
  const box = useRef(null)
  const anchor = useRef(null) // hueco de la flecha junto a "Volver al proyecto"
  const arrow = useRef(null) // la única flecha, fija: sale del texto y baja al hueco de la izquierda
  useEffect(() => {
    let raf = 0
    const place = () => {
      raf = 0
      const a = anchor.current
      const el = arrow.current
      if (!a || !el) return
      const r = a.getBoundingClientRect()
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      // Se queda fija a 7,5rem del borde o, si el enlace ya empieza más arriba, donde empieza (así arriba del todo no se mueve)
      const stop = Math.min(7.5 * rem, r.top + window.scrollY)
      const page = box.current?.getBoundingClientRect()
      const gutterX = page ? page.left - 2.5 * rem : r.left
      const hasGutter = page && page.left > 4 * rem
      const p = Math.min(1, Math.max(0, (stop - r.top) / (3 * rem))) // 0: junto al texto · 1: en el hueco
      const x = hasGutter ? r.left + (gutterX - r.left) * p : r.left
      const y = Math.max(r.top, stop) + (r.height - el.offsetHeight) / 2
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.opacity = hasGutter ? String(1 - 0.3 * p) : String(1 - p)
      el.style.pointerEvents = !hasGutter && p > 0.6 ? 'none' : ''
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(place) }
    place()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    const ro = new ResizeObserver(req)
    if (box.current) ro.observe(box.current)
    return () => { window.removeEventListener('scroll', req); window.removeEventListener('resize', req); ro.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  const [state, setState] = useState({ done: 0, total: 0, error: false })
  const url = page?.manual ? import.meta.env.BASE_URL + page.manual : null

  useEffect(() => {
    if (!url) return undefined
    let cancelled = false
    const host = box.current
    ;(async () => {
      try {
        // pdf.js solo se descarga al abrir el visor, no pesa en el resto de la web
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
        const doc = await pdfjs.getDocument(url).promise
        if (cancelled) return
        setState({ done: 0, total: doc.numPages, error: false })
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        for (let n = 1; n <= doc.numPages && !cancelled; n++) {
          const p = await doc.getPage(n)
          const width = Math.min(host.clientWidth, 1200)
          const vp = p.getViewport({ scale: (width / p.getViewport({ scale: 1 }).width) * ratio })
          const canvas = document.createElement('canvas')
          canvas.width = vp.width
          canvas.height = vp.height
          canvas.className = 'manual-page'
          canvas.setAttribute('aria-label', `${t.manualPagina} ${n}`)
          host.appendChild(canvas)
          await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise
          if (!cancelled) setState((s) => ({ ...s, done: n }))
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, error: true }))
      }
    })()
    return () => {
      cancelled = true
      host.replaceChildren()
    }
  }, [url, t.manualPagina])

  if (!url) return <Navigate to="/proyectos" replace />

  return (
    <main className="manual-viewer">
      <div className="manual-bar">
        <Link to={`/proyectos/${slug}`} className="cs-back"><span ref={anchor} className="manual-arrow-slot" aria-hidden="true" /> {t.volverProyecto}</Link>
        <a href={url} download className="manual-download"><Download size={14} strokeWidth={1.5} /> {t.descargarPdf}</a>
      </div>
      {state.total > 0 && state.done < state.total && <p className="manual-status">{t.cargandoManual} {state.done} / {state.total}</p>}
      {state.error && <p className="manual-status">{t.errorManual} <a href={url}>{t.descargarPdf}</a></p>}
      <div ref={box} className="manual-pages" />
      {/* Una sola flecha: junto a "Volver al proyecto" arriba; al bajar se desliza al hueco izquierdo y se queda fija; al subir vuelve */}
      {/* En el body: la transición de página transforma el contenedor y desplazaría una posición fija */}
      {createPortal(
        <Link ref={arrow} to={`/proyectos/${slug}`} className="manual-back-fixed" aria-label={t.volverProyecto} title={t.volverProyecto}>
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>,
        document.body,
      )}
    </main>
  )
}
