import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gifImage from '../img/banner.jpeg';
import '../Pages/css/Home.css';
import getApiProducts from '../hooks/getApiProducts';
import CardProduct from '../components/CardProduct';
import getApiCollections from '../hooks/getApiCollections';
import { motion } from 'framer-motion';

const Home = () => {
  const { productsAPI, getProductsAPI } = getApiProducts();
  const { collectionAPI, getCollectionAPI } = getApiCollections();
console.log(productsAPI)
  useEffect(() => {
    getProductsAPI();
    getCollectionAPI();
  }, []);

  const [groupedProducts, setGroupedProducts] = useState({});

  const groupProductsByCategory = () => {
    const grouped = {};

    productsAPI?.forEach(product => {
      const categoryName = product.collection.collection;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    setGroupedProducts(grouped);
  };

  useEffect(() => {
    groupProductsByCategory();
  }, [productsAPI]);


  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [widthSliderContainer, setWidthSliderContainer] = useState(0);
  const [widthSlider, setWidthSlider] = useState(0);

  const sliderContainerRef = useRef(null);
  const sliderRef = useRef(null);
  console.log('pantalla', screenWidth);
  console.log('containerSlider', widthSliderContainer);
  console.log('Slider', widthSlider);
  useLayoutEffect(() => {
    if (sliderContainerRef.current && sliderContainerRef.current.offsetWidth && productsAPI) {
      setWidthSlider(sliderRef.current.offsetWidth)
      setWidthSliderContainer(sliderContainerRef.current.offsetWidth);
    }
  }, [screenWidth, productsAPI]);


  // ***********************************ancho de pantalla


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Suscribirse al evento resize
    window.addEventListener('resize', handleResize);

    // Desuscribirse al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  return (
    <>
      <div className='home_banner_container'>
        <img className='home_banner_img' src={gifImage} alt="Descripción" />
      </div>
      <div className="banner-info">
        <span>3 Pares $13 | 6 Pares $20 | 12 Pares $36</span>
      </div>
      <div className='home_cards_products'>
        {collectionAPI?.map(collection => {
          const categoryName = collection.collection;
          const productsInCategory = groupedProducts[categoryName];

          if (productsInCategory && productsInCategory.length > 0) {
            // Calcular el ancho total del slider
            const totalSliderWidth = ((productsInCategory.length) * 172) + 16; // Ancho de cada CardProduct (140 en este caso)
            const leftDragLimit = widthSliderContainer < screenWidth
              ? (widthSliderContainer > totalSliderWidth ? 0 : widthSliderContainer === 1024 ? -totalSliderWidth + 1024 : -totalSliderWidth + screenWidth)
              : 0;

            const dragConstraints = {
              right: 0,
              left: leftDragLimit,
            };
            
            return (
              <div className='home_container_collection' key={collection.id}>
                <p>texto</p>
                <motion.div className="slider-container" ref={sliderContainerRef}>
                  <span className='home_name_collection'>Coleccion {categoryName}</span>

                  <motion.div
                    className='slider'
                    drag='x'
                    dragElastic={1}
                    dragMomentum={true}
                    dragConstraints={dragConstraints}
                    ref={sliderRef}
                    style={{ width: `${totalSliderWidth}px` }}
                  >
                    {productsInCategory.map(product => (
                      <motion.div
                        className='item'
                        key={product.id}

                      >
                        <CardProduct product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            );
          }

          return null;
        })}
      </div>
        <span>Esta es ua prueba de escritura</span>
    </>
  );
};

export default Home;
