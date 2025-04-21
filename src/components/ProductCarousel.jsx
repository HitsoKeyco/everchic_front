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
    slidesToShow: Math.min(6, products?.length || 0),
    slidesToScroll: Math.min(6, products?.length || 0),
    accessibility: true,
    focusOnSelect: false,
    focusOnChange: false,
    swipeToSlide: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { 
          slidesToShow: Math.min(5, products?.length || 0), 
          slidesToScroll: Math.min(5, products?.length || 0),
          accessibility: true,
          focusOnSelect: false,
          focusOnChange: false,
          swipeToSlide: true,
          touchMove: true
        }
      },
      {
        breakpoint: 1024,
        settings: { 
          slidesToShow: Math.min(4, products?.length || 0), 
          slidesToScroll: Math.min(4, products?.length || 0),
          accessibility: true,
          focusOnSelect: false,
          focusOnChange: false,
          swipeToSlide: true,
          touchMove: true
        }
      },
      {
        breakpoint: 600,
        settings: { 
          slidesToShow: Math.min(2, products?.length || 0), 
          slidesToScroll: Math.min(2, products?.length || 0),
          accessibility: true,
          focusOnSelect: false,
          focusOnChange: false,
          swipeToSlide: true,
          touchMove: true
        }
      },
      {
        breakpoint: 460,
        settings: { 
          slidesToShow: Math.min(2, products?.length || 0), 
          slidesToScroll: 2,
          accessibility: true,
          focusOnSelect: false,
          focusOnChange: false,
          swipeToSlide: true,
          touchMove: true
        }
      }
    ]
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        paddingTop: '20px',
        '& .slick-slide': {
          '&:focus': {
            outline: 'none'
          },
          '&[aria-hidden="true"]': {
            display: 'none'
          }
        },
        '& .slick-track': {
          display: 'flex',
          gap: '10px'
        }
      }}
      role="region"
      aria-label={nameCollection ? `Colección de ${nameCollection}` : 'Productos nuevos'}
    >
      <Box>
        <p>{`${nameCollection ? `Colección de ${nameCollection}` : 'Productos nuevos 🔥🔥🔥'}`}</p>
        
        <Slider {...settings} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {products.map((product, index) => (
            <Box 
              key={index} 
              sx={{ 
                padding: '10px',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                '&:focus': {
                  outline: 'none'
                }
              }}
              role="article"
              aria-label={`Producto ${index + 1}`}
              tabIndex={0}
            >
              <CardProduct product={product} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductCarousel;