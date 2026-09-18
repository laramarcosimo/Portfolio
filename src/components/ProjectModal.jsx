import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { img, toolLabels } from '../data/content'

/** Ficha de proyecto: descripción, paleta, tipografía, galería de mockups y herramientas. */
export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Portal a <body>: debe quedar por encima de la navbar y del lienzo de cintas.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Cerrar"
          className="sticky top-3 z-10 float-right mr-3 mt-3 grid h-10 w-10 place-items-center rounded-full bg-navy text-white shadow-md transition hover:bg-navy/85"
        >
          <X size={20} />
        </button>

        <div className="p-6 pt-8 sm:p-10">
          <p className="text-sm font-semibold text-lilac">{project.category}</p>
          <h3 className="mt-1 text-3xl font-bold tracking-tight text-navy sm:text-4xl">{project.title}</h3>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy/80">{project.description}</p>

          {project.palette.length > 0 && (
            <ul className="mt-7 flex flex-wrap gap-3" aria-label="Paleta de color">
              {project.palette.map((c) => (
                <li key={c.hex} className="flex items-center gap-2.5 rounded-full border border-navy/10 py-1.5 pl-1.5 pr-4">
                  <span className="h-7 w-7 rounded-full border border-navy/10" style={{ background: c.hex }} />
                  <span className="text-xs font-semibold text-navy">
                    {c.name} <span className="font-medium text-navy/55">{c.hex}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {project.typography && (
            <p className="mt-4 text-sm text-navy/70">
              <span className="font-bold text-navy">Tipografía:</span> {project.typography}
            </p>
          )}

          {project.video && (
            <video
              src={project.video}
              poster={project.cover}
              controls
              playsInline
              preload="metadata"
              className="mt-8 w-full rounded-2xl bg-navy"
            />
          )}

          {project.gallery.length > 0 && (
            <div className="mt-8 columns-1 gap-4 sm:columns-2">
              {[{ src: project.cover, alt: `${project.title} — presentación` }, ...project.gallery].map((g) => (
                <img
                  key={g.src}
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="mb-4 w-full break-inside-avoid rounded-2xl bg-mist"
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-navy">Hecho con:</span>
              {project.tools.map((t) => (
                <img key={t} src={img(`tools/${t}`)} alt={toolLabels[t]} title={toolLabels[t]} className="h-8 w-8" />
              ))}
            </div>
            {project.link && (
              <a
                href={project.link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                {project.link.label} <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  )
}
