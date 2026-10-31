import { useRef } from 'react'
import FolderThreads from '../components/FolderThreads'
import ProjectFolders from '../components/ProjectFolders'
import { useUi } from '../i18n/ui'

/** Proyectos: titular, los hilos y las carpetas. */
export default function Projects() {
  const t = useUi()
  const rootRef = useRef(null)
  const nameRef = useRef(null)
  const blockRef = useRef(null)
  return (
    <main ref={rootRef} className="relative isolate px-4 pb-28 pt-20 sm:px-8 sm:pb-40 sm:pt-32 lg:pt-10">
      <FolderThreads rootRef={rootRef} nameRef={nameRef} blockRef={blockRef} />
      <div ref={blockRef}>
        <h1 ref={nameRef} className="display w-fit text-ink">{t.proyectos}</h1>
        <p className="mt-6 max-w-[44ch] text-base leading-[1.7] text-ink/85 sm:text-lg">{t.proyectosClaim}</p>
      </div>
      <div className="projects-folders">
        <ProjectFolders level={2} />
      </div>
    </main>
  )
}
