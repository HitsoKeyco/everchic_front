import React, { useState } from 'react';
import './css/Footer.css';

const Footer = () => {
    const [isFooterHidden, setIsFooterHidden] = useState(false);

    const handleFooterHidden = () => {
        const footerContainer = document.querySelector('.footer_container');
        const footerToogleIcon = document.querySelector('.footer_toogle');

        footerContainer.classList.toggle('footer_container_hidden');
        setIsFooterHidden(!isFooterHidden);

        if (isFooterHidden) {
            footerToogleIcon.classList.replace('bx-down-arrow', 'bx-up-arrow');
        } else {
            footerToogleIcon.classList.replace('bx-up-arrow', 'bx-down-arrow');
        }
    };

    return (
        <footer className={`footer_container ${isFooterHidden ? '':'footer_container_hidden'}`}>
            <div className="footer_toogle">
                <i className={isFooterHidden ? 'bx bx-down-arrow' : 'bx bx-up-arrow'} onClick={handleFooterHidden}></i>
            </div>
            <p className='footer_copyright_text'>&copy; 2024 Everchic. Todos los derechos reservados.</p>
        </footer>
        
    );
};

export default Footer;