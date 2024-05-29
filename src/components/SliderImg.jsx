import React, { useEffect, useState } from "react";
import './css/SliderImg.css'
import { AnimatePresence, motion } from "framer-motion";

function SliderImg({ product }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    

    const nextSlide = () => {
        if (product) {
            setCurrentSlide((prevSlide) => (prevSlide === product.productImgs.length - 1 ? 0 : prevSlide + 1));
        }
    };

    const prevSlide = () => {
        if(product){
            setCurrentSlide((prevSlide) => (prevSlide === 0 ? product.productImgs.length - 1 : prevSlide - 1));
        }
    };

    // useEffect(() => {
    //     const interval = setInterval(nextSlide, 8000); // Cambio de imagen cada 3 segundos
    //     return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    // }, [currentSlide]); // Se ejecuta nuevamente cuando currentSlide cambia

    return (
        <div className="slider-container">
            <i className='bx bx-chevron-left bx-flashing slider_home_fade_button_prev left_action_modal' onClick={prevSlide}></i>
            <AnimatePresence>
            <div className="slide-wrapper">
                {product?.productImgs.map((slide, index) => (
                    <motion.div
                    key={index}
                    animate={{opacity: 1}}
                    exit={{ opacity: 0}}
                    >
                    <img
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : 'inactive'}`}
                        src={slide?.url}
                        alt={`Slide ${index}`}
                    />
                    </motion.div>
                ))}
            </div>
            </AnimatePresence>
            <i className='bx bx-chevron-right bx-flashing slider_home_fade_button_next right_action_modal' onClick={nextSlide}></i>
        </div>
    );
}

export default SliderImg;
