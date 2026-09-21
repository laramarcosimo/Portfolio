import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from '../sections/Footer'
import FloatingAction from './FloatingAction'

// Al cambiar de página vuelve arriba (o va al ancla si la URL la trae).
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer phone={pathname === '/contacto' ? 'phoneIntl' : 'phone'} />
      <FloatingAction />
    </>
  )
}
