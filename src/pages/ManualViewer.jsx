import { useEffect, useRef, useState } from 'react'
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
        <Link to={`/proyectos/${slug}`} className="cs-back"><ArrowLeft size={14} strokeWidth={1.5} /> {t.volverProyecto}</Link>
        <a href={url} download className="manual-download"><Download size={14} strokeWidth={1.5} /> {t.descargarPdf}</a>
      </div>
      {state.total > 0 && state.done < state.total && <p className="manual-status">{t.cargandoManual} {state.done} / {state.total}</p>}
      {state.error && <p className="manual-status">{t.errorManual} <a href={url}>{t.descargarPdf}</a></p>}
      <div ref={box} className="manual-pages" />
    </main>
  )
}
