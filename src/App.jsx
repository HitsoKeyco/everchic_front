// src/App.jsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
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



function App() {

  const userVerify = useSelector(state => state.user.user.isVerify)

  return (
    <>
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
    </>
  );
}

export default App;
