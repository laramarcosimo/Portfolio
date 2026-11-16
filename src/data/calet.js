/*
 * Caso de estudio de Calet (marca ficticia para una tienda de plantas). Textos de Lara, en primera persona.
 * Tiene su propia página (CaletPage) porque su estructura es distinta a la plantilla común.
 */
import { img } from './content'
import logoVerde from '../assets/calet/logo-verde.svg'
import logoCrema from '../assets/calet/logo-crema.svg'
import logoVerticalVerde from '../assets/calet/logo-vertical-verde.svg'
import bocetoDigital from '../assets/calet/boceto-digital.svg'
import bocetoHuecos from '../assets/calet/boceto-huecos.svg'

export const CALET = { verde: '#224826', crema: '#FAEFCA', arena: '#D0A688', marron: '#461200' }

const shot = (path, w, h, caption) => ({ src: img(`calet/${path}`), w, h, caption })

const common = {
  logos: { verde: logoVerde, crema: logoCrema, vertical: logoVerticalVerde },
  hero: shot('fachada', 1800, 808),
  details: [35.5, 70.5, 93], // posición de cada detalle sobre el ancho del logo (%)
  manual: 'manual/Calet-Manual-de-marca.pdf',
  manualPages: 41,
  logoFinal: logoVerde,
}

const chars = ['Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll', 'Mm', 'Nn', 'Ññ', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx', 'Yy', 'Zz']
const fredoka = (L) => ({ title: 'Fredoka', chars, extra: '1234567890!¿?@#%&', weights: [
  { label: 'Bold', weight: 700, family: "'Fredoka'" }, { label: 'SemiBold', weight: 600, family: "'Fredoka'" }, { label: 'Medium', weight: 500, family: "'Fredoka'" },
  { label: 'Regular', weight: 400, family: "'Fredoka'" }, { label: 'Light', weight: 300, family: "'Fredoka'" },
] })
const abeezee = { title: 'ABeeZee', chars, extra: '1234567890!¿?@#%&', weights: [
  { label: 'Regular', weight: 400, family: "'ABeeZee'" }, { label: 'Italic', weight: 400, style: 'italic', family: "'ABeeZee'" },
] }
const bocetos = (t) => [
  { src: img('calet/boceto-01'), kind: 'sketch', label: t[0][0], text: t[0][1] },
  { src: img('calet/boceto-02'), kind: 'sketch', label: t[1][0], text: t[1][1] },
  { src: bocetoDigital, label: t[2][0], text: t[2][1] },
  { src: bocetoHuecos, label: t[3][0], text: t[3][1] },
  { src: logoVerde, label: t[4][0], text: t[4][1] },
]

const es = {
  ...common,
  title: 'Calet',
  line: 'Identidad de marca para una tienda de plantas',
  label: 'Proyecto académico · marca ficticia',
  tags: ['Identidad visual', 'Packaging', 'Web', 'Redes'],
  year: '2026',
  facts: [
    ['Mi rol', 'Diseño de identidad completa'],
    ['Herramientas', 'Illustrator, Photoshop, IA'],
    ['Tipo', 'Proyecto académico'],
    ['Año', '2026'],
  ],
  summary: 'Calet es la marca de una tienda de plantas donde comprar una planta no acaba en la caja: el cuidado viene incluido. Marta, la clienta imaginaria, vende plantas fáciles de cuidar en Ruzafa (Valencia) y acompaña a sus clientes por WhatsApp.',
  sections: {
    reto: 'El reto',
    concepto: 'El concepto',
    proceso: 'Del boceto al logo',
    logo: 'Logotipo y versiones',
    color: 'Color',
    tipo: 'Tipografía',
    sistema: 'Sistema gráfico',
    tono: 'Tono de voz',
    apps: 'Aplicaciones',
    manual: 'Manual de marca',
  },
  reto: [
    'Las tiendas de plantas suelen irse a dos extremos: el catálogo frío o la estética «monísima».',
    'Calet tenía que transmitir que detrás hay alguien que sabe y que contesta cuando dudas. Cercana y de confianza, moderna pero con toque artesano, sin caer en lo frío, lo pretencioso, lo cursi ni lo infantil.',
  ],
  concepto: {
    quote: 'Plantas fáciles de cuidar y alguien a quien escribir cuando dudas.',
    text: 'De esa frase sale el descriptor, «plantas y cuidados». El logotipo es un lettering propio de trazo grueso y terminales redondeados, con tres detalles tomados de la hoja de monstera.',
    details: [
      ['La a', 'Un hueco inclinado en su interior.'],
      ['La e', 'El ojo se abre hacia el borde, como la hendidura de una hoja.'],
      ['La t', 'La barra se convierte en una hoja con su propio hueco.'],
    ],
  },
  versions: ['Positivo', 'Negativo', 'Vertical', 'Avatar'],
  avatarNote: 'En redes, el logo completo dentro de un círculo.',
  proteccion: 'Área de protección: alrededor del logo queda libre la mitad de la altura de la «a».',
  colors: [
    { name: 'Verde bosque', role: 'Principal · logo, titulares y bloques', hex: '#224826', rgb: '34, 72, 38', share: 45 },
    { name: 'Crema', role: 'Fondos', hex: '#FAEFCA', rgb: '250, 239, 202', share: 40 },
    { name: 'Arena', role: 'Acentos y detalles', hex: '#D0A688', rgb: '208, 166, 136', share: 12 },
    { name: 'Marrón', role: 'Solo contornos e ilustraciones', hex: '#461200', rgb: '70, 18, 0', share: 3 },
  ],
  marron: 'Proporciones orientativas: cuando dudes, deja más crema.',
  bocetos: bocetos([
    ['Boceto', 'Primera idea a mano: un símbolo de hojas junto al nombre.'],
    ['Boceto', 'Variante del símbolo: media flor.'],
    ['Digital', 'El lettering pasa a digital, todavía sin detalles.'],
    ['Exploración', 'Primeros huecos en las letras, aún sin forma de hoja.'],
    ['Final', 'Solo el nombre, con los tres detalles de la monstera.'],
  ]),
  tipo: {
    primary: 'Principal', secondary: 'Secundaria', styles: 'Estilos de',
    pair: [fredoka(), abeezee],
    why: 'Fredoka repite los terminales redondeados del logo; ABeeZee se lee bien en pequeño, en fichas y mensajes.',
    hierarchy: [
      { label: 'Titular · Fredoka', text: 'Tu primera planta', cls: 'h1' },
      { label: 'Subtítulo · Fredoka', text: 'Te acompaño por WhatsApp', cls: 'h2' },
      { label: 'Texto · ABeeZee', text: 'Cuéntame cómo la ves y te digo qué hacer con cada hoja.', cls: 'p' },
      { label: 'Pie · ABeeZee', text: 'Ruzafa · Valencia', cls: 'small' },
    ],
  },
  sistema: [
    { key: 'patron', title: 'Patrón', text: 'Hojas de monstera en verde y arena sobre crema, para bolsas, papel y fondos.' },
    { key: 'ilustracion', title: 'Ilustración', text: 'Una maceta con monstera en tres versiones. El fondo nunca repite un color de la planta: crema sobre blanco, terracota sobre crema y hojas crema sobre arena.' },
    { key: 'iconos', title: 'Iconos', text: 'Trazo lineal y terminales redondeados, para las fichas de cuidado.' },
  ],
  tono: {
    words: ['Cercana', 'Natural', 'De confianza', 'Moderna', 'Artesana'],
    good: 'Tu monstera está contenta: riégala el sábado y cuéntame cómo la ves.',
    bad: '¡Holiii! Tu plantita necesita agüita',
    goodLabel: 'Así sí',
    badLabel: 'Así no',
  },
  apps: [
    { type: 'full', items: [shot('web', 1800, 1005, 'Web: tienda online y cuidados por WhatsApp, en ordenador y móvil.')] },
    { type: 'row', items: [shot('tote-crema', 1600, 1927, 'Tote bag crema: maceta terracota y logo verde.'), shot('instagram', 1792, 2400, 'Instagram: avatar, posts de cuidados y novedades.'), shot('tote-verde', 1600, 1986, 'Tote bag verde: la planta dentro de un círculo arena.')] },
    { type: 'row', items: [shot('tarjeta', 1800, 1005, 'Tarjeta de visita en kraft, con el patrón en el reverso.'), shot('cartel', 1800, 1005, 'Cartel de planta pinchado en la maceta.')] },
    { type: 'row', items: [shot('bolsa-01', 1800, 1344, 'Bolsa de papel kraft con el patrón de hojas.'), shot('caja', 1393, 768, 'Caja de envío con la planta y su ficha de cuidados.')] },
  ],
  manualText: 'Recoge estrategia, logotipo, color, tipografía, sistema gráfico y aplicaciones.',
  verManual: 'Ver el manual completo',
  descargar: 'Descargar PDF',
  paginas: 'págs.',
  iaNote: 'Mockups generados con IA para presentar el proyecto.',
  alt: { hero: 'Fachada de la tienda Calet', logo: 'Logotipo de Calet', patron: 'Patrón de hojas de monstera', macetaCrema: 'Ilustración de la maceta, versión crema', macetaTerracota: 'Ilustración de la maceta, versión terracota', macetaHojas: 'Ilustración de la maceta con hojas crema', iconos: 'Iconos de riego, luz, hoja, maceta, temperatura, WhatsApp, revisión y poda', avatar: 'Avatar circular de Calet', proteccion: 'Área de protección del logo' },
}

const en = {
  ...common,
  title: 'Calet',
  line: 'Brand identity for a plant shop',
  label: 'Academic project · fictional brand',
  tags: ['Visual identity', 'Packaging', 'Web', 'Social media'],
  year: '2026',
  facts: [
    ['My role', 'Full identity design'],
    ['Tools', 'Illustrator, Photoshop, AI'],
    ['Type', 'Academic project'],
    ['Year', '2026'],
  ],
  summary: 'Calet is the brand of a plant shop where buying a plant doesn’t end at the till: care comes included. Marta, the imaginary client, sells easy-care plants in Ruzafa (Valencia) and supports her customers over WhatsApp.',
  sections: {
    reto: 'The challenge',
    concepto: 'The concept',
    proceso: 'From sketch to logo',
    logo: 'Logo and versions',
    color: 'Colour',
    tipo: 'Typography',
    sistema: 'Graphic system',
    tono: 'Tone of voice',
    apps: 'Applications',
    manual: 'Brand guidelines',
  },
  reto: [
    'Plant shops tend to go to one of two extremes: a cold catalogue or an overly “cute” look.',
    'Calet had to show that there’s someone behind it who knows and who answers when you’re unsure. Warm and trustworthy, modern with a handmade touch, without being cold, pretentious, twee or childish.',
  ],
  concepto: {
    quote: 'Easy-care plants and someone to message when you’re unsure.',
    text: 'That sentence gave the descriptor, “plantas y cuidados” (plants and care). The logo is custom lettering with a bold stroke and rounded terminals, with three details taken from the monstera leaf.',
    details: [
      ['The a', 'A slanted gap inside it.'],
      ['The e', 'Its eye opens towards the edge, like the split in a leaf.'],
      ['The t', 'The crossbar becomes a leaf with its own gap.'],
    ],
  },
  versions: ['Positive', 'Negative', 'Vertical', 'Avatar'],
  avatarNote: 'On social media, the full logo inside a circle.',
  proteccion: 'Clear space: half the height of the “a” stays free around the logo.',
  colors: [
    { name: 'Forest green', role: 'Main · logo, headlines and blocks', hex: '#224826', rgb: '34, 72, 38', share: 45 },
    { name: 'Cream', role: 'Backgrounds', hex: '#FAEFCA', rgb: '250, 239, 202', share: 40 },
    { name: 'Sand', role: 'Accents and details', hex: '#D0A688', rgb: '208, 166, 136', share: 12 },
    { name: 'Brown', role: 'Outlines and illustrations only', hex: '#461200', rgb: '70, 18, 0', share: 3 },
  ],
  marron: 'Guide proportions: when in doubt, leave more cream.',
  bocetos: bocetos([
    ['Sketch', 'First idea by hand: a leaf symbol next to the name.'],
    ['Sketch', 'A variation of the symbol: half a flower.'],
    ['Digital', 'The lettering goes digital, still without details.'],
    ['Exploration', 'First gaps in the letters, not yet leaf-shaped.'],
    ['Final', 'Just the name, with the three monstera details.'],
  ]),
  tipo: {
    primary: 'Primary', secondary: 'Secondary', styles: 'Styles of',
    pair: [fredoka(), abeezee],
    why: 'Fredoka echoes the rounded terminals of the logo; ABeeZee reads well at small sizes, on care cards and in messages.',
    hierarchy: [
      { label: 'Headline · Fredoka', text: 'Your first plant', cls: 'h1' },
      { label: 'Subheading · Fredoka', text: 'I’m with you on WhatsApp', cls: 'h2' },
      { label: 'Text · ABeeZee', text: 'Tell me how it looks and I’ll tell you what to do with each leaf.', cls: 'p' },
      { label: 'Caption · ABeeZee', text: 'Ruzafa · Valencia', cls: 'small' },
    ],
  },
  sistema: [
    { key: 'patron', title: 'Pattern', text: 'Monstera leaves in green and sand on cream, for bags, paper and backgrounds.' },
    { key: 'ilustracion', title: 'Illustration', text: 'A pot with a monstera in three versions. The background never repeats a colour from the plant: cream on white, terracotta on cream and cream leaves on sand.' },
    { key: 'iconos', title: 'Icons', text: 'Line strokes and rounded terminals, for the plant care cards.' },
  ],
  tono: {
    words: ['Warm', 'Natural', 'Trustworthy', 'Modern', 'Handmade'],
    good: '“Tu monstera está contenta: riégala el sábado y cuéntame cómo la ves.” (Your monstera is happy: water it on Saturday and tell me how it looks.)',
    bad: '“¡Holiii! Tu plantita necesita agüita” (Hiiii! Your little plant needs a wittle water)',
    goodLabel: 'Like this',
    badLabel: 'Not like this',
  },
  apps: [
    { type: 'full', items: [shot('web', 1800, 1005, 'Website: online shop and WhatsApp care, on desktop and mobile.')] },
    { type: 'row', items: [shot('tote-crema', 1600, 1927, 'Cream tote bag: terracotta pot and green logo.'), shot('instagram', 1792, 2400, 'Instagram: avatar, care tips and new arrivals.'), shot('tote-verde', 1600, 1986, 'Green tote bag: the plant inside a sand circle.')] },
    { type: 'row', items: [shot('tarjeta', 1800, 1005, 'Kraft business card, with the pattern on the back.'), shot('cartel', 1800, 1005, 'Plant tag stuck in the pot.')] },
    { type: 'row', items: [shot('bolsa-01', 1800, 1344, 'Kraft paper bag with the leaf pattern.'), shot('caja', 1393, 768, 'Shipping box with the plant and its care card.')] },
  ],
  manualText: 'It covers strategy, logo, colour, typography, graphic system and applications.',
  verManual: 'View the full guidelines',
  descargar: 'Download PDF',
  paginas: 'pages, in Spanish',
  iaNote: 'Mockups generated with AI to present the project.',
  alt: { hero: 'Calet shop front', logo: 'Calet logo', patron: 'Monstera leaf pattern', macetaCrema: 'Pot illustration, cream version', macetaTerracota: 'Pot illustration, terracotta version', macetaHojas: 'Pot illustration with cream leaves', iconos: 'Icons for watering, light, leaf, pot, temperature, WhatsApp, check-up and pruning', avatar: 'Calet round avatar', proteccion: 'Logo clear space' },
}

export const caletContent = { es, en }
