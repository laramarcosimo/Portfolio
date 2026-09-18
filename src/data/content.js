import { Palette, Code2, PenTool, Megaphone } from 'lucide-react'

export const site = {
  name: 'Lara Marcos Simó',
  monogram: 'LM',
  email: 'hola@laramarcos.com',
}

// Enlaces de la barra de navegación
export const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'portafolio', label: 'Portafolio' },
  { id: 'contacto', label: 'Contacto' },
]

// Todas las secciones (indicadores de paginación y scroll-spy)
export const sectionIds = ['inicio', 'sobre-mi', 'portafolio', 'servicios', 'contacto']

export const projects = [
  { title: 'Slomo', category: 'Branding · Web', year: '2025', colors: ['#7fc8cc', '#e9f6f7'], layout: 'poster' },
  { title: 'Casa Ricardo', category: 'Identidad visual', year: '2025', colors: ['#192a56', '#3b5296'], layout: 'poster' },
  { title: 'Marca personal', category: 'Estrategia · Diseño', year: '2024', colors: ['#c9ccd1', '#f1f2f4'], layout: 'browser' },
  { title: 'Atlas Studio', category: 'Web · Desarrollo', year: '2024', colors: ['#96c9ff', '#d6ebff'], layout: 'browser' },
  { title: 'Nube Café', category: 'Packaging', year: '2023', colors: ['#f2c94c', '#fbe9a6'], layout: 'phone' },
  { title: 'Lumen', category: 'Identidad visual', year: '2023', colors: ['#9690e4', '#dedbf7'], layout: 'poster' },
]

export const services = [
  { icon: Palette, title: 'Identidad visual', text: 'Logotipos y sistemas de marca coherentes, sencillos y memorables.' },
  { icon: Code2, title: 'Desarrollo web', text: 'Sitios rápidos, accesibles y responsive con React y tecnologías modernas.' },
  { icon: PenTool, title: 'Diseño UI/UX', text: 'Interfaces claras pensadas desde la experiencia de las personas usuarias.' },
  { icon: Megaphone, title: 'Marca personal', text: 'Estrategia y contenido para comunicar quién eres con criterio propio.' },
]

export const about = {
  kicker: 'Conoce sobre mí',
  title: 'Sobre Mí',
  paragraphs: [
    'Soy Lara, diseñadora y desarrolladora front-end. Creo que lo esencial comunica más que lo excesivo: cada línea, cada espacio y cada movimiento tiene un porqué.',
    'Trabajo con marcas y personas que buscan una presencia digital cuidada, funcional y con personalidad.',
  ],
}
