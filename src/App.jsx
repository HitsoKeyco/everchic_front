import './App.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './components/Header';
import Products from './Pages/Products';
import NoMatch from './components/NoMatch';
import Footer from './components/Footer';
import GalleryPage from './Pages/GalleryPage';
import Faqs from './Pages/Faqs';
import VerifyEmail from './Pages/VerifyEmail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import RecoverAccount from './Pages/RecoverAccount';
import Profile from './Pages/Profile';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './utils/theme';
import { useEffect, useState } from 'react';
import axios from 'axios';
import getConfigAuth from './utils/getConfigAuth';
import useAuth from './hooks/useAuth';



function App() {

  const theme = useSelector(state => state.user.theme);
  const userVerify = useSelector(state => state.user.user.isVerify)
  const apiUrl = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const { isLoged, loginUser, logOut } = useAuth()



  useEffect(() => {
    axios.get(`${apiUrl}/users/valid_session`, getConfigAuth())
      .then(res => {        
      })
      .catch(err => {
        if (err.response) {          
          logOut();
          navigate('/')
        }
      });

    return () => {
      // Opcional: Limpieza si es necesario
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme == 'lightTheme' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/gallery' element={<GalleryPage />} />
          <Route path='/faqs' element={<Faqs />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/profile' element={userVerify ? <Profile /> : <Home />} />
          <Route path='/verify/:verificationToken' element={<VerifyEmail />} />
          <Route path='/recover_account/:verificationToken' element={<RecoverAccount />} />
          <Route path='*' element={<NoMatch />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
