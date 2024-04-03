import React, { useEffect, useRef, useState } from 'react';
import '../Pages/css/Home.css';
import { Link } from 'react-router-dom';
import SliderImg from '../components/SliderImg';
import { motion } from 'framer-motion';


const Home = () => {

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
                <SliderImg />
              }
            </div>
            {/* Elementos que se muestran para desktop */}
            <div className="home_elements_desktop">
              <div className="home_images_container">
                <h1 className='home_title'>
                  Calcetines de <br />
                  series animadas
                </h1>
                <h2 className='home_phrase_welcome'>
                  Bienvenido a everchic, aqui podrás encontrar <br /> calcetines con personajes de series animadas tejidos o sublimados.
                </h2>
                <button className='home_btn_buy'>Comprar</button>

                <div className="home_models_info_">
                  <img className='home_models_img' src="/models.png" alt="models" />
                  <span className='home_quantity_model_'>+ de 600 Modelos</span>
                </div>

                {/* <div className="home_img_container">
                <img className='home_img' src="/unsplash_1.png" alt="" />
              </div>
              <div className="home_img_container">
                <img className='home_img' src="/unsplash_2.png" alt="" />
              </div>
              <div className="home_img_container">
                <img className='home_img' src="/unsplash_3.png" alt="" />
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
          </main>
        </div>
      </motion.div>
    </>

  );
};

export default Home;
