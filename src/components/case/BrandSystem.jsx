import { useState } from 'react'
import ShowcaseGrid, { Rise } from './ShowcaseGrid'

/** Muestra tipográfica: cada estilo es un botón que aplica su familia y su peso al texto de ejemplo. */
function Specimen({ ty, stylesLabel, role }) {
  const [active, setActive] = useState(0)
  const extra = Array.isArray(ty.extra) ? ty.extra.join(' ') : ty.extra
  const faceOf = (x) => ({ fontFamily: `${x.family}, sans-serif`, fontWeight: x.weight, fontStyle: x.style ?? 'normal' })
  const face = faceOf(ty.weights[active] ?? ty.weights[0])
  return (
    <div className="cs-specimen">
      <div>
        {role && <p className="cs-specimen-role">{role}</p>}
        <div className="cs-specimen-head">
          <p className="cs-specimen-name" style={face}>{ty.title}</p>
          <p className="cs-specimen-aa" style={face} aria-hidden="true">Aa</p>
        </div>
      </div>
      <div>
        <div className="cs-specimen-styles" role="group" aria-label={`${stylesLabel} ${ty.title}`}>
          {ty.weights.map((x, i) => (
            <button key={x.label} type="button" className="cs-style" style={faceOf(x)} aria-pressed={i === active} onClick={() => setActive(i)}>
              {x.label}
            </button>
          ))}
        </div>
        <p className="cs-specimen-chars" style={face}>{ty.chars.join(' ')}</p>
        <p className="cs-specimen-chars" style={face}>{extra}</p>
      </div>
    </div>
  )
}

/** Sistema de marca: logotipo, color, tipografía y patrón, en un solo recorrido. */
import LogoUsage from './LogoUsage'

// "CMYK 100, 88, 37, 31" -> "C100 M88 Y37 K31"
const cmykOf = (c) => {
  const l = c.lines?.find((x) => /CMYK/i.test(x))
  if (!l) return null
  const v = l.replace(/CMYK[:s]*/i, '').split(',').map((n) => n.trim()).filter(Boolean)
  return v.length === 4 ? v.map((n, i) => 'CMYK'[i] + n).join(' ') : null
}

export default function BrandSystem({ slug, page, parts, specimens, t }) {
  const L = page.labels
  return (
    <section className="cs-section">
      <div className="cs-wrap">
        <h2 className="cs-heading">{L.brand}</h2>
        {parts.logo.length > 0 && (
          <div className="cs-block">
            <h3 className="cs-label">{L.logo}</h3>
            <ShowcaseGrid blocks={parts.logo} />
          </div>
        )}
        {page.usage && <LogoUsage usage={page.usage} label={page.title} L={t.usoLogo} />}
        <div className="cs-block">
          <h3 className="cs-label">{t.color}</h3>
          <Rise className={`cs-palette${parts.swatch ? ` cs-palette--${parts.swatch}` : ''}`} style={{ '--n': page.colors.length }}>
            {page.colors.map((c) => (
              parts.swatch === 'logo' ? (
                <figure key={c.bg} style={{ color: c.dark ? '#10131A' : '#FFFFFF' }}>
                  <div className="cs-logo-swatch" style={{ background: c.bg, maskImage: `url(${c.logos[0].src})`, WebkitMaskImage: `url(${c.logos[0].src})` }} />
                  <figcaption>
                    <p className="cs-swatch-name">{c.name}</p>
                    <p className="cs-swatch-hex">{c.bg.toUpperCase()}</p>
                  {cmykOf(c) && <p className="cs-swatch-cmyk">{cmykOf(c)}</p>}
                  </figcaption>
                </figure>
              ) : (
                <div key={c.bg} style={{ background: c.bg, color: c.dark ? '#10131A' : '#FFFFFF', boxShadow: c.bordered ? 'inset 0 0 0 1px rgb(16 19 26 / 0.2)' : undefined }}>
                  <p className="cs-swatch-name">{c.name}</p>
                  <p className="cs-swatch-hex">{c.bg.toUpperCase()}</p>
                  {cmykOf(c) && <p className="cs-swatch-cmyk">{cmykOf(c)}</p>}
                </div>
              )
            ))}
          </Rise>
        </div>
        <div className="cs-block" key={slug}>
          <h3 className="cs-label">{t.tipografia}</h3>
          <div className={specimens.length > 1 ? 'cs-specimen-pair' : undefined}>
            {specimens.map((ty, i) => <Specimen key={ty.title} ty={ty} stylesLabel={L.styles} role={specimens.length > 1 ? (i === 0 ? L.primary : L.secondary) : undefined} />)}
          </div>
          {page.typeGuide && (
            <div className="cs-type-guide">
              {page.typeGuide.rows.map((r) => (
                <div key={r.use} className="cs-type-row">
                  <p className="cs-type-use">{r.use}</p>
                  <p className="cs-type-sample" style={r.face}>{r.sample}</p>
                  <p className="cs-type-meta"><strong>{r.font}</strong> · {r.detail}</p>
                </div>
              ))}
              <p className="cs-type-why">{page.typeGuide.why}</p>
            </div>
          )}
        </div>
        {parts.patterns && (
          <div className="cs-block">
            <h3 className="cs-label">{L.pattern}</h3>
            <ShowcaseGrid blocks={parts.patterns} />
          </div>
        )}
      </div>
    </section>
  )
}
