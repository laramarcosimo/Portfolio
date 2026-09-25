/*
 * Contenido de la web. Todos los textos proceden de https://laramarcosimoportafolio.netlify.app/
 * y se conservan tal cual (no reescribir).
 */
import { BookOpen, Clapperboard, Dumbbell, Laptop } from 'lucide-react'

// Todas las imágenes procesadas viven en src/assets (importadas desde la carpeta original).
const files = import.meta.glob('../assets/**/*.webp', { eager: true, query: '?url', import: 'default' })
export const img = (name) => files[`../assets/${name}.webp`]

export const site = {
  name: 'Lara Marco Simó',
  email: 'laramarcosimo@gmail.com',
  phone: '608 350 840',
  phoneIntl: '+34 608 350 840',
  whatsapp: 'https://wa.me/34608350840',
  city: 'Santa Cruz de Tenerife',
  linkedin: 'https://www.linkedin.com/in/lara-marco-simó-7317372aa',
  instagram: 'https://www.instagram.com/laramarcosimo_?igsh=NXdwN2g5ZWd6b2pq&utm_source=qr',
  instagramHandle: '@laramarcosimo_',
  copyright: '© 2026 Lara Marco Simó. Todos los derechos reservados.',
}

// Menú de la web original: Currículum, Proyectos y Contacto (el logotipo lleva al inicio).
export const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/curriculum', label: 'Currículum' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
]

export const about = {
  kicker: 'DETRÁS DEL DISEÑO',
  title: 'Sobre Mí',
  motto: 'Aprender, crecer y evolucionar.',
  lead: 'Publicista y diseñadora en constante evolución.',
  text: 'Creo en la estrategia que nace de la sinceridad y en el diseño que cuenta historias reales.',
  bio: 'Con experiencia en edición y una profunda pasión por la creatividad, estoy entusiasmada por aportar mis habilidades y mi visión innovadora al equipo. Actualmente, curso el doble grado en diseño gráfico digital y publicidad, donde desarrollo proyectos que fusionan la estética visual con estrategias de comunicación efectivas.',
  gallery: [1, 2, 3, 4].map((n) => ({ src: img(`about/gift${n}`), alt: `Diseño ${n}` })),
}

// ---------- Currículum ----------
export const cv = {
  subtitle: 'Doble grado en diseño gráfico digital y publicidad',
  personal: [
    { label: 'Nacimiento', value: '05/05/2003' },
    { label: 'Nacionalidad', value: 'Española' },
    { label: 'Carnet', value: 'Tipo B1' },
  ],
  education: [
    { title: 'Doble grado en diseño gráfico digital y publicidad', date: '2022 - Hoy', role: 'Universidad Europea | Santa Cruz de Tenerife' },
    { title: 'Prácticas en Arco Comunicación', date: '2024', role: 'Agencia de Publicidad | Santa Cruz de Tenerife' },
    { title: '1º Curso del grado en Tecnologías Interactivas', date: '2022', role: 'UPV | Valencia' },
    { title: 'Título de Bachillerato', date: '2021', role: 'La Salle San Ildefonso | Santa Cruz de Tenerife' },
    { title: 'Título de Educación Secundaria Obligatoria', date: '2019', role: 'Colegio Adonai | Santa Cruz de Tenerife' },
  ],
  experience: [
    {
      title: 'Ageless Medicina Estética',
      href: 'https://www.instagram.com/ageless.medicinaestetica?igsh=MXEzYXduYnBnYjVzcQ%3D%3D&utm_source=qr',
      date: '2026',
      role: 'Gestión de Redes Sociales',
      desc: 'Gestión y estrategia de redes sociales para clínica de medicina estética.',
    },
    {
      title: 'Arco Comunicación',
      href: 'https://arcocomunicacion.com/',
      date: '2025',
      role: 'Prácticas Profesionales | Agencia de Publicidad',
      desc: 'Desarrollo de piezas gráficas y apoyo en la ejecución de campañas publicitarias creativas.',
    },
    {
      title: 'Edición de podcast',
      href: 'https://www.youtube.com/@DesdeMiExperienciaPodcast?app=desktop',
      date: '2024',
      role: 'Desde Mi Experiencia | Santa Cruz de Tenerife',
      desc: 'Proyecto colaborativo asegurando una producción de audio de alta calidad y edición profesional.',
    },
  ],
  interests: [
    { icon: Clapperboard, label: 'Editar' },
    { icon: BookOpen, label: 'Leer' },
    { icon: Dumbbell, label: 'Hacer deporte' },
    { icon: Laptop, label: 'Cursos Online' },
  ],
  strategic: [
    { name: 'Planificación y Flujos de Trabajo', value: 85, desc: 'Optimización de tiempos y organización de proyectos.' },
    { name: 'Conceptualización Visual', value: 75, desc: 'Transformo ideas en sistemas visuales con propósito.' },
    { name: 'Adaptabilidad de Medios', value: 70, desc: 'Versatilidad entre diseño estático y formatos de vídeo.' },
  ],
}

// Habilidades (textos de las tarjetas de la web original)
export const skills = [
  { tool: 'photoshop', label: 'Photoshop', text: 'Retoque digital y composición de piezas visuales con narrativa.' },
  { tool: 'illustrator', label: 'Illustrator', text: 'Diseño de identidad visual, logotipos y sistemas vectoriales escalables.' },
  {
    tool: 'indesign',
    label: 'InDesign',
    text: 'Conocimientos básicos en la creación de documentos, dossiers y maquetación de páginas, con enfoque en el orden y la claridad visual.',
  },
  { tool: 'after-effects', label: 'After Effects', text: 'Motion Graphics y animación de elementos para dar vida al diseño estático.' },
  { tool: 'premiere', label: 'Premiere', text: 'Montaje rítmico y narrativa audiovisual para contenidos.' },
  { tool: 'ia', label: 'IA', text: 'Integrada para creación de mockups y eficiencia técnica, sin sustituir el proceso creativo original.' },
]

export const toolLabels = {
  illustrator: 'Illustrator',
  photoshop: 'Photoshop',
  indesign: 'InDesign',
  'after-effects': 'After Effects',
  premiere: 'Premiere',
  ia: 'IA',
}

// ---------- Contacto ----------
export const contactItems = [
  { kind: 'mail', label: site.email, href: `mailto:${site.email}` },
  { kind: 'phone', label: site.phoneIntl, href: site.whatsapp },
  { kind: 'linkedin', label: 'LinkedIn', href: site.linkedin },
  { kind: 'instagram', label: site.instagramHandle, href: site.instagram },
]

// ---------- Proyectos (listado y tarjetas del carrusel) ----------
export const projects = [
  { slug: 'marca-personal', number: '01', name: 'MARCA PERSONAL', cover: img('marca-personal/portada') },
  { slug: 'identidad-visual', number: '02', name: 'Identidad Visual', cover: img('identidad-visual/portada') },
  { slug: 'casa-ricardo', number: '03', name: 'CASA RICARDO', cover: img('casa-ricardo/portada') },
  { slug: 'proyecto-video', number: '04', name: 'PROYECTO DE VIDEO', cover: img('video/portada') },
]

// Proyectos de la portada (scroll horizontal): la portada real de cada proyecto.
// La categoría se deduce del texto de cada página de proyecto (identidad visual, monograma, rediseño, videoclip).
const categories = {
  'marca-personal': 'Identidad visual',
  'identidad-visual': 'Monograma y web',
  'casa-ricardo': 'Rediseño de identidad visual',
  'proyecto-video': 'Videoclip',
}
export const featuredProjects = projects.map((p) => ({ ...p, category: categories[p.slug] }))
