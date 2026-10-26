/*
 * English mirror of content.js. Only descriptive/narrative text is translated;
 * factual data (dates, links, percentages, names, handles) stays identical.
 */
import { BookOpen, Clapperboard, Dumbbell, Laptop } from 'lucide-react'
import { img, site as siteEs } from './content'

export { img }

export const site = {
  ...siteEs,
  copyright: '© 2026 Lara Marco Simó. All rights reserved.',
}

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/curriculum', label: 'CV' },
  { to: '/proyectos', label: 'Projects' },
  { to: '/contacto', label: 'Contact' },
]

export const about = {
  kicker: 'BEHIND THE DESIGN',
  title: 'About Me',
  motto: 'Learn, grow and evolve.',
  lead: 'Advertiser and designer in constant evolution.',
  text: 'I believe in strategy born from sincerity and in design that tells real stories.',
  bio: 'Graphic designer and advertiser in training (double degree at Universidad Europea). I have worked at an agency producing graphic pieces for campaigns, and I edit audiovisual content. My projects combine visual identity, typography and colour with a clear communication strategy.',
  gallery: [1, 2, 3, 4].map((n) => ({ src: img(`about/gift${n}`), alt: `Design ${n}` })),
}

// ---------- Resume ----------
export const cv = {
  subtitle: 'Double degree in digital graphic design and advertising',
  personal: [
    { label: 'Location', value: 'Santa Cruz de Tenerife' },
    { label: 'Licence', value: 'B' },
  ],
  education: [
    { title: 'Double degree in digital graphic design and advertising', date: '2022 - Present', role: 'Universidad Europea | Santa Cruz de Tenerife' },
    { title: '1st year of Interactive Technologies degree', date: '2022', role: 'UPV | Valencia' },
  ],
  experience: [
    {
      title: 'Ageless Medicina Estética',
      href: 'https://www.instagram.com/ageless.medicinaestetica?igsh=MXEzYXduYnBnYjVzcQ%3D%3D&utm_source=qr',
      date: '2026',
      role: 'Social Media Management',
      desc: 'Social media management and strategy for an aesthetic medicine clinic.',
    },
    {
      title: 'Arco Comunicación',
      href: 'https://arcocomunicacion.com/',
      date: '2025',
      role: 'Professional Internship | Advertising Agency',
      desc: 'Development of graphic pieces and support executing creative advertising campaigns.',
    },
    {
      title: 'Podcast editing',
      href: 'https://www.youtube.com/@DesdeMiExperienciaPodcast?app=desktop',
      date: '2024',
      role: 'Desde Mi Experiencia | Santa Cruz de Tenerife',
      desc: 'Collaborative project ensuring high-quality audio production and professional editing.',
    },
  ],
  interests: [
    { icon: Clapperboard, label: 'Editing' },
    { icon: BookOpen, label: 'Reading' },
    { icon: Dumbbell, label: 'Sports' },
    { icon: Laptop, label: 'Online Courses' },
  ],
  strategic: [
    { name: 'Planning & Workflows', value: 85, desc: 'Optimising timelines and organising projects.' },
    { name: 'Visual Conceptualisation', value: 75, desc: 'Turning ideas into purposeful visual systems.' },
    { name: 'Media Adaptability', value: 70, desc: 'Versatility between static design and video formats.' },
  ],
}

// Skills (skill card texts)
export const skills = [
  { tool: 'photoshop', label: 'Photoshop', text: 'Digital retouching and composition of visual pieces with narrative.' },
  { tool: 'illustrator', label: 'Illustrator', text: 'Visual identity design, logos and scalable vector systems.' },
  {
    tool: 'indesign',
    label: 'InDesign',
    text: 'Basic knowledge creating documents, dossiers and page layout, with a focus on order and visual clarity.',
  },
  { tool: 'after-effects', label: 'After Effects', text: 'Motion graphics and element animation to bring static design to life.' },
  { tool: 'premiere', label: 'Premiere', text: 'Rhythmic editing and audiovisual storytelling for content.' },
  { tool: 'ia', label: 'AI', text: 'Used for mockup creation and technical efficiency, without replacing the original creative process.' },
]

export const toolLabels = {
  illustrator: 'Illustrator',
  photoshop: 'Photoshop',
  indesign: 'InDesign',
  'after-effects': 'After Effects',
  premiere: 'Premiere',
  ia: 'AI',
}

// ---------- Contact ----------
export const contactItems = [
  { kind: 'mail', label: site.email, href: `mailto:${site.email}` },
  { kind: 'phone', label: site.phoneIntl, href: site.whatsapp },
  { kind: 'linkedin', label: 'LinkedIn', href: site.linkedin },
  { kind: 'instagram', label: site.instagramHandle, href: site.instagram },
]

// ---------- Projects (list and carousel cards) ----------
export const projects = [
  { slug: 'marca-personal', number: '01', name: 'Personal Brand', cover: img('marca-personal/portada'), hero: img('marca-personal/libretas'), heroAlt: 'Personal brand notebooks in navy, lilac and sky blue', concept: 'A monogram interweaving the initials L, M and S.' },
  { slug: 'identidad-visual', number: '02', name: 'Visual Identity', cover: img('identidad-visual/portada'), hero: img('identidad-visual/tarjeta'), heroAlt: 'Business cards with the JMG monogram', concept: "A minimalist monogram for an engineer's personal brand." },
  { slug: 'casa-ricardo', number: '03', name: 'Casa Ricardo', cover: img('casa-ricardo/portada'), hero: img('casa-ricardo/packaging-delante'), heroAlt: 'Casa Ricardo nut packaging', concept: 'Redesigning the identity of a sweets and nuts shop.' },
  { slug: 'proyecto-video', number: '04', name: 'Video Project', cover: img('video/portada'), hero: img('video/portada'), heroAlt: 'Cover of the SloMo × Lola Índigo music video', concept: "A music video pairing Chanel's ‘SloMo’ with Lola Índigo's dance." },
]

const categories = {
  'marca-personal': 'Visual identity',
  'identidad-visual': 'Monogram and website',
  'casa-ricardo': 'Visual identity redesign',
  'proyecto-video': 'Music video',
}
// Grupo de la página de Proyectos: las identidades juntas, el vídeo aparte
export const projectGroups = [
  { id: 'identidad', label: 'Visual identity', slugs: ['marca-personal', 'identidad-visual', 'casa-ricardo'] },
  { id: 'audiovisual', label: 'Audiovisual', slugs: ['proyecto-video'] },
]
export const featuredProjects = projects.map((p) => ({ ...p, category: categories[p.slug] }))
