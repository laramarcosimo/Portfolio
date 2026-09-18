import { Palette, Code2, PenTool, Megaphone } from 'lucide-react'

export const site = {
  name: 'Lara Marcos Simó',
  monogram: 'LM',
  email: 'hola@laramarcos.com',
}

export const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'portafolio', label: 'Portafolio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'contacto', label: 'Contacto' },
]

export const projects = [
  { title: 'Slomo', category: 'Branding · Web', year: '2025', colors: ['#192a56', '#96c9ff'], layout: 'browser' },
  { title: 'Casa Ricardo', category: 'Identidad visual', year: '2025', colors: ['#9690e4', '#f8fafc'], layout: 'poster' },
  { title: 'Marca personal', category: 'Estrategia · Diseño', year: '2024', colors: ['#96c9ff', '#192a56'], layout: 'phone' },
  { title: 'Atlas Studio', category: 'Web · Desarrollo', year: '2024', colors: ['#192a56', '#9690e4'], layout: 'browser' },
  { title: 'Nube Café', category: 'Packaging', year: '2023', colors: ['#96c9ff', '#9690e4'], layout: 'poster' },
]

export const services = [
  { icon: Palette, title: 'Identidad visual', text: 'Logotipos y sistemas de marca coherentes, sencillos y memorables.', tone: 'sky' },
  { icon: Code2, title: 'Desarrollo web', text: 'Sitios rápidos, accesibles y responsive con React y tecnologías modernas.', tone: 'lilac' },
  { icon: PenTool, title: 'Diseño UI/UX', text: 'Interfaces claras pensadas desde la experiencia de las personas usuarias.', tone: 'sky' },
  { icon: Megaphone, title: 'Marca personal', text: 'Estrategia y contenido para comunicar quién eres con criterio propio.', tone: 'lilac' },
]

export const about = {
  title: 'Diseño con calma, código con precisión',
  paragraphs: [
    'Soy Lara, diseñadora y desarrolladora front-end. Creo que lo esencial comunica más que lo excesivo: cada línea, cada espacio y cada movimiento tiene un porqué.',
    'Trabajo con marcas y personas que buscan una presencia digital cuidada, funcional y con personalidad.',
  ],
}