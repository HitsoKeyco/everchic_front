import { useEffect, useState } from 'react';
import '../Pages/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import images from '../utils/images';
import axios from 'axios';
import SliderHomeMovil from '../components/SliderHomeMovil';
import imagesProcessBuy from '../utils/imagesProcessBuy';
import BannerHome from '../components/BannerHome';
import ProductCarousel from '../components/ProductCarousel';
import { useDispatch } from 'react-redux';
import { addProductStore } from '../store/slices/cart.slice';
import OptimizedImage from '../components/OptimizedImage';
import SEOHelmet from '../components/SEOHelmet';

const Home = () => {
  const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
  const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handdleBuyButton = () => {
    navigate('/products');
  }

  const [products, setIsNewProducts] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/products/new_product`)
      .then(res => {
        setIsNewProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      })
    // //Trae todos los productos con cantidad, id, stock
      fetchAllQuantityProducts();
  }, [apiUrl])


  const fetchAllQuantityProducts = () => {
    axios.get(`${apiUrl}/products/getAllQuantityProducts`)
      .then(res => {

        localStorage.setItem('everchic_stored_products', JSON.stringify(res.data));
        dispatch(addProductStore(res.data));
      })
      .catch(err => {
        console.log(err);
      })
  };
  return (
    <>
      <SEOHelmet 
        title="EverChic - Inicio | Moda y Estilo"
        description="Bienvenido a EverChic, tu destino de moda online. Descubre las últimas tendencias en ropa y accesorios."
        keywords="moda online, tienda de ropa, accesorios de moda, compras online, tendencias de moda"
        ogTitle="EverChic - Tu Tienda de Moda Online"
        ogDescription="Descubre las últimas tendencias en moda y accesorios en EverChic"
        ogImage="https://everchic.com/images/home-og.jpg"
        ogUrl="https://everchic.com"
      />
      <motion.div
        className="product_filter_elements_container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="app">
          <main className="home_main">

            <div className="home_container_img">
              {
                <SliderHomeMovil image={images} />
              }
            </div>
            {/* Elementos que se muestran para desktop */}
            <div className="home_elements_desktop">
              <div className="home_images_container">
                <h1 className='home_title'>
                  Calcetines <br />
                  comics y deportivos.
                </h1>
                <h2 className='home_phrase_welcome'>
                  Bienvenido a everchic, aqui podrás encontrar <br /> calcetines con personajes de series animadas tejidos o sublimados.
                </h2>
                <button className='home_btn_buy button' onClick={handdleBuyButton}>Comprar</button>

              </div>
              <div className="home_box_img_container">
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="./img/1.webp" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="./img/2.webp" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="./img/3.webp" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="./img/4.webp" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="./img/5.webp" alt="" />
                </div>
              </div>
            </div>

            <div className="home_text_elements_container">
              <h1 className='home_h1'>¡Descubre Nuestra Colección Única!</h1>
              <h3 className='home_h3'><span className='home_span_text_color'>DIVERTIDOS</span> <span className='home_and'> & </span> <span className='home_span_text_color'>ORIGINALES</span></h3>

              <Link className='home_call_to_action' to='/products'>
                <button className='home_main_button button_home'>Productos</button>
              </Link>

              <div className="home_models_info">
                <img className='home_models_img' src="./img/models.png" alt="models" />
                <span className='home_quantity_model'>  + de <span className='home_quantity_models_number'>500</span>  Modelos</span>
              </div>
            </div>
            <div className='home_banner_container'>

            </div>

            <div className='home_products_new_container'>
              <ProductCarousel products={products} />
            </div>

            <h3 className='home_process_buy_title'></h3>

            <div className="home_process_buy_container">

              {imagesProcessBuy.map((img, index) => (
                <div className='home_process_buy_element' key={index}>
                  <div className='home_process_buy_element_title_container'>
                    <h4 className='home_process_buy_element_title'>{img.title}</h4>
                  </div>
                  <div className='home_process_buy_img_container'>
                    <OptimizedImage className='home_process_buy_img' src={img.src} alt="medias everchic" />
                  </div>
                </div>

              ))}
            </div>
            <div>
            </div>
          </main>
        </div>
      </motion.div>
    </>

  );
};

export default Home;
