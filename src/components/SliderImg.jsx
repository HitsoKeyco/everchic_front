import React, { useState } from "react";
import './css/SliderImg.css';
import 'react-medium-image-zoom/dist/styles.css';

function SliderImg({ product }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (product) {
            setCurrentSlide((prevSlide) => (prevSlide === product.productImgs.length - 1 ? 0 : prevSlide + 1));
        }
    };

    const prevSlide = () => {
        if (product) {
            setCurrentSlide((prevSlide) => (prevSlide === 0 ? product.productImgs.length - 1 : prevSlide - 1));
        }
    };

    return (
        <div className="slider-container">
            <i className='bx bx-chevron-left bx-flashing slider_home_fade_button_prev left_action_modal' onClick={prevSlide}></i>
            <div className="slide-wrapper">
                {product?.productImgs.map((slide, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : 'inactive'}`}
                    >
                        <img
                            className="magnifier-img"
                            src={slide?.url_medium}
                            alt={`Slide ${index}`}
                            style={{ maxWidth: '100%', cursor: 'pointer' }}
                        />
                    </div>
                ))}
            </div>
            <i className='bx bx-chevron-right bx-flashing slider_home_fade_button_next right_action_modal' onClick={nextSlide}></i>
        </div>
    );
}

export default SliderImg;
