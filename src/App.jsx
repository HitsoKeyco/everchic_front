import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion';

import Home from './Pages/Home'
import Header from './components/Header'
import Tracking from './Pages/Tracking'
import Products from './Pages/Products'
import NoMatch from './components/NoMatch'
import Footer from './components/Footer'
import Galery from './Pages/Galery'
import Faqs from './Pages/Faqs'
import VerifyEmail from './Pages/VerifyEmail';
import Purchases from './Pages/Purchases';

function App() {
  const location = useLocation(); // Usa useLocation para obtener la ubicación actual

  return (
    <>
      <Header />
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/tracking' element={<Tracking />} />
        <Route path='/products' element={<Products />} />
        <Route path='/galery' element={<Galery />} />
        <Route path='/purchases' element={<Purchases />} />
        <Route path='/faqs' element={<Faqs />} />
        <Route path='/verify/:verificationToken' element={<VerifyEmail />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
