import React, { useEffect, useRef, useState } from 'react';
import '../Pages/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import images from '../utils/images';
import axios from 'axios';
import SliderHomeMovil from '../components/SliderHomeMovil';
import SliderHomeNewProducts from '../components/SliderHomeNewProducts';

import imagesProcessBuy from '../utils/imagesProcessBuy';
import imagesTestimony from '../utils/imagesTestimony';
import imagesWarranty from '../utils/imagesWarranty';





const Home = () => {

  const navigate = useNavigate()
  const handdleBuyButton = () => {
    navigate('/products');
  }

  const [products, setIsNewProducts] = useState([]);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${url}/products/new_product`)
      .then(res => {
        setIsNewProducts(res.data);
      })
      .catch(err => console.log(err));
  }, [])

  /* productos like*/
  const [isLike, setIsLike] = useState([])
  const userIdString = localStorage.getItem('user')
  const userId = userIdString ? JSON.parse(userIdString).id : null;
  const urlApi = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (userId) {
      updateLikeProducts();
    }
  }, [userId])

  const updateLikeProducts = () => {
    if (userId) {
      // Usuario autenticado
      axios.get(`${urlApi}/users/like_product/${userId}`)
        .then(res => {
          setIsLike(res.data);
        })
        .catch(err => {
          console.error("Error al obtener los likes del usuario:", err);
        });
    } else {
      // Usuario no autenticado
      const likes = JSON.parse(localStorage.getItem('likes')) || [];
      setIsLike(likes);
    }
  };


  return (
    <>
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
                <button className='home_btn_buy' onClick={handdleBuyButton}>Comprar</button>

                {/* <div className="home_models_info_">
                  <img className='home_models_img' src="/models.png" alt="models" />
                  <span className='home_quantity_model_'>+ de 600 Modelos</span>
                </div> */}

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
                <button className='home_main_button'>Productos</button>
              </Link>

              <div className="home_models_info">
                <img className='home_models_img' src="./img/models.png" alt="models" />
                <span className='home_quantity_model'> + de <span className='home_quantity_models_number'>300</span>  Modelos</span>
              </div>
            </div>

            <div>
              <SliderHomeNewProducts products={products} updateLikeProducts={updateLikeProducts} />
            </div>


            <div className="home_process_buy_container">
              <h3 className='home_process_buy_title'>Proceso de compra</h3>

              {imagesProcessBuy.map((img, index) => (
                <div className='home_process_buy_element' key={index}>
                  <div className='home_process_buy_element_title_container'>
                    <h4 className='home_process_buy_element_title'>{img.title}</h4>
                  </div>
                  <div className='home_process_buy_img_container'>
                    <img className='home_process_buy_img' src={img.src} alt="" />
                  </div>
                </div>
              ))}
            </div>

            <div className="home_process_buy_container">
              <h3 className='home_process_buy_title'>Clientes</h3>

              {
                <SliderHomeMovil image={imagesTestimony} />
              }
            </div>
            <div className='home_stack_container'>
              {
                imagesWarranty.map((img, index) => (
                  <div className='home_stack_element' key={index}>
                    <img className='home_stack_img' src={img.src} alt="img" />
                  </div>

                ))}
            </div>


          </main>
        </div>
      </motion.div>
    </>

  );
};

export default Home;
