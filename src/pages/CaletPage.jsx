import { motion } from 'framer-motion'
import { ArrowLeft, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Specimen } from '../components/case/BrandSystem'
import ProjectNavigation from '../components/case/ProjectNavigation'
import ReadingProgress from '../components/case/ReadingProgress'
import { caletContent } from '../data/calet'
import { img } from '../data/content'
import { useContent } from '../data/useContent'
import { useLanguage } from '../i18n/LanguageContext'
import { useUi } from '../i18n/ui'
import '../styles/calet.css'

// Aparición suave al entrar en pantalla (400 ms); MotionConfig del padre respeta prefers-reduced-motion
const reveal = { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }

function Shot({ s, eager }) {
  return (
    <figure className="calet-shot">
      <img src={s.src} alt={s.caption} width={s.w} height={s.h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {s.caption && <figcaption>{s.caption}</figcaption>}
    </figure>
  )
}

function Section({ title, children, className = '' }) {
  return (
    <motion.section className={`calet-section ${className}`} {...reveal}>
      <div className="calet-wrap">
        {title && <h2 className="calet-h2">{title}</h2>}
        {children}
      </div>
    </motion.section>
  )
}

/** Caso de estudio de Calet: página propia, con la paleta y las tipografías de la marca dentro del contenido. */
export default function CaletPage() {
  const { lang } = useLanguage()
  const c = caletContent[lang] ?? caletContent.es
  const t = useUi()
  const { projects } = useContent()
  const S = c.sections
  const manualHref = c.manual && import.meta.env.BASE_URL + c.manual

  return (
    <main className="cs calet" data-project="calet">
      <ReadingProgress />

      {/* 1 · Hero */}
      <header className="calet-hero">
        <div className="calet-wrap">
          <Link to="/proyectos" className="calet-back"><ArrowLeft size={14} strokeWidth={1.5} /> {t.proyectos}</Link>
          <p className="calet-label">{c.label}</p>
          <h1 className="calet-title">{c.title}</h1>
          <p className="calet-line">{c.line}</p>
          <ul className="calet-tags">
            {c.tags.map((x) => <li key={x}>{x}</li>)}
            <li className="calet-year">{c.year}</li>
          </ul>
        </div>
        <div className="calet-hero-media"><img src={c.hero.src} alt={c.alt.hero} width={c.hero.w} height={c.hero.h} fetchPriority="high" /></div>
      </header>

      {/* 2 · Ficha y resumen */}
      <Section className="calet-intro">
        <dl className="calet-facts">
          {c.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="calet-lead">{c.summary}</p>
      </Section>

      {/* 3 · El reto */}
      <Section title={S.reto}>
        {c.reto.map((p) => <p key={p} className="calet-text">{p}</p>)}
      </Section>

      {/* 4 · Concepto y detalles del logo */}
      <section className="calet-band calet-band--crema">
        <motion.div className="calet-wrap" {...reveal}>
          <h2 className="calet-h2">{S.concepto}</h2>
          <blockquote className="calet-quote">«{c.concepto.quote}»</blockquote>
          <p className="calet-text">{c.concepto.text}</p>
          <div className="calet-logo-detail">
            <img src={c.logos.verde} alt={c.alt.logo} />
            {c.details.map((x, i) => <span key={x} className="calet-pin" style={{ left: `${x}%` }}>{i + 1}</span>)}
          </div>
          <ol className="calet-details">
            {c.concepto.details.map(([h, d], i) => <li key={h}><span className="calet-num">{i + 1}</span><strong>{h}</strong><p>{d}</p></li>)}
          </ol>
        </motion.div>
      </section>

      {/* Proceso: de los bocetos a mano al logo final */}
      <Section title={S.proceso}>
        <ol className="calet-process">
          {c.bocetos.map((b, i) => (
            <li key={b.text} className={i === c.bocetos.length - 1 ? 'is-final' : undefined}>
              <div className="calet-process-card"><img src={b.src} alt={b.text} loading="lazy" className={b.kind === 'sketch' ? 'is-sketch' : undefined} /></div>
              <p className="calet-process-label"><span>{String(i + 1).padStart(2, '0')}</span> {b.label}</p>
              <p className="calet-process-text">{b.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5 · Logotipo y versiones */}
      <Section title={S.logo}>
        <div className="calet-versions">
          <figure className="calet-tile calet-tile--crema"><img src={c.logos.verde} alt="" /><figcaption>{c.versions[0]}</figcaption></figure>
          <figure className="calet-tile calet-tile--verde"><img src={c.logos.crema} alt="" /><figcaption>{c.versions[1]}</figcaption></figure>
          <figure className="calet-tile calet-tile--crema"><img src={c.logos.vertical} alt="" className="calet-vertical" /><figcaption>{c.versions[2]}</figcaption></figure>
          <figure className="calet-tile calet-tile--crema calet-tile--avatar"><img src={img('calet/avatar')} alt={c.alt.avatar} /><figcaption>{c.versions[3]} · {c.avatarNote}</figcaption></figure>
        </div>
        <figure className="calet-figure"><img src={img('calet/proteccion')} alt={c.alt.proteccion} width="1400" height="788" loading="lazy" /><figcaption>{c.proteccion}</figcaption></figure>
      </Section>

      {/* 6 · Color */}
      <Section title={S.color}>
        <div className="calet-colors">
          {c.colors.map((k) => (
            <div key={k.hex} className="calet-color" style={{ '--c': k.hex, flexGrow: k.share }}>
              <div className="calet-chip" data-light={k.hex === '#FAEFCA' || undefined}><span>{k.share} %</span></div>
              <p className="calet-color-name">{k.name}</p>
              <p className="calet-color-role">{k.role}</p>
              <p className="calet-color-code">{k.hex} · RGB {k.rgb}</p>
            </div>
          ))}
        </div>
        <p className="calet-note">{c.marron}</p>
      </Section>

      {/* 7 · Tipografía */}
      <Section title={S.tipo}>
        {/* Igual que en Marca Personal: cada estilo es un botón que cambia el peso de la muestra */}
        <div className="cs-specimen-pair calet-specimens">
          {c.tipo.pair.map((ty, i) => <Specimen key={ty.title} ty={ty} stylesLabel={c.tipo.styles} role={i === 0 ? c.tipo.primary : c.tipo.secondary} />)}
        </div>
        <div className="calet-hierarchy">
          {c.tipo.hierarchy.map((h) => (
            <div key={h.label} className="calet-hier-row">
              <span className="calet-hier-label">{h.label}</span>
              <span className={`calet-hier-${h.cls}`}>{h.text}</span>
            </div>
          ))}
        </div>
        <p className="calet-note">{c.tipo.why}</p>
      </Section>

      {/* 8 · Sistema gráfico */}
      <section className="calet-band calet-band--verde">
        <motion.div className="calet-wrap" {...reveal}>
          <h2 className="calet-h2">{S.sistema}</h2>
          <div className="calet-system">
            <figure className="calet-sys calet-sys--wide"><img src={img('calet/patron')} alt={c.alt.patron} loading="lazy" /><figcaption><strong>{c.sistema[0].title}</strong> {c.sistema[0].text}</figcaption></figure>
            <figure className="calet-sys">
              <div className="calet-pots">
                <img src={img('calet/maceta-crema')} alt={c.alt.macetaCrema} loading="lazy" />
                <img src={img('calet/maceta-terracota')} alt={c.alt.macetaTerracota} loading="lazy" />
                <img src={img('calet/maceta-hojas')} alt={c.alt.macetaHojas} loading="lazy" />
              </div>
              <figcaption><strong>{c.sistema[1].title}</strong> {c.sistema[1].text}</figcaption>
            </figure>
            <figure className="calet-sys"><img src={img('calet/iconos')} alt={c.alt.iconos} loading="lazy" className="calet-icons" /><figcaption><strong>{c.sistema[2].title}</strong> {c.sistema[2].text}</figcaption></figure>
          </div>
        </motion.div>
      </section>

      {/* 9 · Tono de voz */}
      <Section title={S.tono}>
        <ul className="calet-words">{c.tono.words.map((w) => <li key={w}>{w}</li>)}</ul>
        <div className="calet-voice">
          <div className="calet-msg calet-msg--good"><span>{c.tono.goodLabel}</span><p>{c.tono.good}</p></div>
          <div className="calet-msg calet-msg--bad"><span>{c.tono.badLabel}</span><p>{c.tono.bad}</p></div>
        </div>
      </Section>

      {/* 10 · Aplicaciones: sin recortar, cada una con su pie */}
      <Section title={S.apps}>
        <div className="calet-apps">
          {c.apps.map((b, i) => (
            <div key={i} className={`calet-apps-${b.type}`}>
              {/* En cada fila, el ancho de cada pieza es su proporción: misma altura y ninguna recortada */}
              {b.items.map((s) => <div key={s.src} className="calet-apps-cell" style={{ flexGrow: s.w / s.h }}><Shot s={s} /></div>)}
            </div>
          ))}
        </div>
      </Section>

      {/* 11 · Manual de marca: solo los botones; no aparece hasta que esté el PDF */}
      {c.manual && <section className="calet-band calet-band--crema">
        <motion.div className="calet-wrap" {...reveal}>
          <h2 className="calet-h2">{S.manual}</h2>
          <p className="calet-text">{c.manualText}</p>
          <div className="calet-manual-actions">
            <Link to="/proyectos/calet/manual" className="calet-btn">{c.verManual} ({c.manualPages} {c.paginas}) →</Link>
            <a href={manualHref} download className="calet-btn calet-btn--ghost"><Download size={15} strokeWidth={1.75} /> {c.descargar}</a>
          </div>
        </motion.div>
      </section>}

      <div className="calet-wrap"><p className="calet-ia">{c.iaNote}</p></div>

      {/* 13 · Siguiente proyecto: la web recupera su identidad */}
      <section className="cs-cta-band">
        <div className="cs-wrap cs-cta-inner">
          <div>
            <h2 className="cs-cta-title">{t.cierreTitulo}</h2>
            <p className="cs-cta-text">{t.cierreTexto}</p>
          </div>
          <Link to="/contacto" className="cs-cta-btn cs-cta-btn--lilac">{t.cierreBoton} →</Link>
        </div>
      </section>
      <ProjectNavigation slug="calet" projects={projects} t={t} />
    </main>
  )
}
