import React, { useState } from 'react';
import './css/Footer.css';

const Footer = () => {
    const [isFooterHidden, setIsFooterHidden] = useState(false);

    const handleFooterHidden = () => {
        const footerContainer = document.querySelector('.footer_container');
        const footerToogleIcon = document.querySelector('.footer_toogle i');

        footerContainer.classList.toggle('footer_container_hidden');
        setIsFooterHidden(!isFooterHidden);

        if (isFooterHidden) {
            footerToogleIcon.classList.replace('bx-up-arrow', 'bx-down-arrow');
        } else {
            footerToogleIcon.classList.replace('bx-down-arrow', 'bx-up-arrow');
        }
    };

    return (
        <footer className='footer_container'>
            <div className="footer_toogle">
                <i className={isFooterHidden ? 'bx bx-up-arrow' : 'bx bx-down-arrow'} onClick={handleFooterHidden}></i>
            </div>
            <p className='footer_copyright_text'>&copy; 2024 Everchic. Todos los derechos reservados.</p>
        </footer>
        
    );
};

export default Footer;