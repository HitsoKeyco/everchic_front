import React from 'react';
import Slider from 'react-slick';
import CardProduct from './CardProduct';
import { Box } from '@mui/material';
import './css/ProductCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = ({ products, nameCollection = '' }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    slidesToShow: Math.min(6, products.length),
    slidesToScroll: Math.min(6, products.length),
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: Math.min(5, products.length), slidesToScroll: Math.min(5, products.length) }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(4, products.length), slidesToScroll: Math.min(4, products.length) }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: Math.min(2, products.length), slidesToScroll: Math.min(2, products.length) }
      },
      {
        breakpoint: 460,
        settings: { slidesToShow: Math.min(2, products.length), slidesToScroll: 2 }
      }
    ]
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ paddingTop: '20px' }}>
      <Box>
        <p>{`${nameCollection ? `Colección de ${nameCollection}` : 'Productos nuevos 🔥🔥🔥'}`}</p>
        
        <Slider {...settings} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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