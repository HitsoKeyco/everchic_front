import React, { useState } from 'react';
import './css/Footer.css';

const Footer = () => {


    return (
        <footer className='footer_container'>

            <div className='footer_section_container'>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title_logo'>Everchic</li>
                        <li><a href="mailto:soporte@everchic.ec" className='footer_link footer_link_email'>soporte@everchic.ec</a></li>
                        <li>Santo Domingo de los Tsachilas - Ecuador</li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title'>Información</li>
                        <li><a href="#" className='footer_link'>Acerca de nosotros 👷</a></li>
                        <li><a href="#" className='footer_link'>Devoluciones 👷</a></li>
                        <li><a href="#" className='footer_link'>Contactanos</a></li>
                        <li><a href="#" className='footer_link'>Trabaja con nosotros 👷</a></li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_info'>
                        <li className='footer_title'>Recursos</li>
                        <li><a href="#" className='footer_link'>Blog 👷</a></li>
                        <li><a href="#" className='footer_link'>Ayuda 👷</a></li>
                    </ul>
                </div>
                <div className='footer_section'>
                    <ul className='footer_social'>
                        <li className='footer_title'>Redes Sociales</li>
                        <li><a href="#" className='footer_link'>Facebook</a></li>
                        <li><a href="#" className='footer_link'>Twitter</a></li>
                        <li><a href="#" className='footer_link'>Instagram</a></li>
                    </ul>
                </div>
            </div>
            <p className='footer_copyright_text'>&copy; 2024 Everchic. Todos los derechos reservados.</p>

        </footer>


    );
};

export default Footer;