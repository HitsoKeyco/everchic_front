import React from 'react';
import Slider from 'react-slick';
import CardProduct from './CardProduct';
import { Box } from '@mui/material';
import './css/ProductCarousel.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = ({ products, updateLikeProducts, nameCollection }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };


  return (
    <Box sx={{ padding: '20px' }}>
      <p> {`Coleccion de ${nameCollection}`}</p>
      <Slider {...settings}>        
        {products?.map((product, index) => (
          <Box key={index} sx={{ padding: '10px' }}>            
            <CardProduct product={product} updateLikeProducts={updateLikeProducts}/>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ProductCarousel;
