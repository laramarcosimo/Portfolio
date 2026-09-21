import './styles/global.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Curriculum from './pages/Curriculum'
import Projects from './pages/Projects'
import ProjectPage from './pages/ProjectPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="proyectos/:slug" element={<ProjectPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
