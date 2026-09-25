import { useLanguage } from '../i18n/LanguageContext'
import * as contentEs from './content'
import * as contentEn from './content.en'
import { projectPages as projectPagesEs, projectFonts } from './projectPages'
import { projectPages as projectPagesEn } from './projectPages.en'

/** Returns the content bundle (content.js) matching the current language. */
export function useContent() {
  const { lang } = useLanguage()
  return lang === 'en' ? contentEn : contentEs
}

/** Returns the project-pages bundle matching the current language, plus the (language-independent) fonts map. */
export function useProjectPages() {
  const { lang } = useLanguage()
  return { projectPages: lang === 'en' ? projectPagesEn : projectPagesEs, projectFonts }
}
