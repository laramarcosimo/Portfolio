import { Rise } from './ShowcaseGrid'

/** El relato del proyecto: un solo bloque centrado, de lectura cómoda. */
export default function ProjectStory({ title, paragraphs, band }) {
  return (
    <section className={band ? 'cs-band' : 'cs-section'} style={band && { background: band.bg, color: band.dark ? '#10131A' : '#FFFFFF' }}>
      <Rise className="cs-wrap cs-story">
        <h2 className="cs-heading">{title}</h2>
        {paragraphs.map((text) => <p key={text} className="cs-text">{text}</p>)}
      </Rise>
    </section>
  )
}
