import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import NoMatch from './components/NoMatch';
import Footer from './components/Footer';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './utils/theme';
import TermsAndConditions from './Pages/TermsAndConditions';
import { HelmetProvider } from 'react-helmet-async';
import SEOHelmet from './components/SEOHelmet';



// Lazy loading de componentes
const Home = lazy(() => import('./Pages/Home'));
const ProductPage = lazy(() => import('./Pages/ProductPage'));
const GalleryPage = lazy(() => import('./Pages/GalleryPage'));
const Faqs = lazy(() => import('./Pages/Faqs'));
const Cart = lazy(() => import('./Pages/Cart'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const VerifyEmail = lazy(() => import('./Pages/VerifyEmail'));
const RecoverAccount = lazy(() => import('./Pages/RecoverAccount'));
const Profile = lazy(() => import('./Pages/Profile'));


function App() {
  
  const theme = useSelector(state => state.user?.theme);
  const token = useSelector(state => state.user?.token)

  return (
    <HelmetProvider>
      <SEOHelmet 
        title="Mi Aplicación Web"
        description="Descripción principal de mi aplicación"
      />
      <ThemeProvider theme={ theme === 'lightTheme' ? lightTheme : darkTheme }>
        <CssBaseline />
        <Header />
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/productos' element={<ProductPage />} />
            <Route path='/galeria' element={<GalleryPage />} />
            <Route path='/preguntas-frecuentes' element={<Faqs />} />
            <Route path='/carrito' element={<Cart />} />
            
            <Route path='/finalizar-compra' element={<Checkout />} />
            <Route path='/terms' element={<TermsAndConditions/>} />
            <Route path='/profile' element={token ? <Profile /> : <Home />} />          
            <Route path='/verify/:verificationToken' element={<VerifyEmail />} />
            <Route path='/recover_account/:verificationToken' element={<RecoverAccount />} />
            <Route path='*' element={<NoMatch />} />
          </Routes>
        </Suspense>
        <Footer />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
