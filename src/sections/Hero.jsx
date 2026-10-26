import { Link } from 'react-router-dom'
import { useUi } from '../i18n/ui'

/** Primera pantalla: la declaración de Lara, quién es y un enlace discreto de contacto. */
export default function Hero() {
  const t = useUi()
  return (
    <section id="inicio" className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-20">
      <h1 className="headline max-w-[16ch] text-[2.6rem] text-ink sm:text-7xl lg:text-[5.5rem]">
        {t.statementPre}
        <span className="text-lilac-ink">{t.statementMark}</span>
        {t.statementPost}
      </h1>
      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-baseline sm:gap-10">
        <p className="text-[15px] font-medium text-ink/75 sm:text-base">{t.firma}</p>
        <Link
          to="/contacto"
          className="self-start text-[15px] font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] transition-colors hover:text-lilac-ink sm:text-base"
        >
          {t.escribeme} →
        </Link>
      </div>
    </section>
  )
}
