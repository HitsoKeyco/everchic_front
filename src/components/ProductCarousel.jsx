import React from 'react';
import Slider from 'react-slick';
import CardProduct from './CardProduct';
import { Box } from '@mui/material';
import './css/ProductCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = ({ products, nameCollection = '' }) => {
  const settings = {
    dots: true,
    infinite: false, // No infinitas vueltas para evitar repetición incómoda
    speed: 500,
    slidesToShow: Math.min(6, products.length), // Mostrar el número de productos disponibles o 3 si hay más
    slidesToScroll: Math.min(6, products.length), // Desplazarse según el número de productos disponibles

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(5, products.length),
          slidesToScroll: Math.min(5, products.length),
          initialSlide: 0,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(4, products.length),
          slidesToScroll: Math.min(4, products.length),
          initialSlide: 0,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: Math.min(2, products.length),
          initialSlide: 0,

        }
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: Math.min(2, products.length),
          slidesToScroll: 2,
          initialSlide: 0,
        }
      }
    ]
  };

  return (
    <Box sx={{ paddingTop: '20px' }}>
      <Box>
        <p>{`${nameCollection ? `Colección de ${nameCollection}` : 'Productos nuevos 🔥🔥🔥'  } `}</p>
        
        <Slider {...settings} sx={{ backgroundColor: 'red' }}>
          {products?.map((product, index) => (
            <Box key={index} sx={{ padding: '10px' }}>
              <CardProduct product={product} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductCarousel;
