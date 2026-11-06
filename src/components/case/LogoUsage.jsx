/** Versiones del logo y su espacio de protección: lo que convierte un logo en un sistema que otros pueden usar. */
export default function LogoUsage({ usage, label, L }) {
  return (
    <>
      <div className="cs-block">
        <h3 className="cs-label">{L.versiones}</h3>
        <div className="cs-versions">
          {usage.versions.map((v, i) => (
            <figure key={i}>
              <div className={`cs-version${v.bg === '#FFFFFF' ? ' cs-version--light' : ''}`} style={{ background: v.bg }}>
                {v.ink ? (
                  <span className="cs-version-ink" style={{ background: v.ink, maskImage: `url(${v.src})`, WebkitMaskImage: `url(${v.src})` }} role="img" aria-label={`${label} · ${L.tinta}`} />
                ) : (
                  <img src={v.src} alt={`${label} · ${L[v.kind]}`} loading="lazy" />
                )}
              </div>
              <figcaption>{L[v.kind]}{v.kind === 'color' ? ` · ${v.bg}` : ''}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="cs-block">
        <h3 className="cs-label">{L.proteccion}</h3>
        <div className="cs-clear">
          <div className="cs-clear-box">
            <img src={usage.main} alt={`${label} · ${L.proteccion}`} loading="lazy" />
            <span className="cs-x cs-x--t">x</span><span className="cs-x cs-x--r">x</span><span className="cs-x cs-x--b">x</span><span className="cs-x cs-x--l">x</span>
          </div>
        </div>
        <p className="cs-clear-rule">{L.regla}</p>
      </div>
    </>
  )
}
