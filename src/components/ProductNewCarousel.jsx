import React from 'react';
import Slider from 'react-slick';
import CardProduct from './CardProduct';
import { Box } from '@mui/material';
import './css/ProductCarousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductNewCarousel = ({ products = [] }) => { // Default to an empty array if products is undefined
  const slidesToShow = Math.min(3, products.length);
  const slidesToScroll = Math.min(3, products.length);

  const settings = {
    dots: true,
    infinite: false, // Only make it infinite if there are more than 3 products
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slidesToShow,
          slidesToScroll: slidesToScroll,
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
          slidesToShow: Math.min(1, products.length),
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box>
        <p>Nuevos productos</p>
        <Slider {...settings} sx={{ backgroundColor: 'red' }}>
          {products.map((product, index) => (
            <Box key={index} sx={{ padding: '10px' }}>
              <CardProduct product={product} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductNewCarousel;
