import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import './css/SliderHomeMovil.css'
const SliderHomeMovil = ({ image }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    

    const nextSlide = () => {
        if (image) {
            setCurrentSlide((prevSlide) => (prevSlide === image.length - 1 ? 0 : prevSlide + 1));
        }
    };

    const prevSlide = () => {
        if(image){
            setCurrentSlide((prevSlide) => (prevSlide === 0 ? image.length - 1 : prevSlide - 1));
        }
    };
    return (
        <>
        <div className="slider_home_movil_container">
            <i className='bx bx-chevron-left bx-flashing slider_home__movil_fade_button_prev left_action_modal' onClick={prevSlide}></i>
            <AnimatePresence>
            <div className="slide-wrapper">
                {
                image?.map((slide, index) => (
                    <motion.div
                    key={index}
                    animate={{opacity: 1}}
                    exit={{ opacity: 0}}
                    >
                    <img
                        key={index}
                        className={`slide_home_movil ${index === currentSlide ? 'active' : 'inactive'}`}
                        src={slide?.src}
                        alt={`Slide ${index}`}
                    />
                    </motion.div>
                ))}
            </div>
            </AnimatePresence>
            <i className='bx bx-chevron-right bx-flashing slider_home__movil_fade_button_next right_action_modal' onClick={nextSlide}></i>
        </div>
        </>
    )
}

export default SliderHomeMovil