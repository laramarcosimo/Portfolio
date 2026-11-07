import { img } from '../../data/content'

/** Proceso del logo: del punto de partida a la versión final, en una fila de cuatro paneles. */
export default function ProcessStrip({ process }) {
  return (
    <section className="cs-section">
      <div className="cs-wrap">
        <h2 className="cs-heading">{process.title}</h2>
        <ol className="cs-process">
          {process.steps.map((s, i) => (
            <li key={s.label}>
              <figure>
                <img src={img(s.img)} alt={s.label + ': ' + s.text} loading="lazy" />
                <figcaption>
                  <span className="cs-process-label">{String(i + 1).padStart(2, '0')} · {s.label}</span>
                  {s.text}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
