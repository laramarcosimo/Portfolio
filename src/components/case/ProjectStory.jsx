import { Rise } from './ShowcaseGrid'

/** El relato del proyecto: un solo bloque centrado, de lectura cómoda. */
export default function ProjectStory({ title, paragraphs, band, keys }) {
  return (
    <section className={band ? 'cs-band' : 'cs-section'} style={band && { background: band.bg, color: band.dark ? '#10131A' : '#FFFFFF' }}>
      <Rise className="cs-wrap cs-story">
        <h2 className="cs-heading">{title}</h2>
        {paragraphs.map((p) => {
          const text = typeof p === 'string' ? p : p.text
          const label = typeof p === 'string' ? null : keys?.[p.key]
          return (
            <div key={text} className="cs-story-step">
              {label && <p className="cs-story-key">{label}</p>}
              <p className="cs-text">{text}</p>
            </div>
          )
        })}
      </Rise>
    </section>
  )
}
