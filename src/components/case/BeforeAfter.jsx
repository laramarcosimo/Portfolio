import { useState } from 'react'

/** Antes y después del logo a todo el ancho: se arrastra la barra (o se usa el teclado) para descubrir el nuevo. */
export default function BeforeAfter({ cmp, label }) {
  const [x, setX] = useState(50)
  return (
    <section className="cs-section">
      <div className="cs-wrap">
        <div className="cs-ba" style={{ '--x': `${x}%` }}>
          <div className="cs-ba-pane cs-ba-old"><img src={cmp.old.src} alt={cmp.old.alt} /><span>{cmp.before}</span></div>
          <div className="cs-ba-pane cs-ba-new"><img src={cmp.new.src} alt={cmp.new.alt} /><span>{cmp.after}</span></div>
          <div className="cs-ba-bar" aria-hidden="true" />
          <input type="range" min="0" max="100" value={x} onChange={(e) => setX(+e.target.value)} aria-label={label} />
        </div>
        <p className="cs-ba-hint">{label}</p>
      </div>
    </section>
  )
}
