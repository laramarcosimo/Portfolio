// Tamaños naturales: reservan el hueco antes de cargar para que nada salte.
const SIZE = {
  libretas: [1200, 900], boligrafos: [1200, 900], tarjetaMarca: [1200, 676], carpeta: [1200, 900], sobre: [1200, 900], patron: [596, 842],
  tarjetaJaime: [1200, 800], agenda: [1200, 900], boligrafo: [1200, 1200], taza: [1200, 576], web: [1400, 940],
  packaging: [1200, 960], pegatinas: [1200, 676], bolsas: [1200, 1066], tarjetaCasa: [1200, 900], valla: [1400, 1050], mupi: [1200, 900],
  logoCasa: [900, 506], logoMarca: [900, 506], poster: [1080, 1350], film: [640, 360], logoViejo: [900, 744], logoJaime: [600, 288],
}

const full = (item) => ({ type: 'full', items: [item] })
// Todas a la misma anchura y sin recortar: la altura la marca cada pieza
const grid = (...items) => ({ type: 'grid', items })
const squares = (a, b) => ({ type: 'squares', items: [a, b] })
const duo = (a, b) => ({ type: 'duo', items: [a, b] })
// Dos versiones del logo enfrentadas: mismos paneles y misma escala
const logos = (a, b) => ({ type: 'logos', items: [a, b] })

/** Qué pieza va en cada bloque. La estructura es común; el ritmo de las aplicaciones es propio de cada proyecto. */
export function composeProject(slug, page, project, t) {
  const name = project?.name ?? page.title
  const shot = (g, size, fill) => ({ g, size, fill })
  const loop = (video, size) => ({ video, size, label: name })
  const mark = (g, bg, size, caption) => ({ g, bg, size, caption }) // `scale` compensa el aire transparente que trae el archivo
  if (slug === 'marca-personal') {
    const s = page.shots
    const v = page.videos
    return {
      band: page.colors[2],
      swatch: 'wave',
      hero: shot(s.libretas, SIZE.libretas),
      logo: [full(loop(v.single, [2000, 1000])), duo({ ...loop(v.pair[0], [1920, 1642]), frame: { scale: 1.6 } }, { ...loop(v.pair[1], [1920, 1646]), frame: { scale: 1 } }), logos(mark(page.colors[0].logos[0], '#FFFFFF', SIZE.logoMarca), mark(page.colors[1].logos[0], page.colors[1].bg, SIZE.logoMarca))],
      logoSize: SIZE.logoMarca,
      patterns: [squares(shot(s.patronAzul, SIZE.patron, s.patronAzul.tile), shot(s.patronBlanco, SIZE.patron, s.patronBlanco.tile))],
      applications: [grid(shot(s.libretas, SIZE.libretas), shot(s.boligrafos, SIZE.boligrafos), shot(s.sobre, SIZE.sobre), shot(s.tarjeta, SIZE.tarjetaMarca)), full(loop(v.wide, [4000, 1000]))],
    }
  }
  if (slug === 'identidad-visual') {
    const s = page.shots
    return {
      band: page.colors[1],
      hero: shot(s.tarjeta, SIZE.tarjetaJaime),
      logo: [duo({ ...loop(page.videos.pair[0], [1080, 964]), frame: { scale: 0.68, bg: '#000000' } }, { ...loop(page.videos.pair[1], [1080, 964]), frame: { scale: 0.68, bg: '#FFFFFF' } }), logos(mark(page.colors[2].logos[0], '#FFFFFF', SIZE.logoJaime), mark(page.colors[0].logos[0], '#000000', SIZE.logoJaime))],
      logoSize: SIZE.logoJaime,
      applications: [
        grid(shot(s.agenda, SIZE.agenda), shot(s.boligrafo, SIZE.boligrafo), shot(s.taza, SIZE.taza), { ...shot(s.web, SIZE.web), href: page.link, caption: `${t.webHechaCon.replace(/:$/, '')} ${page.webTools.join(' · ')}` }),
      ],
    }
  }
  if (slug === 'casa-ricardo') {
    const s = page.shots
    const cmp = page.comparison
    return {
      band: page.colors[2],
      swatch: 'logo',
      hero: shot(s.tarjeta, SIZE.tarjetaCasa),
      logo: [
        logos(mark(cmp.old, '#FFFFFF', SIZE.logoViejo, cmp.before), { ...mark(cmp.new, '#DB251E', SIZE.logoCasa, cmp.after), scale: 1.75 }),
      ],
      logoSize: SIZE.logoCasa,
      applications: [
        grid(shot(s.packagingDelante, SIZE.packaging), shot(s.packagingDetras, SIZE.packaging), shot(s.valla, SIZE.valla), shot(s.mupi, SIZE.mupi)),
        full(shot(page.stickers, SIZE.pegatinas)),
        grid(shot(s.bolsas, SIZE.bolsas), shot(s.tarjeta, SIZE.tarjetaCasa)),
      ],
    }
  }
  // Proyecto de vídeo: no tiene sistema de marca propio, así que esa sección no aparece.
  return {
    hero: null,
    applications: [full({ film: page.video, size: SIZE.film, label: name })],
  }
}
