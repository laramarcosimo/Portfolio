import { PenTool, LayoutTemplate, Clapperboard, Megaphone } from 'lucide-react'
import videoLola from '../assets/video/video-lola.mp4'

// Todas las imágenes procesadas viven en src/assets (importadas desde la carpeta original).
const files = import.meta.glob('../assets/**/*.webp', { eager: true, query: '?url', import: 'default' })
export const img = (name) => files[`../assets/${name}.webp`]

export const site = {
  name: 'Lara Marco Simó',
  email: 'laramarcosimo@gmail.com',
  phone: '+34 608 350 840',
  whatsapp: 'https://wa.me/34608350840',
  city: 'Santa Cruz de Tenerife',
  linkedin: 'https://www.linkedin.com/in/lara-marco-simó-7317372aa',
  instagram: 'https://www.instagram.com/laramarcosimo_?igsh=NXdwN2g5ZWd6b2pq&utm_source=qr',
  instagramHandle: '@laramarcosimo_',
}

export const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'portafolio', label: 'Portafolio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'contacto', label: 'Contacto' },
]

export const sectionIds = navLinks.map((l) => l.id)

export const hero = {
  title: 'Creatividad Minimalista',
  tagline: 'Aprender, crecer y evolucionar.',
}

export const about = {
  kicker: 'Detrás del diseño',
  title: 'Publicista y diseñadora en constante evolución',
  paragraphs: [
    'Con experiencia en edición y una profunda pasión por la creatividad, estoy entusiasmada por aportar mis habilidades y mi visión innovadora al equipo. Actualmente, curso el doble grado en diseño gráfico digital y publicidad, donde desarrollo proyectos que fusionan la estética visual con estrategias de comunicación efectivas.',
    'Creo en la estrategia que nace de la sinceridad y en el diseño que cuenta historias reales.',
  ],
  facts: [
    'Doble grado en diseño gráfico digital y publicidad · Universidad Europea',
    'Prácticas en Arco Comunicación (2025) · Redes sociales en Ageless Medicina Estética (2026)',
  ],
}

export const projects = [
  {
    id: 'marca-personal',
    title: 'Marca Personal',
    category: 'Identidad visual',
    cover: img('marca-personal/portada'),
    description:
      'Mi identidad visual es el punto de encuentro entre quién soy y lo que hago. El logotipo nace de la fusión orgánica de mis iniciales (L, M y S), entrelazadas en un trazo que rinde homenaje a mis dos grandes pasiones: la profundidad de la lectura y la pasión por el diseño. Es un diseño que busca el equilibrio perfecto entre dinamismo y elegancia, donde cada línea fluye para representar una comunicación con propósito, alma y rigor técnico.',
    palette: [
      { name: 'Lavanda Pervinca', hex: '#9690E4' },
      { name: 'Azul Medianoche Profundo', hex: '#192A56' },
      { name: 'Azul Pastel Vibrante', hex: '#96C9FF' },
    ],
    typography: 'Quicksand',
    tools: ['illustrator', 'photoshop', 'after-effects'],
    gallery: ['libretas', 'boligrafos', 'tarjeta', 'carpeta', 'sobre', 'riendo', 'sentada', 'depie'].map((n) => ({
      src: img(`marca-personal/${n}`),
      alt: `Marca Personal — ${n}`,
    })),
  },
  {
    id: 'identidad-visual',
    title: 'Identidad Visual',
    category: 'Monograma · Web',
    cover: img('identidad-visual/portada'),
    description:
      'Esta identidad nace de la integración de las iniciales del ingeniero, diseñadas bajo un concepto de interconectividad. El resultado es un monograma minimalista y estructurado que refleja la capacidad de resolver problemas complejos a través de soluciones limpias, aportando una base visual sólida y profesional a su marca personal.',
    palette: [
      { name: 'Negro', hex: '#000000' },
      { name: 'Caribbean Green', hex: '#00C896' },
      { name: 'Blanco', hex: '#FFFFFF' },
    ],
    typography: 'Fieldwork',
    tools: ['illustrator', 'photoshop', 'after-effects'],
    link: { href: 'https://jaimemartglez.vercel.app', label: 'Ver la web del proyecto' },
    gallery: ['tarjeta', 'boligrafo', 'agenda', 'taza', 'web'].map((n) => ({
      src: img(`identidad-visual/${n}`),
      alt: `Identidad Visual — ${n}`,
    })),
  },
  {
    id: 'casa-ricardo',
    title: 'Casa Ricardo',
    category: 'Rediseño de marca · Packaging',
    cover: img('casa-ricardo/portada'),
    description:
      'Durante mis prácticas trabajé en el rediseño de la identidad visual de Casa Ricardo, una tienda de chuches y frutos secos. El objetivo era modernizar el logotipo sin perder la esencia cercana y tradicional de la marca. Se mejoró la legibilidad, la composición y su adaptación a distintos formatos. El resultado fue una imagen más actual y limpia, manteniendo la personalidad reconocible del negocio.',
    palette: [
      { name: 'Rojo Casa Ricardo', hex: '#DB251E' },
      { name: 'Azul Tradición', hex: '#0032A0' },
      { name: 'Dorado Tostado', hex: '#DDAA55' },
    ],
    typography: 'Ella Roman · Depot New Condensed',
    tools: ['illustrator', 'photoshop'],
    gallery: [
      ['logo', 'Logo nuevo'],
      ['logo-viejo', 'Logo anterior'],
      ['pegatinas', 'Pegatinas'],
      ['packaging-delante', 'Packaging (frontal)'],
      ['packaging-detras', 'Packaging (trasera)'],
      ['bolsas', 'Bolsas'],
      ['tarjeta', 'Tarjeta de visita'],
      ['valla', 'Valla'],
      ['mupi', 'MUPI'],
    ].map(([n, alt]) => ({ src: img(`casa-ricardo/${n}`), alt: `Casa Ricardo — ${alt}` })),
  },
  {
    id: 'proyecto-video',
    title: 'SloMo × Lola Índigo',
    category: 'Proyecto de vídeo',
    cover: img('video/portada'),
    description:
      'Reinterpretación audiovisual nacida de la unión entre la música de Chanel y el universo visual de Lola Índigo para crear un nuevo videoclip.',
    palette: [],
    tools: ['premiere'],
    video: videoLola,
    gallery: [],
  },
]

export const toolLabels = {
  illustrator: 'Illustrator',
  photoshop: 'Photoshop',
  indesign: 'InDesign',
  'after-effects': 'After Effects',
  premiere: 'Premiere',
  ia: 'IA',
}

// Servicios construidos a partir de las habilidades y experiencia reales del CV.
export const services = [
  {
    icon: PenTool,
    title: 'Identidad visual',
    text: 'Diseño de identidad visual, logotipos y sistemas vectoriales escalables.',
    tools: ['illustrator'],
  },
  {
    icon: LayoutTemplate,
    title: 'Diseño gráfico y maquetación',
    text: 'Retoque digital y composición de piezas visuales con narrativa; dossiers y documentos con orden y claridad visual.',
    tools: ['photoshop', 'indesign'],
  },
  {
    icon: Clapperboard,
    title: 'Motion y vídeo',
    text: 'Motion graphics para dar vida al diseño estático, y montaje rítmico con narrativa audiovisual.',
    tools: ['after-effects', 'premiere'],
  },
  {
    icon: Megaphone,
    title: 'Estrategia y redes sociales',
    text: 'Gestión y estrategia de redes sociales, y apoyo en campañas publicitarias creativas.',
    tools: ['ia'],
  },
]

export const contact = {
  title: 'Contacto',
  text: 'Si tienes un proyecto en mente o quieres saber más de mi trabajo, escríbeme.',
}
