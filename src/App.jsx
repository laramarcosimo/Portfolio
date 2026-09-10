import './App.css'

const projects = [
  {
    title: 'Proyecto 1',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    link: '#',
  },
  {
    title: 'Proyecto 2',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    link: '#',
  },
  {
    title: 'Proyecto 3',
    description: 'Descripción breve del proyecto y las tecnologías usadas.',
    link: '#',
  },
]

function App() {
  return (
    <>
      <header className="nav">
        <span className="logo">Tu Nombre</span>
        <nav>
          <a href="#about">Sobre mí</a>
          <a href="#projects">Proyectos</a>
          <a href="#contact">Contacto</a>
        </nav>
      </header>

      <main>
        <section id="hero" className="hero">
          <h1>Hola, soy Tu Nombre 👋</h1>
          <p>Desarrollador/a de software. Cuento aquí a qué me dedico.</p>
          <a className="cta" href="#projects">Ver proyectos</a>
        </section>

        <section id="about" className="about">
          <h2>Sobre mí</h2>
          <p>
            Escribí acá una breve presentación: tu experiencia, tecnologías
            con las que trabajás y qué te apasiona del desarrollo.
          </p>
        </section>

        <section id="projects" className="projects">
          <h2>Proyectos</h2>
          <div className="project-grid">
            {projects.map((p) => (
              <a key={p.title} className="project-card" href={p.link}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Contacto</h2>
          <p>
            Escribime a{' '}
            <a href="mailto:tuemail@ejemplo.com">tuemail@ejemplo.com</a> o
            encontrame en{' '}
            <a href="https://github.com/laramarcosimo" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Tu Nombre. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}

export default App
