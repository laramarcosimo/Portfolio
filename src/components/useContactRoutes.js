import { GmailIcon, InstagramIcon, LinkedInIcon } from './BrandIcons'
import WhatsAppIcon from './WhatsAppIcon'
import { useContent } from '../data/useContent'
import { useUi } from '../i18n/ui'

/** Las vías de contacto: las mismas en la página de Contacto y en el pie. */
export function useContactRoutes() {
  const { site, contactItems } = useContent()
  const t = useUi()
  const by = Object.fromEntries(contactItems.map((c) => [c.kind, c]))
  return [
    { key: 'mail', Icon: GmailIcon, name: t.correo, detail: site.email.replace('@', '​@'), href: by.mail.href, external: false },
    { key: 'wa', Icon: WhatsAppIcon, name: 'WhatsApp', detail: by.phone.label, href: by.phone.href, external: true },
    { key: 'li', Icon: LinkedInIcon, name: 'LinkedIn', detail: site.name, href: by.linkedin.href, external: true },
    { key: 'ig', Icon: InstagramIcon, name: 'Instagram', detail: site.instagramHandle, href: by.instagram.href, external: true },
  ]
}
