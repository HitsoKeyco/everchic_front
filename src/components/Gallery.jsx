import React from 'react';
import './css/Gallery.css';

const Gallery = ({ images }) => {
    return (
        <>
            {
            images.map((image, index) => (
                <div key={index} className="gallery-image-container">
                    <img src={image.src} alt="image" className="gallery-image" />
                </div>
            ))
            }
        </>
    );
};

export default Gallery;
