# Portafolio · Lara Marco Simó

React + Vite + Tailwind CSS + Framer Motion. Contenido de https://laramarcosimoportafolio.netlify.app/ (los textos se conservan tal cual).

## Páginas

- `/` — portada: Hero, Sobre Mí, Proyectos (carrusel), Habilidades y Contacto; cada bloque enlaza a su página
- `/curriculum` — sobre mí, educación, experiencia, habilidades, intereses
- `/proyectos` — listado; `/proyectos/:slug` — marca-personal, identidad-visual, casa-ricardo, proyecto-video
- `/contacto`

## Scripts

- `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Estructura

- `src/data/content.js` y `src/data/projectPages.js` — todo el texto y las imágenes/vídeos
- `src/components/RibbonWave.jsx` — cintas de la portada (zigzag con los giros fuera de pantalla)
- `src/lib/ribbonGeometry.js` — geometría compartida de las cintas
- `public/_redirects` — rutas de la SPA en Netlify