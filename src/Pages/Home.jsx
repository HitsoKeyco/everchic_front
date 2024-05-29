import React, { useEffect, useRef, useState } from 'react';
import '../Pages/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import imagesHome from '../utils/imagesHome';
import SliderHomeMovil from '../components/SliderHomeMovil';



const Home = () => {
  const navigate = useNavigate()
  const handdleBuyButton = () => {
    navigate('/products');
  }

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
                <SliderHomeMovil image={imagesHome} />
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
                  <img className='home_img_bottom' src="/unsplash_11.jpg" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="/unsplash_5.png" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="/unsplash_6.png" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="/unsplash_12.jpg" alt="" />
                </div>
                <div className="home_img_bottom_container">
                  <img className='home_img_bottom' src="/unsplash_8.png" alt="" />
                </div>
              </div>
            </div>

            <div className="home_text_elements_container">
              <h1 className='home_h1'>¡Descubre Nuestra Colección Única!</h1>
              <h3 className='home_h3'>Calcetines Divertidos y Originales</h3>
              <p className='home_p_'>Sumérgete en el mundo de la diversión con nuestra exclusiva colección de calcetines cartoon con materiales de alta calidad para alegrar tus pasos cada día.</p>
              <button className='home_main_button'><Link to='/products'>Ir a productos</Link></button>
              <div className="home_models_info">
                <img className='home_models_img' src="/models.png" alt="models" />
                <span className='home_quantity_model'>+ de 600 Modelos</span>
              </div>
            </div>

            <div className="home_instruccion_buy_container">
              <div className="home_ofeer_container"></div>

              <div className='home_instruccion_element'>
                <p className='home_instruccion_title'> Proceso de compra </p>
                <div className="home_instruccion_line"></div>
              </div>

              <div className='home_instruccion_element'>
                <div className="home_instruccion_img_container">
                  <p className='home_instruccion_instruccion_number'>1</p>
                  <p className='home_instruccion_summary'> Elige tus calcetines</p>
                  <div className="home_instruccion_backdrop_img"></div>
                </div>
              </div>

              <div className='home_instruccion_element'>
                <div className="home_instruccion_img_container_2">
                  <p className='home_instruccion_instruccion_number'>2</p>
                  <p className='home_instruccion_summary'> Preparamos tu pedido</p>
                  <div className="home_instruccion_backdrop_img"></div>
                </div>
              </div>

              <div className='home_instruccion_element'>
                <div className="home_instruccion_img_container_3">
                  <p className='home_instruccion_instruccion_number'>3</p>
                  <p className='home_instruccion_summary'> Gestionamos el envío</p>
                  <div className="home_instruccion_backdrop_img"></div>
                </div>
              </div>
            </div>

            


          </main>
        </div>
      </motion.div>
    </>

  );
};

export default Home;
