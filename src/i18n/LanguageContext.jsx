import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'site-lang'
const LANGS = ['es', 'en']

function getStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(v) ? v : 'es'
  } catch {
    return 'es'
  }
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang)

  const setLang = (next) => {
    if (!LANGS.includes(next)) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* almacenamiento no disponible: el idioma simplemente no persiste */
    }
  }

  const value = useMemo(() => ({ lang, setLang }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}
